import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDb, db} from './src/db.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

await initDb();

// --- Mock products ---
const products = [
  { id: 'p1', name: 'Vibe Tee', price: 499 },
  { id: 'p2', name: 'Comfy Hoodie', price: 1499 },
  { id: 'p3', name: 'Sneakers', price: 2499 },
  { id: 'p4', name: 'Wireless Buds', price: 1999},
  { id: 'p5', name: 'Water Bottle', price: 299 },
  { id: 'p6', name: 'Cap', price: 399 },
  { id: 'p7', name: 'Backpack', price: 1299 },
  { id: 'p8', name: 'Desk Lamp', price: 899 }
];

// --- Routes ---
app.get('/api/products', (req, res) => res.json(products));

app.get('/api/cart', async (req, res) => {
  const items = await db.all('SELECT * FROM cart');
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  res.json({ items, total });
});

app.post('/api/cart', async (req, res) => {
  const { productId, name, price, qty } = req.body;
  if (!productId || typeof qty !== 'number')
    return res.status(400).json({ error: 'productId and qty required' });

  const existing = await db.get('SELECT * FROM cart WHERE productId = ?', [productId]);
  if (existing) {
    if (qty <= 0)
      await db.run('DELETE FROM cart WHERE id = ?', [existing.id]);
    else
      await db.run('UPDATE cart SET qty = ? WHERE id = ?', [qty, existing.id]);
  } else if (qty > 0) {
    await db.run('INSERT INTO cart (productId, name, price, qty) VALUES (?, ?, ?, ?)',
      [productId, name, price, qty]);
  }

  const items = await db.all('SELECT * FROM cart');
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  res.json({ items, total });
});

app.delete('/api/cart/:id', async (req, res) => {
  await db.run('DELETE FROM cart WHERE id = ?', [req.params.id]);
  const items = await db.all('SELECT * FROM cart');
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  res.json({ items, total });
});

app.post('/api/checkout', async (req, res) => {
  const items = await db.all('SELECT * FROM cart');
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  await db.run('DELETE FROM cart');
  res.json({ ok: true, receipt: { total, timestamp: new Date().toISOString(), itemsCount: items.length } });
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
