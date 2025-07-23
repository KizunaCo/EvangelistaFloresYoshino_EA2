const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "coffee_shop";
const collectionName = "menu";

const menuItems = [
  {
    "category": "coffee",
    "name": "Espresso",
    "description": "Strong and bold, classic espresso shot.",
    "image": "images/espresso.webp",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Single", "price": 120 },
      { "size": "Double", "price": 140 }
    ]
  },
  {
    "category": "coffee",
    "name": "Cappuccino",
    "description": "Creamy and frothy with steamed milk foam.",
    "image": "images/cappuccino.png",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Medium", "price": 150 },
      { "size": "Large", "price": 170 }
    ]
  },
  {
    "category": "coffee",
    "name": "Spanish Latte",
    "description": "Sweetened latte with creamy condensed milk.",
    "image": "images/spanish.jpg",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Medium", "price": 160 },
      { "size": "Large", "price": 180 }
    ]
  },
  {
    "category": "coffee",
    "name": "Mocha",
    "description": "Chocolate-flavored coffee with whipped cream.",
    "image": "images/mochalatte.webp",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Medium", "price": 165 },
      { "size": "Large", "price": 185 }
    ]
  },
  {
    "category": "noncoffee",
    "name": "Matcha Latte",
    "description": "Earthy green tea with steamed milk.",
    "image": "images/matchalatte.jpg",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Medium", "price": 160 },
      { "size": "Large", "price": 180 }
    ]
  },
  {
    "category": "noncoffee",
    "name": "Classic Chocolate",
    "description": "Rich cocoa drink topped with marshmallows.",
    "image": "images/chocolate.jpg",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Medium", "price": 140 },
      { "size": "Large", "price": 160 }
    ]
  },
  {
    "category": "noncoffee",
    "name": "Chai Latte",
    "description": "Spiced tea blend with steamed milk.",
    "image": "images/chailatte.jpg",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Medium", "price": 150 },
      { "size": "Large", "price": 170 }
    ]
  },
  {
    "category": "colddrinks",
    "name": "Iced Latte",
    "description": "Chilled espresso and milk over ice.",
    "image": "images/icedlatte.jpg",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Medium", "price": 150 },
      { "size": "Large", "price": 170 }
    ]
  },
  {
    "category": "colddrinks",
    "name": "Lemon Iced Tea",
    "description": "Refreshing citrus-flavored iced tea.",
    "image": "images/lemontea.jpg",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Medium", "price": 90 },
      { "size": "Large", "price": 110 }
    ]
  },
  {
    "category": "colddrinks",
    "name": "Cookies & Cream Frappe",
    "description": "Cold and creamy with cookie bits.",
    "image": "images/cookiesandcream.jpg",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Medium", "price": 170 },
      { "size": "Large", "price": 190 }
    ]
  },
  {
    "category": "colddrinks",
    "name": "Strawberry Milk",
    "description": "Sweet and fruity cold milk drink.",
    "image": "images/strawberrymilk.jpg",
    "hotcold": ["Hot", "Cold"],
    "sizes": [
      { "size": "Regular", "price": 130 },
      { "size": "Large", "price": 150 }
    ]
  },
  {
    "category": "pastries",
    "name": "Butter Croissant",
    "description": "Light, flaky, and buttery classic.",
    "image": "images/croissant.png",
    "hotcold": null,
    "sizes": [
      { "size": "Regular", "price": 70 }
    ]
  },
  {
    "category": "pastries",
    "name": "Mini Cheesecake",
    "description": "Creamy and rich dessert slice.",
    "image": "images/minicheesecake.jpg",
    "hotcold": null,
    "sizes": [
      { "size": "Regular", "price": 90 }
    ]
  },
  {
    "category": "pastries",
    "name": "Banana Bread",
    "description": "Moist and homemade taste.",
    "image": "images/bananabread.jpg",
    "hotcold": null,
    "sizes": [
      { "size": "Regular", "price": 60 }
    ]
  },
  {
    "category": "pastries",
    "name": "Chocolate Cake",
    "description": "Rich and decadent slice.",
    "image": "images/chocolatecake.jpg",
    "hotcold": null,
    "sizes": [
      { "size": "Regular", "price": 85 }
    ]
  },
  {
    "category": "meals",
    "name": "Bacon & Egg Sandwich",
    "description": "Toasted sandwich with crispy bacon and egg.",
    "image": "images/baconandegg.jpg",
    "hotcold": null,
    "sizes": [
      { "size": "Regular", "price": 120 }
    ]
  },
  {
    "category": "meals",
    "name": "Garlic Tuna Pasta",
    "description": "Light pasta tossed in garlic oil with tuna.",
    "image": "images/garlictuna.jpg",
    "hotcold": null,
    "sizes": [
      { "size": "Regular", "price": 140 }
    ]
  }
  
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