// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';
// import dotenv from 'dotenv';

// dotenv.config();

// const DB_FILE = process.env.DB_FILE || './data.db';
// export let db;

// export async function initDb() {
//   db = await open({
//     filename: DB_FILE,
//     driver: sqlite3.Database,
//   });
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS cart (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       productId TEXT NOT NULL UNIQUE,
//       name TEXT NOT NULL,
//       price REAL NOT NULL,
//       qty INTEGER NOT NULL
//     );
//   `);
//   console.log('✅ SQLite database ready');
// }
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

const DB_FILE = process.env.DB_FILE || './data.db';
export let db;

// Initialize SQLite database
export async function initDb() {
  db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database,
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      qty INTEGER NOT NULL
    );
  `);
  console.log('✅ SQLite database ready');
}

// ✅ Fetch product data (Fake Store API or local mock)
export async function getProductsSource() {
  const useFake = process.env.USE_FAKE_STORE === '1';
  const url = process.env.FAKE_STORE_URL || 'https://fakestoreapi.com/products?limit=8';

  // fallback mock products if API is off or fails
  const mockProducts = [
    { id: 'p1', name: 'Vibe Tee', price: 499 },
    { id: 'p2', name: 'Comfy Hoodie', price: 1499 },
    { id: 'p3', name: 'Sneakers', price: 2499 },
    { id: 'p4', name: 'Wireless Buds', price: 1999 },
    { id: 'p5', name: 'Water Bottle', price: 299 },
    { id: 'p6', name: 'Cap', price: 399 },
    { id: 'p7', name: 'Backpack', price: 1299 },
    { id: 'p8', name: 'Desk Lamp', price: 899 }
  ];

  // If USE_FAKE_STORE=0, return local mock data
  if (!useFake) return mockProducts;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Map API data to include image URLs
    return (data || []).map(p => ({
      id: String(p.id),
      name: p.title || p.name || `Item ${p.id}`,
      price: Number(p.price) || 0,
      image: p.image || null
    }));
  } catch (e) {
    console.error('⚠️ Fake Store fetch failed, using mock data instead:', e.message);
    return mockProducts;
  }
}
