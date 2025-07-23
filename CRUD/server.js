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
  try{
    const menu = await db.collection(menuCollection).find().toArray();
    

    menu.forEach(item => {
      if (!Array.isArray(item.hotcold)) item.hotcold = null;
    });

    res.json(menu);
  }catch (err){
    console.error('Error fetching menu: ', err);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }

});

//Save user's cart
app.post('/api/cart/save', async (req, res) => {
  const {email, cart} = req.body;

  if (!email || !Array.isArray(cart)){
    return res.status(400).json({error: 'Invalid cart payload'});
  }

  try{
    await db.collection(cartCollection).updateOne(
      {email},
      {$set: {cart}},
      {upsert: true}
    );
    res.json({message: 'Cart saved successfully'});
  }catch (err){
    console.error('Error saving cart:', err);
    res.status(500).json({ error: 'Server error saving cart' });
  }
});

//Load user's cart
app.get('/api/cart/load', async (req, res) => {
  const email = req.query.email;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const result = await db.collection(cartCollection).findOne({ email });
    res.json({ cart: result?.cart || [] });
  } catch (err) {
    console.error('Error loading cart:', err);
    res.status(500).json({ error: 'Server error loading cart' });
  }
});

// Route to handle placing an order
app.post('/api/order', async (req, res) => {
  try {
    const { email, cart } = req.body;

    if (!email || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const order = {
      email,
      cart,
      createdAt: new Date(),
      status: 'pending', // you can also add: 'completed', 'preparing', etc.
    };

    await db.collection('orders').insertOne(order);
    res.json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});


// Get the latest order for the user
app.get('/api/order/latest', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const latestOrder = await db.collection(ordersCollection)
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    const cart = latestOrder[0]?.cart || [];
    res.json({ cart });
  } catch (err) {
    console.error('Error loading latest order:', err.message, err.stack);
    res.status(500).json({ error: 'Server error loading order' });
  }
});


connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
