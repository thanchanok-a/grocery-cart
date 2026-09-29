// Thai Grocery product catalog. Edit names, prices, stock and emoji here.
// Replace the whole of data/products.js on GitHub with this file.
// price is in dollars; stock is units available; tags help search and the chatbot.

export const CATEGORIES = [
  "Fresh Herbs & Veg",
  "Curry Pastes & Sauces",
  "Rice & Noodles",
  "Meat, Seafood & Tofu",
  "Snacks & Sweets",
  "Drinks",
];

export const products = [
  // Fresh Herbs & Veg
  { id: "t1", name: "Thai Basil (โหระพา)", category: "Fresh Herbs & Veg", price: 2.49, unit: "bunch", stock: 25, emoji: "🌿", tags: ["herb", "basil", "horapa", "green curry", "pho", "vegan"] },
  { id: "t2", name: "Holy Basil (กะเพรา)", category: "Fresh Herbs & Veg", price: 2.99, unit: "bunch", stock: 4, emoji: "🌿", tags: ["herb", "basil", "kaprao", "krapow", "kra pao", "vegan"] },
  { id: "t3", name: "Lemongrass (ตะไคร้)", category: "Fresh Herbs & Veg", price: 1.99, unit: "3 stalks", stock: 30, emoji: "🌾", tags: ["herb", "tom yum", "tom kha", "soup", "vegan"] },
  { id: "t4", name: "Galangal (ข่า)", category: "Fresh Herbs & Veg", price: 3.49, unit: "200 g", stock: 15, emoji: "🫚", tags: ["root", "ginger", "tom yum", "tom kha", "soup", "vegan"] },
  { id: "t5", name: "Kaffir Lime Leaves (ใบมะกรูด)", category: "Fresh Herbs & Veg", price: 2.99, unit: "20 g", stock: 20, emoji: "🍃", tags: ["herb", "makrut", "tom yum", "curry", "vegan"] },
  { id: "t6", name: "Bird's Eye Chilies (พริกขี้หนู)", category: "Fresh Herbs & Veg", price: 2.49, unit: "100 g", stock: 35, emoji: "🌶️", tags: ["chili", "chilli", "spicy", "som tam", "vegan"] },
  { id: "t7", name: "Thai Shallots (หอมแดง)", category: "Fresh Herbs & Veg", price: 2.99, unit: "500 g", stock: 25, emoji: "🧅", tags: ["onion", "shallot", "vegan"] },
  { id: "t8", name: "Thai Eggplant (มะเขือเปราะ)", category: "Fresh Herbs & Veg", price: 3.29, unit: "300 g", stock: 12, emoji: "🍆", tags: ["vegetable", "green curry", "curry", "vegan"] },
  { id: "t9", name: "Limes (มะนาว)", category: "Fresh Herbs & Veg", price: 2.49, unit: "pack of 6", stock: 40, emoji: "🍋", tags: ["lime", "fruit", "tom yum", "som tam", "pad thai", "vegan"] },
  { id: "t10", name: "Green Papaya (มะละกอดิบ)", category: "Fresh Herbs & Veg", price: 3.99, unit: "each", stock: 8, emoji: "🍈", tags: ["papaya", "som tam", "salad", "vegan"] },
  { id: "t11", name: "Nam Dok Mai Mango (มะม่วงน้ำดอกไม้)", category: "Fresh Herbs & Veg", price: 4.99, unit: "pack of 2", stock: 0, emoji: "🥭", tags: ["mango", "fruit", "dessert", "sticky rice", "vegan"] },
  { id: "t12", name: "Bean Sprouts (ถั่วงอก)", category: "Fresh Herbs & Veg", price: 1.49, unit: "300 g", stock: 20, emoji: "🌱", tags: ["vegetable", "pad thai", "noodle", "vegan"] },

  // Curry Pastes & Sauces
  { id: "t13", name: "Fish Sauce (น้ำปลา)", category: "Curry Pastes & Sauces", price: 3.99, unit: "700 ml", stock: 30, emoji: "🐟", tags: ["sauce", "nam pla", "pad thai", "som tam", "curry", "seasoning"] },
  { id: "t14", name: "Oyster Sauce (ซอสหอยนางรม)", category: "Curry Pastes & Sauces", price: 3.49, unit: "300 ml", stock: 22, emoji: "🦪", tags: ["sauce", "stir fry", "kra pao"] },
  { id: "t15", name: "Green Curry Paste (พริกแกงเขียวหวาน)", category: "Curry Pastes & Sauces", price: 3.99, unit: "400 g", stock: 18, emoji: "🍛", tags: ["curry", "paste", "green curry", "gaeng keow wan"] },
  { id: "t16", name: "Red Curry Paste (พริกแกงเผ็ด)", category: "Curry Pastes & Sauces", price: 3.99, unit: "400 g", stock: 18, emoji: "🍛", tags: ["curry", "paste", "red curry"] },
  { id: "t17", name: "Massaman Curry Paste (พริกแกงมัสมั่น)", category: "Curry Pastes & Sauces", price: 4.49, unit: "400 g", stock: 10, emoji: "🍛", tags: ["curry", "paste", "massaman"] },
  { id: "t18", name: "Tom Yum Paste (น้ำพริกต้มยำ)", category: "Curry Pastes & Sauces", price: 3.79, unit: "227 g", stock: 15, emoji: "🍲", tags: ["soup", "paste", "tom yum", "spicy"] },
  { id: "t19", name: "Coconut Milk (กะทิ)", category: "Curry Pastes & Sauces", price: 1.99, unit: "400 ml can", stock: 50, emoji: "🥥", tags: ["coconut", "curry", "tom kha", "dessert", "sticky rice", "vegan"] },
  { id: "t20", name: "Palm Sugar (น้ำตาลปี๊บ)", category: "Curry Pastes & Sauces", price: 3.49, unit: "454 g", stock: 20, emoji: "🍯", tags: ["sugar", "sweet", "pad thai", "som tam", "curry", "vegan"] },
  { id: "t21", name: "Tamarind Paste (น้ำมะขามเปียก)", category: "Curry Pastes & Sauces", price: 2.79, unit: "454 g", stock: 14, emoji: "🫘", tags: ["tamarind", "sour", "pad thai", "vegan"] },
  { id: "t22", name: "Sweet Chili Sauce (น้ำจิ้มไก่)", category: "Curry Pastes & Sauces", price: 2.99, unit: "435 ml", stock: 25, emoji: "🌶️", tags: ["sauce", "dip", "chili", "vegan"] },
  { id: "t23", name: "Sriraja Panich Chili Sauce (ซอสพริกศรีราชา)", category: "Curry Pastes & Sauces", price: 3.99, unit: "300 ml", stock: 16, emoji: "🔥", tags: ["sauce", "sriracha", "chili", "spicy", "vegan"] },

  // Rice & Noodles
  { id: "t24", name: "Thai Jasmine Rice (ข้าวหอมมะลิ)", category: "Rice & Noodles", price: 8.99, unit: "5 lb bag", stock: 30, emoji: "🍚", tags: ["rice", "jasmine", "hom mali", "curry", "kra pao", "vegan"] },
  { id: "t25", name: "Sticky Rice (ข้าวเหนียว)", category: "Rice & Noodles", price: 4.49, unit: "2 lb bag", stock: 20, emoji: "🍙", tags: ["rice", "glutinous", "sticky rice", "mango", "dessert", "som tam", "vegan"] },
  { id: "t26", name: "Pad Thai Rice Noodles (เส้นจันท์)", category: "Rice & Noodles", price: 2.99, unit: "400 g", stock: 30, emoji: "🍜", tags: ["noodle", "rice noodle", "pad thai", "vegan"] },
  { id: "t27", name: "Wide Rice Noodles (เส้นใหญ่)", category: "Rice & Noodles", price: 2.79, unit: "400 g", stock: 18, emoji: "🍜", tags: ["noodle", "pad see ew", "drunken noodle", "vegan"] },
  { id: "t28", name: "Glass Noodles (วุ้นเส้น)", category: "Rice & Noodles", price: 1.99, unit: "250 g", stock: 22, emoji: "🍜", tags: ["noodle", "bean thread", "yum woon sen", "salad", "vegan"] },
  { id: "t29", name: "Mama Tom Yum Instant Noodles (มาม่า ต้มยำกุ้ง)", category: "Rice & Noodles", price: 5.99, unit: "pack of 10", stock: 40, emoji: "🍜", tags: ["noodle", "instant", "mama", "tom yum", "snack"] },

  // Meat, Seafood & Tofu
  { id: "t30", name: "Chicken Thighs (boneless) (สะโพกไก่)", category: "Meat, Seafood & Tofu", price: 7.99, unit: "1 kg", stock: 14, emoji: "🍗", tags: ["chicken", "gai", "curry", "kra pao", "protein"] },
  { id: "t31", name: "Pork Belly (หมูสามชั้น)", category: "Meat, Seafood & Tofu", price: 6.99, unit: "500 g", stock: 10, emoji: "🥓", tags: ["pork", "moo", "crispy pork", "protein"] },
  { id: "t32", name: "Ground Pork (หมูสับ)", category: "Meat, Seafood & Tofu", price: 4.99, unit: "500 g", stock: 15, emoji: "🥩", tags: ["pork", "minced", "kra pao", "larb", "protein"] },
  { id: "t33", name: "Shrimp (peeled) (กุ้ง)", category: "Meat, Seafood & Tofu", price: 10.99, unit: "1 lb", stock: 9, emoji: "🦐", tags: ["shrimp", "prawn", "goong", "tom yum", "pad thai", "seafood", "protein"] },
  { id: "t34", name: "Firm Tofu (เต้าหู้แข็ง)", category: "Meat, Seafood & Tofu", price: 2.49, unit: "400 g", stock: 20, emoji: "🥢", tags: ["tofu", "pad thai", "protein", "vegan", "vegetarian"] },
  { id: "t35", name: "Eggs (ไข่ไก่)", category: "Meat, Seafood & Tofu", price: 4.49, unit: "dozen", stock: 24, emoji: "🥚", tags: ["egg", "pad thai", "kra pao", "fried egg", "vegetarian"] },

  // Snacks & Sweets
  { id: "t36", name: "Dried Mango (มะม่วงอบแห้ง)", category: "Snacks & Sweets", price: 4.99, unit: "200 g", stock: 20, emoji: "🥭", tags: ["mango", "snack", "dried fruit", "vegan"] },
  { id: "t37", name: "Coconut Rolls (ทองม้วน)", category: "Snacks & Sweets", price: 3.99, unit: "150 g", stock: 15, emoji: "🥥", tags: ["coconut", "cookie", "snack", "dessert"] },
  { id: "t38", name: "Shrimp Chips (ข้าวเกรียบกุ้ง)", category: "Snacks & Sweets", price: 2.99, unit: "150 g", stock: 25, emoji: "🍤", tags: ["chips", "crackers", "snack", "shrimp"] },
  { id: "t39", name: "Durian Chips (ทุเรียนทอด)", category: "Snacks & Sweets", price: 6.99, unit: "100 g", stock: 6, emoji: "🌰", tags: ["durian", "chips", "snack", "vegan"] },

  // Drinks
  { id: "t40", name: "Thai Tea Mix (Cha Tra Mue) (ชาตรามือ)", category: "Drinks", price: 6.99, unit: "400 g", stock: 18, emoji: "🧋", tags: ["tea", "thai tea", "cha yen", "milk tea", "drink"] },
  { id: "t41", name: "Sweetened Condensed Milk (นมข้นหวาน)", category: "Drinks", price: 2.49, unit: "397 g can", stock: 30, emoji: "🥛", tags: ["milk", "thai tea", "coffee", "dessert", "cha yen"] },
  { id: "t42", name: "Coconut Water (น้ำมะพร้าว)", category: "Drinks", price: 3.99, unit: "1 L", stock: 20, emoji: "🥥", tags: ["coconut", "drink", "vegan"] },
  { id: "t43", name: "Thai Iced Coffee Mix (Oliang) (โอเลี้ยง)", category: "Drinks", price: 5.99, unit: "450 g", stock: 12, emoji: "☕", tags: ["coffee", "oliang", "iced coffee", "drink", "vegan"] },
];
