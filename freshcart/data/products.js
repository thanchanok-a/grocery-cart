// Sample catalog. Replace with your own products (or move to a database later).
// price is in dollars; stock is units available; tags help search and the chatbot.

export const CATEGORIES = [
  "Fruit & Veg",
  "Dairy & Eggs",
  "Bakery",
  "Meat & Fish",
  "Pantry",
  "Drinks",
  "Snacks",
];

export const products = [
  // Fruit & Veg
  { id: "p1", name: "Bananas (bunch of 6)", category: "Fruit & Veg", price: 1.99, unit: "bunch", stock: 40, emoji: "🍌", tags: ["fruit", "breakfast", "vegan"] },
  { id: "p2", name: "Gala Apples", category: "Fruit & Veg", price: 3.49, unit: "1 kg bag", stock: 25, emoji: "🍎", tags: ["fruit", "snack", "vegan"] },
  { id: "p3", name: "Hass Avocados", category: "Fruit & Veg", price: 4.99, unit: "pack of 4", stock: 18, emoji: "🥑", tags: ["fruit", "guacamole", "vegan"] },
  { id: "p4", name: "Baby Spinach", category: "Fruit & Veg", price: 2.99, unit: "200 g", stock: 20, emoji: "🥬", tags: ["vegetable", "salad", "vegan"] },
  { id: "p5", name: "Vine Tomatoes", category: "Fruit & Veg", price: 2.79, unit: "500 g", stock: 30, emoji: "🍅", tags: ["vegetable", "salad", "pasta", "vegan"] },
  { id: "p6", name: "Yellow Onions", category: "Fruit & Veg", price: 1.49, unit: "1 kg bag", stock: 50, emoji: "🧅", tags: ["vegetable", "cooking", "vegan"] },
  { id: "p7", name: "Garlic", category: "Fruit & Veg", price: 0.99, unit: "3 bulbs", stock: 60, emoji: "🧄", tags: ["vegetable", "cooking", "pasta", "vegan"] },
  { id: "p8", name: "Carrots", category: "Fruit & Veg", price: 1.29, unit: "1 kg bag", stock: 35, emoji: "🥕", tags: ["vegetable", "soup", "vegan"] },
  { id: "p9", name: "Lemons", category: "Fruit & Veg", price: 2.49, unit: "pack of 4", stock: 0, emoji: "🍋", tags: ["fruit", "cooking", "vegan"] },

  // Dairy & Eggs
  { id: "p10", name: "Whole Milk", category: "Dairy & Eggs", price: 2.69, unit: "2 L", stock: 30, emoji: "🥛", tags: ["milk", "breakfast", "vegetarian"] },
  { id: "p11", name: "Oat Milk", category: "Dairy & Eggs", price: 3.29, unit: "1 L", stock: 15, emoji: "🥛", tags: ["milk", "dairy-free", "vegan", "breakfast"] },
  { id: "p12", name: "Free-Range Eggs", category: "Dairy & Eggs", price: 4.49, unit: "dozen", stock: 22, emoji: "🥚", tags: ["eggs", "breakfast", "baking", "vegetarian"] },
  { id: "p13", name: "Greek Yogurt", category: "Dairy & Eggs", price: 3.99, unit: "500 g", stock: 14, emoji: "🥣", tags: ["yogurt", "breakfast", "vegetarian"] },
  { id: "p14", name: "Cheddar Cheese", category: "Dairy & Eggs", price: 5.49, unit: "400 g", stock: 12, emoji: "🧀", tags: ["cheese", "sandwich", "vegetarian"] },
  { id: "p15", name: "Parmesan", category: "Dairy & Eggs", price: 6.99, unit: "200 g", stock: 9, emoji: "🧀", tags: ["cheese", "pasta", "vegetarian"] },
  { id: "p16", name: "Salted Butter", category: "Dairy & Eggs", price: 3.79, unit: "250 g", stock: 20, emoji: "🧈", tags: ["butter", "baking", "vegetarian"] },

  // Bakery
  { id: "p17", name: "Sourdough Loaf", category: "Bakery", price: 4.99, unit: "800 g", stock: 10, emoji: "🍞", tags: ["bread", "sandwich", "vegan"] },
  { id: "p18", name: "Croissants", category: "Bakery", price: 3.99, unit: "pack of 4", stock: 8, emoji: "🥐", tags: ["pastry", "breakfast", "vegetarian"] },
  { id: "p19", name: "Whole Wheat Tortillas", category: "Bakery", price: 2.99, unit: "pack of 8", stock: 16, emoji: "🌯", tags: ["bread", "tacos", "vegan"] },

  // Meat & Fish
  { id: "p20", name: "Chicken Breast", category: "Meat & Fish", price: 8.99, unit: "1 kg", stock: 12, emoji: "🍗", tags: ["chicken", "protein", "dinner"] },
  { id: "p21", name: "Ground Beef (15% fat)", category: "Meat & Fish", price: 7.49, unit: "500 g", stock: 10, emoji: "🥩", tags: ["beef", "tacos", "pasta", "dinner"] },
  { id: "p22", name: "Atlantic Salmon Fillets", category: "Meat & Fish", price: 11.99, unit: "2 fillets", stock: 6, emoji: "🐟", tags: ["fish", "protein", "dinner"] },

  // Pantry
  { id: "p23", name: "Spaghetti Pasta", category: "Pantry", price: 1.79, unit: "500 g", stock: 40, emoji: "🍝", tags: ["pasta", "dinner", "vegan"] },
  { id: "p24", name: "Basmati Rice", category: "Pantry", price: 3.99, unit: "2 kg", stock: 25, emoji: "🍚", tags: ["rice", "dinner", "vegan"] },
  { id: "p25", name: "Extra Virgin Olive Oil", category: "Pantry", price: 8.49, unit: "750 ml", stock: 14, emoji: "🫒", tags: ["oil", "cooking", "pasta", "salad", "vegan"] },
  { id: "p26", name: "Crushed Tomatoes", category: "Pantry", price: 1.49, unit: "400 g can", stock: 45, emoji: "🥫", tags: ["pasta", "sauce", "soup", "vegan"] },
  { id: "p27", name: "Rolled Oats", category: "Pantry", price: 2.99, unit: "1 kg", stock: 20, emoji: "🌾", tags: ["breakfast", "baking", "vegan"] },
  { id: "p28", name: "Peanut Butter", category: "Pantry", price: 3.99, unit: "500 g", stock: 18, emoji: "🥜", tags: ["spread", "breakfast", "snack", "vegan"] },

  // Drinks
  { id: "p29", name: "Orange Juice", category: "Drinks", price: 3.49, unit: "1.5 L", stock: 20, emoji: "🧃", tags: ["juice", "breakfast", "vegan"] },
  { id: "p30", name: "Sparkling Water", category: "Drinks", price: 4.99, unit: "12 cans", stock: 24, emoji: "💧", tags: ["water", "vegan"] },
  { id: "p31", name: "Ground Coffee", category: "Drinks", price: 7.99, unit: "340 g", stock: 15, emoji: "☕", tags: ["coffee", "breakfast", "vegan"] },

  // Snacks
  { id: "p32", name: "Dark Chocolate 70%", category: "Snacks", price: 2.99, unit: "100 g", stock: 30, emoji: "🍫", tags: ["chocolate", "snack", "vegan"] },
  { id: "p33", name: "Tortilla Chips", category: "Snacks", price: 2.49, unit: "300 g", stock: 26, emoji: "🌽", tags: ["chips", "snack", "tacos", "vegan"] },
  { id: "p34", name: "Mixed Nuts", category: "Snacks", price: 6.49, unit: "400 g", stock: 11, emoji: "🥜", tags: ["nuts", "snack", "protein", "vegan"] },
];
