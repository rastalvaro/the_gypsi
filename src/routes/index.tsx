import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { GYPSI } from '../gypsiData'
import {
  Nav, Hero, MarqueeBand, Ritual,
  ProductFeature, Ingredients, Line,
  Campaign, Reviews, Newsletter, Footer, CartDrawer,
} from '../gypsiSections'

export const Route = createFileRoute('/')({
  component: GypsiApp,
})

type Product = typeof GYPSI.line[number]
type CartItem = Product & { qty: number }

function GypsiApp() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  const addToCart = (p: Product) => {
    setCart((c) => {
      const f = c.find((i) => i.id === p.id)
      if (f) return c.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...c, { ...p, qty: 1 }]
    })
    setCartOpen(true)
  }

  const changeQty = (id: string, d: number) =>
    setCart((c) => c.flatMap((i) => i.id === id ? (i.qty + d <= 0 ? [] : [{ ...i, qty: i.qty + d }]) : [i]))

  const count = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <>
      <Nav cartCount={count} onCart={() => setCartOpen(true)} />
      <Hero headline={'The\nMiracle\nSerum'} />
      <MarqueeBand />
      <ProductFeature onAdd={addToCart} />
      <Ritual />
      <Ingredients />
      <Line onAdd={addToCart} />
      <Campaign />
      <Reviews />
      <Newsletter />
      <Footer />
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onQty={changeQty} />
    </>
  )
}
