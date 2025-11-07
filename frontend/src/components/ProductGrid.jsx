import React from 'react'

export default function ProductGrid({ products, onAdd }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="rounded-2xl shadow p-4 bg-white flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="opacity-80">₹{p.price}</p>
            </div>
            <button
              onClick={() => onAdd(p, 1)}
              className="mt-4 rounded-xl bg-gray-900 text-white px-3 py-2"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
