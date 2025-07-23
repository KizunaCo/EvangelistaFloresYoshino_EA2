// server.js

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017/';
const dbName = 'coffee_shop';
const menuCollection = 'menu';
const cartCollection = 'cart';
const ordersCollection = 'orders';
const usersCollection = 'users';

let db;

async function connectToDatabase() {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  db = client.db(dbName);

  await db.collection(menuCollection).createIndex({ name: 1 }, { unique: true });
  console.log(`Connected to MongoDB "${dbName}".`);
}

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Serve client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Sign up route
app.post('/signup', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;


    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await db.collection(usersCollection).findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection(usersCollection).insertOne({
      fullname,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Account created successfully' });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


//Login route
app.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await db.collection(usersCollection).findOne({ email: email.toLowerCase() });

    if (!user)
      return res.status(404).json({ error: 'No account with this email' });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ error: 'Incorrect password' });

    res.json({ message: 'Login successful', email: user.email, fullname: user.fullname });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get coffee menu
app.get('/menu', async (req, res) => {
  const menu = await db.collection(menuCollection).find().toArray();
  res.json(menu);
});

// Add to cart
app.post('/cart/add', async (req, res) => {
  const { itemId, quantity } = req.body;
  const item = await db.collection(menuCollection).findOne({ _id: itemId });

  if (!item) return res.status(404).json({ error: 'Item not found' });

  await db.collection(cartCollection).updateOne(
    { itemId },
    { $set: { itemId, name: item.name, price: item.price }, $inc: { quantity } },
    { upsert: true }
  );

  res.json({ message: 'Item added to cart' });
});

// View cart
app.get('/cart', async (req, res) => {
  const cart = await db.collection(cartCollection).find().toArray();
  res.json(cart);
});

// Update cart item quantity
app.post('/cart/update', async (req, res) => {
  const { itemId, quantity } = req.body;
  await db.collection(cartCollection).updateOne({ itemId }, { $set: { quantity } });
  res.json({ message: 'Cart updated' });
});

// Remove item from cart
app.post('/cart/remove', async (req, res) => {
  const { itemId } = req.body;
  await db.collection(cartCollection).deleteOne({ itemId });
  res.json({ message: 'Item removed from cart' });
});

// Place order
app.post('/order', async (req, res) => {
  const cart = await db.collection(cartCollection).find().toArray();
  if (cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  await db.collection(ordersCollection).insertOne({ items: cart, date: new Date() });
  await db.collection(cartCollection).deleteMany({});
  res.json({ message: 'Order placed successfully' });
});

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
