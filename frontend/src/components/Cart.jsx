import React from 'react'

export default function Cart({ cart, onUpdateQty, onRemove }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Cart</h2>
      {cart.items.length === 0 ? (
        <p className="opacity-70">Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {cart.items.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-white rounded-2xl shadow p-3">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm opacity-80">₹{item.price} × {item.qty} = ₹{item.price * item.qty}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 rounded-lg bg-gray-200"
                  onClick={() => onUpdateQty(item.id, Math.max(0, item.qty - 1), item)}
                >-</button>
                <span className="w-8 text-center">{item.qty}</span>
                <button
                  className="px-3 py-2 rounded-lg bg-gray-200"
                  onClick={() => onUpdateQty(item.id, item.qty + 1, item)}
                >+</button>
                <button
                  className="px-3 py-2 rounded-lg bg-red-600 text-white"
                  onClick={() => onRemove(item.id)}
                >Remove</button>
              </div>
            </div>
          ))}
          <div className="text-right font-semibold">Total: ₹{cart.total}</div>
        </div>
      )}
    </section>
  )
}
