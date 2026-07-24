// app/shop/products.ts

// Category type for better type narrowing
export type ProductCategory = 
  | 'Vegetables' 
  | 'Fruits' 
  | 'Tubers' 
  | 'Juices' 
  | 'Fruit Juices' 
  | 'Vegetable Juices' 
  | 'Detox Juices' 
  | 'Smoothies' 
  | 'Fresh Smoothies' 
  | 'Green Smoothies' 
  | 'Salads' 
  | 'Vegetable Salads' 
  | 'Fruit Salads' 
  | 'Herbs' 
  | 'Leafy Greens' 
  | 'Other';

export type ProductVariant = {
  size: string;       // e.g., "350ml", "500ml", "1L", "400g", "800g", "per piece"
  price: number;
  unit?: string;      // optional override (e.g., "per bottle" if size already implies unit)
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  image?: string;           // Cloudinary URL or local path
  isStatic?: boolean;       // true for items from this static file
  // Either price+unit for simple products, or variants for multi-size products
  price?: number;
  unit?: string;
  variants?: ProductVariant[];
  description?: string;     // Optional custom description for products with multiple ingredients
  createdAt?: any;
  updatedAt?: any;
};

export const products: Product[] = [
  // ==================== VEGETABLES ====================
  { id: "v1",  name: "Red onions",         slug: "red-onions",          category: "Vegetables", price: 140, unit: "per kg", image: "/images/products/red-onions.webp" },
  { id: "v2",  name: "White onions",       slug: "white-onions",        category: "Vegetables", price: 165, unit: "per kg", image: "/images/products/white-onions1.jpg" },
  { id: "v3",  name: "Okra",               slug: "okra",                category: "Vegetables", price: 245, unit: "per kg", image: "/images/products/Okra+Lede.webp" },
  { id: "v4",  name: "Carrots",            slug: "carrots",             category: "Vegetables", price: 105, unit: "per kg", image: "/images/products/carrots.avif" },
  { id: "v5",  name: "Tomatoes",           slug: "tomatoes",            category: "Vegetables", price: 115, unit: "per kg", image: "/images/products/tomatoes.jpg" },
  { id: "v6",  name: "Egg plant",          slug: "egg-plant",           category: "Vegetables", price: 139, unit: "per kg", image: "/images/products/eggplant.jpg" },
  { id: "v7",  name: "Cucumber",           slug: "cucumber",            category: "Vegetables", price: 175, unit: "per kg", image: "/images/products/Cucumber.webp" },
  { id: "v8",  name: "Red Colored peppers",    slug: "red-colored-peppers",     category: "Vegetables", price: 349, unit: "per kg", image: "/images/products/red-colored-peppers.jpg" },
  { id: "v9",  name: "Cauliflower",        slug: "cauliflower",         category: "Vegetables", price: 199, unit: "per kg", image: "/images/products/cauliflower.webp" },
  { id: "v10", name: "Broccoli",           slug: "broccoli",            category: "Vegetables", price: 199, unit: "per kg", image: "/images/products/cauliflower.jpg" },
  { id: "v11", name: "Green chillies",     slug: "green-chillies",      category: "Vegetables", price: 245, unit: "per kg", image: "/images/products/green-chillies.jpg" },
  { id: "v12", name: "Hard lettuce",       slug: "hard-lettuce",        category: "Vegetables", price:  65, unit: "per piece", image: "/images/products/hard-lettuce.webp" },
  { id: "v13", name: "White cabbage",      slug: "white-cabbage",       category: "Vegetables", price:  45, unit: "per kg", image: "/images/products/white-cabbage.jpg" },
  { id: "v14", name: "Red cabbage",        slug: "red-cabbage",         category: "Vegetables", price: 150, unit: "per kg", image: "/images/products/red-cabbage.avif" },
  { id: "v15", name: "Garden peas",        slug: "garden-peas-veg",     category: "Vegetables", price: 409, unit: "per kg", image: "/images/products/garden-peas.avif" },
  { id: "v16", name: "Ginger",             slug: "ginger",              category: "Vegetables", price: 289, unit: "per kg", image: "/images/products/ginger.jpg" },
  { id: "v17", name: "Imported garlic",    slug: "imported-garlic",     category: "Vegetables", price: 489, unit: "per kg", image: "/images/products/imported-garlic.jpg" },
  { id: "v18", name: "Turmeric",           slug: "turmeric",            category: "Vegetables", price: 525, unit: "per kg", image: "/images/products/tumeric.webp" },
  { id: "v19", name: "Yellow colored peppers", slug: "yellow-colored-peppers", category: "Vegetables", price: 349, unit: "per kg", image: "/images/products/yellow-pepper.jpg" },

  // ==================== TUBERS ====================
  { id: "t1", name: "Red sweet potatoes", slug: "red-sweet-potatoes",  category: "Tubers", price: 129, unit: "per kg", image: "/images/products/red-sweet-potatoes.jpg" },
  { id: "t2", name: "White sweet potatoes", slug: "white-sweet-potatoes", category: "Tubers", price: 155, unit: "per kg", image: "/images/products/white-sweet-potatoes.jpg" },
  { id: "t3", name: "Arrowroot",          slug: "arrowroot",           category: "Tubers", price: 179, unit: "per kg", image: "/images/products/arrowroots.jpg" },
  { id: "t4", name: "Matoke",             slug: "matoke",              category: "Tubers", price:  89, unit: "per kg", image: "/images/products/matoke.jpg" },
  { id: "t5", name: "Beetroot",           slug: "beetroot",            category: "Tubers", price: 219, unit: "per kg", image: "/images/products/beetroot.webp" },
  { id: "t6", name: "Fine beans",         slug: "fine-beans",          category: "Tubers", price: 199, unit: "per kg", image: "/images/products/finebeans.jpg" },
  { id: "t7", name: "Snow peas",          slug: "snow-peas",           category: "Tubers", price: 299, unit: "per kg", image: "/images/products/snow-peas.jpg" },
  { id: "t8", name: "Sugarsnap peas",     slug: "sugarsnap-peas",      category: "Tubers", price: 349, unit: "per kg", image: "/images/products/sugarsnap.jpg" },
  { id: "t9", name: "Potatoes",           slug: "potatoes",            category: "Tubers", price: 89, unit: "per kg", image: "/images/products/potatoes.jpg" },

  // ==================== FRUITS ====================
  { id: "f1", name: "Ngowe mangoes",      slug: "ngowe-mangoes",       category: "Fruits", price: 125, unit: "per kg", image: "/images/products/ngowe-mangoes.jpg" },
  { id: "f2", name: "Tommy mangoes",      slug: "tommy-mangoes",       category: "Fruits", price: 129, unit: "per kg", image: "/images/products/ngowe.webp" },
  { id: "f3", name: "Tree tomatoes",      slug: "tree-tomatoes",       category: "Fruits", price: 229, unit: "per kg", image: "/images/products/cherry-tomato.jpg" },
  { id: "f4", name: "Black passion",      slug: "black-passion",       category: "Fruits", price: 340, unit: "per kg", image: "/images/products/black-passion.jpg" },
  { id: "f5", name: "Local oranges",      slug: "local-oranges",       category: "Fruits", price: 129, unit: "per kg", image: "/images/products/local-oranges.jpg" },
  { id: "f6", name: "Green lime",         slug: "green-lime",          category: "Fruits", price: 249, unit: "per kg", image: "/images/products/green-lime.jpg" },
  { id: "f7", name: "Pawpaw",             slug: "pawpaw",              category: "Fruits", price: 179, unit: "per kg", image: "/images/products/pawpaw.jpg" },
  { id: "f8", name: "Sweet bananas",      slug: "sweet-bananas",       category: "Fruits", price: 209, unit: "per kg", image: "/images/products/sweet-bananas.jpg" },
  { id: "f9", name: "Long bananas",       slug: "long-bananas",        category: "Fruits", price:  95, unit: "per kg", image: "/images/products/long-bananas.jpg" },
  { id: "f10", name: "Imported oranges",   slug: "imported-oranges",    category: "Fruits", price: 370, unit: "per kg", image: "/images/products/OrangesImported.webp" },
  { id: "f11", name: "Kiwi",               slug: "kiwi",                category: "Fruits", price: 129, unit: "per kg", image: "/images/products/kiwi.jpg" },
  { id: "f12", name: "Imported lemons",    slug: "imported-lemons",     category: "Fruits", price: 499, unit: "per kg", image: "/images/products/imported-lemons.jpg" },
  { id: "f13", name: "Apples",             slug: "apples",              category: "Fruits", price: 149, unit: "per kg", image: "/images/products/apples.jpg" },
  { id: "f14", name: "Avocado",            slug: "avocado",             category: "Fruits", price: 199, unit: "per kg", image: "/images/products/avocado.jpg" },
  { id: "f15", name: "Strawberries",       slug: "strawberries",        category: "Fruits", price: 499, unit: "per kg", image: "/images/products/strawberry.jpg" },
  { id: "f16", name: "Butternut ",   slug: "butternut",    category: "Fruits", price: 199, unit: "per kg", image: "/images/products/butternutsquash.jpg" },
  { id: "f17", name: "Cherry Tomatoes",    slug: "cherry-tomatoes",     category: "Fruits", price: 199, unit: "per kg", image: "/images/products/cherry-tomato.jpg" },
  { id: "f18", name: "Chevdo",             slug: "chevdo",              category: "Fruits", price: 199, unit: "per kg", image: "/images/products/chevdo.jpg" },
  { id: "f19", name: "Pineapple",         slug: "pineapple",           category: "Fruits", price: 199, unit: "per kg", image: "/images/products/pineapple.jpg" },
  { id: "f20", name: "Red Seedless Grapes", slug: "red-seedless-grapes", category: "Fruits", price: 499, unit: "per kg", image: "/images/products/red-seedless-grapes.jpg" },
  { id: "f21", name: "Blueberries",        slug: "blueberries",         category: "Fruits", price: 499, unit: "per kg", image: "/images/products/blueberries.jpg" },

  // ==================== HERBS & GREENS ====================
  { id: "h1", name: "Dill",               slug: "dill",                category: "Vegetables", price: 20, unit: "per bunch", image: "/images/products/dill.webp" },
  { id: "h2", name: "Parsley",            slug: "parsley",             category: "Vegetables", price: 20, unit: "per bunch", image: "/images/products/parsley.webp" },
  { id: "h3", name: "Palak",              slug: "palak",               category: "Vegetables", price: 20, unit: "per bunch", image: "/images/products/PalakLeaves.webp" },
  { id: "h4", name: "Mint",               slug: "mint",                category: "Vegetables", price: 25, unit: "per bunch", image: "/images/products/mint.jpg" },
  { id: "h5", name: "Dhania",             slug: "dhania",              category: "Vegetables", price: 20, unit: "per bunch", image: "/images/products/dhania.webp" },
  { id: "h6", name: "Soro",               slug: "soro",                category: "Vegetables", price: 27, unit: "per bunch", image: "/images/products/soro.webp" },

  // ==================== LEAFY GREENS ====================
  { id: "lg1", name: "Terere",            slug: "terere",              category: "Vegetables", price: 27, unit: "per bunch", image: "/images/products/terere.webp" },
  { id: "lg2", name: "Mrenda",            slug: "mrenda",              category: "Vegetables", price: 30, unit: "per bunch", image: "/images/products/mrenda.jpg" },
  { id: "lg3", name: "Sukuma wiki",       slug: "sukuma-wiki",         category: "Vegetables", price: 27, unit: "per bunch", image: "/images/products/sukuma.webp" },
  { id: "lg4", name: "Spinach",           slug: "spinach",             category: "Vegetables", price: 27, unit: "per bunch", image: "/images/products/spinach.jpg" },
  { id: "lg5", name: "Sageti",            slug: "sageti",              category: "Vegetables", price: 27, unit: "per bunch", image: "/images/products/sage.jpg" },
  { id: "lg6", name: "Kunde",             slug: "kunde",               category: "Vegetables", price: 27, unit: "per bunch", image: "/images/products/kunde.webp" },
  { id: "lg7", name: "Nderema",           slug: "nderema",             category: "Vegetables", price: 189, unit: "per kg", image: "/images/products/nderema.png" },
  { id: "lg8", name: "Chopped sukuma",    slug: "chopped-sukuma",      category: "Vegetables", price: 60, unit: "per pnt", image: "/images/products/sukuma.webp" },
  { id: "lg9", name: "Chopped spinach",   slug: "chopped-spinach",     category: "Vegetables", price: 60, unit: "per pnt", image: "/images/products/spinach.jpg" },

  // ==================== FRUIT JUICES (with variants) ====================
  // Fruit Juices (standard pricing 350ml@180, 500ml@250, 1L@425)
  { id: "fj1", name: "Pineapple Juice", slug: "pineapple-juice", category: "Fruit Juices", image: "/images/products/pineapple-juice.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "fj2", name: "Pineapple Mint Juice", slug: "pineapple-mint-juice", category: "Fruit Juices", image: "/images/products/pineapple-juice-with-mint-683x1024.webp", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "fj3", name: "Mango Juice", slug: "mango-juice", category: "Fruit Juices", image: "/images/products/mango-juice.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "fj4", name: "Orange Juice", slug: "orange-juice", category: "Fruit Juices", image: "/images/products/orange-juice.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "fj5", name: "Apple Juice", slug: "apple-juice", category: "Fruit Juices", image: "/images/products/apple-juice.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "fj6", name: "Tangerine Juice", slug: "tangerine-juice", category: "Fruit Juices", image: "/images/products/tangerine.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "fj7", name: "Passion Juice", slug: "passion-juice", category: "Fruit Juices", image: "/images/products/passion-juice.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "fj8", name: "Strawberry Juice", slug: "strawberry-juice", category: "Fruit Juices", image: "/images/products/strawberry-juice.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "fj9", name: "Mixed Forest Berries Juice", slug: "mixed-forest-berries-juice", category: "Fruit Juices", image: "/images/products/berries-juice.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "fj10", name: "Tree Tomato Juice", slug: "tree-tomato-juice", category: "Fruit Juices", image: "/images/products/fresh-tomato-juice-recipe.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "fj11", name: "Watermelon Juice", slug: "watermelon-juice", category: "Fruit Juices", image: "/images/products/watermelon-juice.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  // Ginger Ale (keep original pricing if specified, else use standard; using original)
  { id: "fj12", name: "Mixed fruit berries (Fresh)", slug: "ginger-ale", category: "Fruit Juices", image: "/images/products/ginger-ale.jpg", variants: [
      { size: "350ml", price: 170 }, { size: "500ml", price: 240 }, { size: "1L", price: 430 }
    ] },
  // Cocktail (single serve)
  { id: "fj13", name: "Cocktail Juice", slug: "cocktail-juice", category: "Fruit Juices", price: 250, unit: "per glass", image: "/images/products/cocktailjuice.jpg" },

  // ==================== VEGETABLE JUICES ====================
  // Vegetable Juices (standard pricing)
  { id: "vj1", name: "Beetroot Juice", slug: "beetroot-juice", category: "Vegetable Juices", image: "/images/products/beetroot-juice-recipe.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "vj2", name: "Carrot Juice", slug: "carrot-juice", category: "Vegetable Juices", image: "/images/products/carrot-juice.webp", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "vj3", name: "Kale Juice", slug: "kale-juice", category: "Vegetable Juices", image: "/images/products/kale-juice.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "vj4", name: "Cucumber Juice", slug: "cucumber-juice", category: "Vegetable Juices", image: "/images/products/cucumber-juice.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "vj5", name: "Tomato Juice", slug: "tomato-juice", category: "Vegetable Juices", image: "/images/products/homemade-tomato-juice-recipe.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "vj6", name: "Vitamin Boost Juice", slug: "vitamin-boost-juice", category: "Vegetable Juices", image: "/images/products/vitamin-boost.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },
  { id: "vj7", name: "Booster Dose Juice", slug: "booster-dose-juice", category: "Vegetable Juices", image: "/images/products/booster-dose.jpg", variants: [
      { size: "350ml", price: 180 }, { size: "500ml", price: 250 }, { size: "1L", price: 425 }
    ] },

  // ==================== DETOX JUICES ====================
  // Detox Juices (350ml@200, 500ml@300, 1L@600)
  { id: "dj1", name: "Immunity Detox", slug: "immunity-detox", category: "Detox Juices", image: "/images/products/immunity.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Orange, carrot, ginger, turmeric, and lemon to boost your immune system." },
  { id: "dj2", name: "Tropical Paradise Detox", slug: "tropical-paradise-detox", category: "Detox Juices", image: "/images/products/tropical-paradise.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Mango, pineapple, coconut water, and banana for a refreshing tropical cleanse." },
  { id: "dj3", name: "Garden Green Coco Detox", slug: "garden-green-coco-detox", category: "Detox Juices", image: "/images/products/garden-green.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Spinach, kale, cucumber, celery, and coconut water for a green detox blend." },
  { id: "dj4", name: "Super Juice Detox", slug: "super-juice-detox", category: "Detox Juices", image: "/images/products/super-juice.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Beetroot, carrot, apple, ginger, and lemon – a powerful antioxidant blend." },
  { id: "dj5", name: "Cucumber Apple Detox", slug: "cucumber-apple-detox", category: "Detox Juices", image: "/images/products/cucumber-apple.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Cool cucumber, crisp apple, celery, and parsley for hydration and refreshment." },
  { id: "dj6", name: "Carrot Apple Ginger Detox", slug: "carrot-apple-ginger-detox", category: "Detox Juices", image: "/images/products/carrot-apple-ginger.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Sweet carrots, apples, warming ginger, and turmeric for energy and vitality." },
  { id: "dj7", name: "Radiant Juice Detox", slug: "radiant-juice-detox", category: "Detox Juices", image: "/images/products/radiant.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Beetroot, orange, carrot, and turmeric for glowing skin from within." },
  { id: "dj8", name: "Cucumber Apple Detox (Mint)", slug: "cucumber-apple-mint-detox", category: "Detox Juices", image: "/images/products/cucumber-apple-mint.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Cucumber, apple, celery, and fresh mint for a cooling, refreshing cleanse." },
  { id: "dj9", name: "Heartbeat Detox", slug: "heartbeat-detox", category: "Detox Juices", image: "/images/products/heartbeat.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Beetroot, carrot, apple, and ginger to support cardiovascular health." },
  { id: "dj10", name: "Liver Scrubber Detox", slug: "liver-scrubber-detox", category: "Detox Juices", image: "/images/products/liver-scrubber.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Grapefruit, lemon, beetroot, and turmeric for natural liver cleansing." },
  { id: "dj11", name: "Sunset Blend Detox", slug: "sunset-blend-detox", category: "Detox Juices", image: "/images/products/sunset-blend.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Carrot, orange, mango, and beetroot for a warm, sunset-inspired glow." },
  { id: "dj12", name: "Cucumber Carrot Detox", slug: "cucumber-carrot-detox", category: "Detox Juices", image: "/images/products/cucumber-carrot.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Cucumber, carrot, celery, and green apple for a hydrating, nutrient-rich blend." },
  { id: "dj13", name: "Cucumber Beet Detox", slug: "cucumber-beet-detox", category: "Detox Juices", image: "/images/products/cucumber-beet.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Cucumber, beetroot, carrot, and ginger for a blood-purifying cleanse." },
  { id: "dj14", name: "Cucumber Celery Beet Detox", slug: "cucumber-celery-beet-detox", category: "Detox Juices", image: "/images/products/cucumber-celery-beet.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Cucumber, celery, beetroot, carrot, and apple for a complete green detox." },
  { id: "dj15", name: "Morning Glory Detox", slug: "morning-glory-detox", category: "Detox Juices", image: "/images/products/morning-glory.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Orange, carrot, grapefruit, and lemon to kickstart your morning with energy." },
  { id: "dj16", name: "Tropical Green Detox", slug: "tropical-green-detox", category: "Detox Juices", image: "/images/products/tropical-green.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Pineapple, mango, kale, and spinach for a tropical green fusion." },
  { id: "dj17", name: "Veggie Mix Detox", slug: "veggie-mix-detox", category: "Detox Juices", image: "/images/products/veggie-mix.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Tomato, cucumber, celery, carrot, and bell pepper for a savory vegetable blend." },

  // ==================== VEGETABLE SALADS ====================
  // Vegetable Salads @250 each
  { id: "sv1", name: "Top Fit Salad", slug: "top-fit-salad", category: "Vegetable Salads", price: 250, unit: "each", image: "/images/products/top-fit.jpg", description: "Crisp lettuce, cucumber, tomatoes, carrots, and avocado with our signature dressing." },
  { id: "sv2", name: "Excel Salad", slug: "excel-salad", category: "Vegetable Salads", price: 250, unit: "each", image: "/images/products/excel.jpg", description: "Fresh greens, red cabbage, beets, hard-boiled eggs, and croutons with garlic vinaigrette." },
  { id: "sv3", name: "Performance Salad", slug: "performance-salad", category: "Vegetable Salads", price: 250, unit: "each", image: "/images/products/performance.jpg", description: "Kale, spinach, quinoa, roasted sweet potatoes, and grilled chicken with citrus dressing." },

  // ==================== FRUIT SALADS ====================
  // Fruit Salads @280 each
  { id: "sf1", name: "Exotic Fruit Salad", slug: "exotic-fruit-salad", category: "Fruit Salads", price: 280, unit: "each", image: "/images/products/exotic.jpg", description: "Mangoes, pineapples, passion fruit, kiwi, and dragon fruit with honey-lime dressing." },
  { id: "sf2", name: "Yummy Fruit Salad", slug: "yummy-fruit-salad", category: "Fruit Salads", price: 280, unit: "each", image: "/images/products/yummy.jpg", description: "Strawberries, blueberries, grapes, bananas, and apples with vanilla yogurt drizzle." },
  { id: "sf3", name: "Tasty & Healthy Fruit Salad", slug: "tasty-healthy-fruit-salad", category: "Fruit Salads", price: 280, unit: "each", image: "/images/products/tasty-healthy.jpg", description: "Oranges, watermelons, pawpaw, cucumber, and mint with fresh lime juice." },
  { id: "sf4", name: "Safari Punch Fruit Salad", slug: "safari-punch-fruit-salad", category: "Fruit Salads", price: 280, unit: "each", image: "/images/products/safari-punch.jpg", description: "Tropical mix of mangoes, pineapples, bananas, and coconut with a hint of ginger." },
  { id: "sf5", name: "Kilimanjaro Slush Fruit Salad", slug: "kilimanjaro-slush-fruit-salad", category: "Fruit Salads", price: 280, unit: "each", image: "/images/products/kilimanjaro.jpg", description: "Frozen berries, grapes, and citrus served as a refreshing slush with mint." },
  { id: "sf6", name: "Jungle Fever Fruit Salad", slug: "jungle-fever-fruit-salad", category: "Fruit Salads", price: 280, unit: "each", image: "/images/products/jungle-fever.jpg", description: "Passion fruit, mangoes, pineapples, and lychees with spicy chili-lime seasoning." },
  { id: "sf7", name: "Tropical Sensation Fruit Salad", slug: "tropical-sensation-fruit-salad", category: "Fruit Salads", price: 280, unit: "each", image: "/images/products/tropical-sensation.jpg", description: "A blend of mango, pineapple, coconut, banana, and guava with creamy coconut cream." },

  // ==================== FRESH SMOOTHIES ====================
  // Yogurt Smoothies (250ml@250, 500ml@300, 1L@600)
  { id: "sy1", name: "Mango Tango Smoothie", slug: "mango-tango-smoothie", category: "Fresh Smoothies", image: "/images/products/mango-tango.jpg", variants: [
      { size: "250ml", price: 250 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Sweet mangoes blended with creamy yogurt and a hint of vanilla." },
  { id: "sy2", name: "Strawberry Kiwi Smoothie", slug: "strawberry-kiwi-smoothie", category: "Fresh Smoothies", image: "/images/products/strawberry-kiwi.jpg", variants: [
      { size: "250ml", price: 250 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Fresh strawberries and tangy kiwi fruits blended with honey yogurt." },
  { id: "sy3", name: "Mango Passion Smoothie", slug: "mango-passion-smoothie", category: "Fresh Smoothies", image: "/images/products/peach-mango-smoothie-with-yogurt.jpg", variants: [
      { size: "250ml", price: 250 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Ripe mangoes and black passion fruit swirled with smooth yogurt." },
  { id: "sy4", name: "Banana Ginger Smoothie", slug: "banana-ginger-smoothie", category: "Fresh Smoothies", image: "/images/products/banana-ginger.jpg", variants: [
      { size: "250ml", price: 250 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Creamy bananas with warming ginger, honey, and protein-rich yogurt." },
  { id: "sy5", name: "Tutti Frutti Fusion Smoothie", slug: "tutti-frutti-fusion-smoothie", category: "Fresh Smoothies", image: "/images/products/mixed-berry-smoothie-recipe.jpg", variants: [
      { size: "250ml", price: 250 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "A colorful blend of strawberries, blueberries, raspberries, and bananas." },
  { id: "sy6", name: "Super Smoothie", slug: "super-smoothie", category: "Fresh Smoothies", image: "/images/products/wild-berry-smoothie-recipe-250.jpg", variants: [
      { size: "250ml", price: 250 }, { size: "500ml", price: 300 }, { size: "1L", price: 600 }
    ], description: "Mixed forest berries with acai, banana, and protein-packed yogurt." },

  // ==================== GREEN SMOOTHIES ====================
  // Green Smoothies (350ml@200, 500ml@300, 1L@500)
  { id: "sg1", name: "Glowing Skin Smoothie", slug: "glowing-skin-smoothie", category: "Green Smoothies", image: "/images/products/glowing-skin.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 500 }
    ], description: "Spinach, cucumber, celery, green apple, and fresh turmeric for radiant skin." },
  { id: "sg2", name: "Lime Coconut Green Smoothie", slug: "lime-coconut-green-smoothie", category: "Green Smoothies", image: "/images/products/lime-coconut.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 500 }
    ], description: "Kale, coconut water, fresh lime, and cucumber for a refreshing tropical twist." },
  { id: "sg3", name: "Papaya Spinach Smoothie", slug: "papaya-spinach-smoothie", category: "Green Smoothies", image: "/images/products/papaya-spinach.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 500 }
    ], description: "Ripe papaya blended with spinach, banana, and ginger for digestive health." },
  { id: "sg4", name: "Green Fusion Smoothie", slug: "green-fusion-smoothie", category: "Green Smoothies", image: "/images/products/green-fusion.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 500 }
    ], description: "A power blend of kale, avocado, cucumber, green apple, and mint." },
  { id: "sg5", name: "Pineapple Paradise Smoothie", slug: "pineapple-paradise-smoothie", category: "Green Smoothies", image: "/images/products/pineapple-paradise.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 500 }
    ], description: "Sweet pineapple with kale, spinach, and coconut for a tropical escape." },
  { id: "sg6", name: "Yummy Green Smoothie", slug: "yummy-green-smoothie", category: "Green Smoothies", image: "/images/products/yummy-green.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 500 }
    ], description: "Spinach, banana, mango, and almond milk – naturally sweet and nutritious." },
  { id: "sg7", name: "Tropical Breeze Smoothie", slug: "tropical-breeze-smoothie", category: "Green Smoothies", image: "/images/products/tropical-breeze.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 500 }
    ], description: "Mango, pineapple, coconut, and kale for a refreshing island-inspired drink." },
  { id: "sg8", name: "Fruit Free Smoothie", slug: "fruit-free-smoothie", category: "Green Smoothies", image: "/images/products/fruit-free.jpg", variants: [
      { size: "350ml", price: 200 }, { size: "500ml", price: 300 }, { size: "1L", price: 500 }
    ], description: "Cucumber, celery, spinach, lemon, and ginger – pure green goodness." },

  // ==================== SUGARCANE JUICES ====================
  // Sugarcane pricing: 350ml@150, 500ml@200, 1L@350
  { id: "sc1", name: "Beetcane Juice", slug: "beetcane-juice", category: "Juices", image: "/images/products/beetcane.jpg", variants: [
      { size: "350ml", price: 150 }, { size: "500ml", price: 200 }, { size: "1L", price: 350 }
    ] },
  { id: "sc2", name: "Melon Mania Juice", slug: "melon-mania-juice", category: "Juices", image: "/images/products/melon-mania.jpg", variants: [
      { size: "350ml", price: 150 }, { size: "500ml", price: 200 }, { size: "1L", price: 350 }
    ] },
  { id: "sc3", name: "Pinecane Juice", slug: "pinecane-juice", category: "Juices", image: "/images/products/pinecane.jpg", variants: [
      { size: "350ml", price: 150 }, { size: "500ml", price: 200 }, { size: "1L", price: 350 }
    ] },
  { id: "sc4", name: "Strawcane Juice", slug: "strawcane-juice", category: "Juices", image: "/images/products/strawcane.jpg", variants: [
      { size: "350ml", price: 150 }, { size: "500ml", price: 200 }, { size: "1L", price: 350 }
    ] },
  { id: "sc5", name: "Cucumber Lime Twist Juice", slug: "cucumber-lime-twist-juice", category: "Juices", image: "/images/products/cucumber-lime-twist.jpg", variants: [
      { size: "350ml", price: 150 }, { size: "500ml", price: 200 }, { size: "1L", price: 350 }
    ] },
  { id: "sc6", name: "Cucumber Melon Punch Juice", slug: "cucumber-melon-punch-juice", category: "Juices", image: "/images/products/cucumber-melon-punch.jpg", variants: [
      { size: "350ml", price: 150 }, { size: "500ml", price: 200 }, { size: "1L", price: 350 }
    ] },
  { id: "sc7", name: "Sugarcane Ginger & Lime Juice", slug: "sugarcane-ginger-lime-juice", category: "Juices", image: "/images/products/sugarcane-ginger-lime.jpg", variants: [
      { size: "350ml", price: 150 }, { size: "500ml", price: 200 }, { size: "1L", price: 350 }
    ] },

  // ==================== OTHER (with variants for nuts and crisps) ====================
  // Nuts: 400g@X, 800g@Y
  { id: "o1", name: "Honey", slug: "honey", category: "Other", price: 799, unit: "per jar", image: "/images/products/honey.jpg" },
  { id: "o2", name: "Roasted Brown Peanut", slug: "roasted-brown-peanut", category: "Other", image: "/images/products/roasted-brown-peanut.jpg", variants: [
      { size: "per 400g", price: 180 }, { size: "800g", price: 320 }
    ] },
  { id: "o3", name: "Roasted Cashew Nuts", slug: "roasted-cashewnuts", category: "Other", image: "/images/products/roasted-cashewnuts.jpg", variants: [
      { size: "per 400g", price: 650 }, { size: "800g", price: 1200 }
    ] },
  { id: "o4", name: "Roasted White Peanut", slug: "roasted-white-peanut", category: "Other", image: "/images/products/roasted-white-peanut.jpg", variants: [
      { size: "per 400g", price: 180 }, { size: "800g", price: 320 }
    ] },
  { id: "o5", name: "Arrowroot Crisps", slug: "arrowroot-crisps", category: "Other", image: "/images/products/arrowroot-crisps.jpg", variants: [
      { size: "per 400g", price: 180 }, { size: "800g", price: 320 }
    ] },
  { id: "o6", name: "Cassava Crisps", slug: "cassava-crisps", category: "Other", image: "/images/products/cassava-crisps.jpg", variants: [
      { size: "per 400g", price: 180 }, { size: "800g", price: 320 }
    ] },
  { id: "o7", name: "Eggs", slug: "eggs", category: "Other", price: 350, unit: "per tray", image: "/images/products/eggs.jpg" },
];