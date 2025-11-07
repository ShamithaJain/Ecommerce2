import React, { useEffect, useState } from 'react'
import ProductGrid from './components/ProductGrid.jsx'
import Cart from './components/Cart.jsx'
import CheckoutModal from './components/CheckoutModal.jsx'

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [showCheckout, setShowCheckout] = useState(false)

  async function fetchProducts() {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
  }

  async function fetchCart() {
    const res = await fetch('/api/cart')
    const data = await res.json()
    setCart(data)
  }

  useEffect(() => {
    fetchProducts()
    fetchCart()
  }, [])

  async function addToCart(p, qty = 1) {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: p.id, name: p.name, price: p.price, qty })
    })
    const data = await res.json()
    setCart(data)
  }

  async function updateQty(itemId, newQty, item) {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: item.productId, name: item.name, price: item.price, qty: newQty })
    })
    const data = await res.json()
    setCart(data)
  }

  async function removeFromCart(id) {
    const res = await fetch(`/api/cart/${id}`, { method: 'DELETE' })
    const data = await res.json()
    setCart(data)
  }

  async function checkout(name, email) {
    const res = await fetch('/api/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.ok) {
      alert(`Thank you, ${name}!\nTotal: ₹${data.receipt.total}\nTime: ${data.receipt.timestamp}`)
      setCart({ items: [], total: 0 })
      setShowCheckout(false)
    } else {
      alert('Checkout failed. Please try again.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vibe Commerce — Mock Cart</h1>
        <button
          onClick={() => setShowCheckout(true)}
          className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
          disabled={cart.items.length===0}
        >
          Checkout ({cart.items.length}) — ₹{cart.total}
        </button>
      </header>

      <ProductGrid products={products} onAdd={addToCart} />

      <Cart cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} />

      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} onSubmit={checkout} />
      )}
    </div>
  )
}
