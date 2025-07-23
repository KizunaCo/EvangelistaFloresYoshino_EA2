const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "cafetano";
const collectionName = "menu";

const menuItems = [
  {
    category: "coffee",
    name: "Espresso",
    description: "Strong and bold, classic espresso shot.",
    image: "images/espresso.webp",
    hotcold: ["Hot", "Cold"],
    sizes: [
      { size: "Single", price: 120 },
      { size: "Double", price: 140 },
    ],
  },
  {
    category: "coffee",
    name: "Cappuccino",
    description: "Creamy and frothy with steamed milk foam.",
    image: "images/cappuccino.png",
    hotcold: ["Hot", "Cold"],
    sizes: [
      { size: "Medium", price: 150 },
      { size: "Large", price: 170 },
    ],
  },
  {
    category: "coffee",
    name: "Spanish Latte",
    description: "Sweetened latte with creamy condensed milk.",
    image: "images/spanish.jpg",
    hotcold: ["Hot", "Cold"],
    sizes: [
      { size: "Medium", price: 160 },
      { size: "Large", price: 180 },
    ],
  },
  {
    category: "coffee",
    name: "Mocha",
    description: "Chocolate-flavored coffee with whipped cream.",
    image: "images/mochalatte.webp",
    hotcold: ["Hot", "Cold"],
    sizes: [
      { size: "Medium", price: 165 },
      { size: "Large", price: 185 },
    ],
  },
  {
    category: "noncoffee",
    name: "Matcha Latte",
    description: "Earthy green tea with steamed milk.",
    image: "images/matchalatte.jpg",
    hotcold: ["Hot", "Cold"],
    sizes: [
      { size: "Medium", price: 160 },
      { size: "Large", price: 180 },
    ],
  },
];

async function seedMenu() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({}); // Clear existing
    await collection.insertMany(menuItems);

    console.log("Menu seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seedMenu();
