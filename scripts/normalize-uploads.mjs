#!/usr/bin/env node
// Server-side image normalization for CMS uploads.
//
// Sveltia commits uploads in whatever format the client picked (PNG, WebP, JPEG,
// HEIC, …). This script — run in CI on every push that touches the media folder —
// converts any non-target image into the format this site serves, deletes the
// original, and rewrites the matching reference in content/*.json so nothing breaks.
// Already-target files and generated responsive variants are skipped (idempotent).
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const MEDIA_DIR     = 'public/img';
const PUBLIC_PREFIX = '/img';
const TARGET_EXT    = '.jpeg';        // e.g. .jpeg / .webp
const QUALITY       = 88;
const MAXDIM        = 2048;
const CONTENT_DIR   = 'content';

// Skip: already target format, or a generated responsive variant ("name-640.webp").
const isVariant = (f) => /-\d+\.(webp|avif)$/i.test(f);
const isTarget  = (f) => f.toLowerCase().endsWith(TARGET_EXT);
const isRaster  = (f) => /\.(png|jpe?g|webp|avif|gif|tiff?|bmp|heic|heif)$/i.test(f);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

// Try ImageMagick 7 (`magick`) then fall back to v6 (`convert`).
function convert(src, dst) {
  const args = `"${src}" -auto-orient -strip -resize "${MAXDIM}x${MAXDIM}>" -quality ${QUALITY} "${dst}"`;
  try { execSync(`magick ${args}`, { stdio: 'pipe' }); }
  catch { execSync(`convert ${args}`, { stdio: 'pipe' }); }
}

const mapping = []; // { from: '/img/x.png', to: '/img/x.jpeg' }
for (const file of walk(MEDIA_DIR)) {
  const base = path.basename(file);
  if (!isRaster(base) || isTarget(base) || isVariant(base)) continue;
  const out = file.replace(/\.[^.]+$/, TARGET_EXT);
  try {
    convert(file, out);
    if (out !== file) fs.rmSync(file);
    const rel = (p) => PUBLIC_PREFIX + '/' + path.relative(MEDIA_DIR, p).split(path.sep).join('/');
    mapping.push({ from: rel(file), to: rel(out) });
    console.log(`converted ${file} -> ${out}`);
  } catch (err) {
    console.error(`FAILED to convert ${file}: ${err.message}`);
    process.exitCode = 1;
  }
}

const contentFiles = walk(CONTENT_DIR).filter((p) => p.endsWith('.json'));
const mediaExists = (pub) => fs.existsSync(path.join(MEDIA_DIR, pub.slice(`${PUBLIC_PREFIX}/`.length)));

// Reconcile dangling refs: a content image path whose file is gone but a .jpeg
// sibling exists. This catches CMS "ref-only" regressions — Sveltia re-emits an
// upload's original .webp path on a later save (after this script already renamed
// the file to .jpeg), and that save touches no media file, so the conversion loop
// above finds nothing and old code bailed early, shipping a broken image. Here we
// repair the ref to the .jpeg master that actually exists.
const RASTER_RE = /\/img\/[^"'\s]+?\.(?:png|jpe?g|webp|avif|gif|tiff?|bmp|heic|heif)/gi;
const dangling = new Map(); // from -> to
for (const f of contentFiles) {
  for (const ref of fs.readFileSync(f, 'utf8').match(RASTER_RE) || []) {
    if (/-\d+\.[a-z]+$/i.test(ref)) continue;            // skip responsive variants
    if (mediaExists(ref) || dangling.has(ref)) continue; // resolves, or already queued
    const jpeg = ref.replace(/\.[^.]+$/, TARGET_EXT);
    if (mediaExists(jpeg)) dangling.set(ref, jpeg);
    else console.warn(`⚠ ${ref} (in ${f}) has no master and no ${TARGET_EXT} sibling — cannot auto-repair.`);
  }
}

const rewrites = [...mapping, ...[...dangling].map(([from, to]) => ({ from, to }))];
if (!rewrites.length) { console.log('Nothing to normalize or reconcile.'); process.exit(process.exitCode || 0); }

// Rewrite references in content/*.json (exact-string replace of the public path).
for (const f of contentFiles) {
  let txt = fs.readFileSync(f, 'utf8');
  let changed = false;
  for (const { from, to } of rewrites) {
    if (txt.includes(from)) { txt = txt.split(from).join(to); changed = true; }
  }
  if (changed) { fs.writeFileSync(f, txt); console.log(`rewrote refs in ${f}`); }
}
console.log(`Normalized ${mapping.length} image(s); reconciled ${dangling.size} dangling ref(s).`);
