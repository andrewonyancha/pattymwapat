// app/shop/products.ts

// Category type for better type narrowing
export type ProductCategory = 
  | 'Engine Parts' 
  | 'Brake Systems' 
  | 'Suspension & Steering' 
  | 'Electrical' 
  | 'Filters' 
  | 'Body Parts' 
  | 'Tires & Wheels' 
  | 'Accessories' 
  | 'Oils & Fluids' 
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
  // ==================== ENGINE PARTS ====================
  { id: "ep1", name: "Oil Filter", slug: "oil-filter", category: "Filters", price: 450, unit: "per piece", image: "/images/products/oil-filter.jpg" },
  { id: "ep2", name: "Air Filter", slug: "air-filter", category: "Filters", price: 850, unit: "per piece", image: "/images/products/air-filter.jpg" },
  { id: "ep3", name: "Fuel Filter", slug: "fuel-filter", category: "Filters", price: 650, unit: "per piece", image: "/images/products/fuel-filter.jpg" },
  { id: "ep4", name: "Spark Plug", slug: "spark-plug", category: "Engine Parts", price: 350, unit: "per piece", image: "/images/products/spark-plug.jpg" },
  { id: "ep5", name: "Timing Belt", slug: "timing-belt", category: "Engine Parts", price: 2500, unit: "per piece", image: "/images/products/timing-belt.jpg" },
  { id: "ep6", name: "Alternator", slug: "alternator", category: "Electrical", price: 8500, unit: "per piece", image: "/images/products/alternator.jpg" },
  { id: "ep7", name: "Starter Motor", slug: "starter-motor", category: "Engine Parts", price: 6500, unit: "per piece", image: "/images/products/starter-motor.jpg" },
  { id: "ep8", name: "Water Pump", slug: "water-pump", category: "Engine Parts", price: 3500, unit: "per piece", image: "/images/products/water-pump.jpg" },
  { id: "ep9", name: "Thermostat", slug: "thermostat", category: "Engine Parts", price: 1200, unit: "per piece", image: "/images/products/thermostat.jpg" },
  { id: "ep10", name: "Radiator", slug: "radiator", category: "Engine Parts", price: 12000, unit: "per piece", image: "/images/products/radiator.jpg" },

  // ==================== BRAKE SYSTEMS ====================
  { id: "bs1", name: "Brake Pads (Front)", slug: "brake-pads-front", category: "Brake Systems", price: 2500, unit: "per set", image: "/images/products/brake-pads-front.jpg" },
  { id: "bs2", name: "Brake Pads (Rear)", slug: "brake-pads-rear", category: "Brake Systems", price: 1800, unit: "per set", image: "/images/products/brake-pads-rear.jpg" },
  { id: "bs3", name: "Brake Disc (Front)", slug: "brake-disc-front", category: "Brake Systems", price: 3500, unit: "per piece", image: "/images/products/brake-disc-front.jpg" },
  { id: "bs4", name: "Brake Disc (Rear)", slug: "brake-disc-rear", category: "Brake Systems", price: 2800, unit: "per piece", image: "/images/products/brake-disc-rear.jpg" },
  { id: "bs5", name: "Brake Fluid DOT4", slug: "brake-fluid-dot4", category: "Oils & Fluids", price: 850, unit: "per liter", image: "/images/products/brake-fluid.jpg" },
  { id: "bs6", name: "Brake Caliper", slug: "brake-caliper", category: "Brake Systems", price: 4500, unit: "per piece", image: "/images/products/brake-caliper.jpg" },
  { id: "bs7", name: "Brake Hose", slug: "brake-hose", category: "Brake Systems", price: 650, unit: "per piece", image: "/images/products/brake-hose.jpg" },
  { id: "bs8", name: "Brake Master Cylinder", slug: "brake-master-cylinder", category: "Brake Systems", price: 5500, unit: "per piece", image: "/images/products/brake-master-cylinder.jpg" },

  // ==================== SUSPENSION & STEERING ====================
  { id: "ss1", name: "Shock Absorber (Front)", slug: "shock-absorber-front", category: "Suspension & Steering", price: 3500, unit: "per piece", image: "/images/products/shock-absorber-front.jpg" },
  { id: "ss2", name: "Shock Absorber (Rear)", slug: "shock-absorber-rear", category: "Suspension & Steering", price: 2800, unit: "per piece", image: "/images/products/shock-absorber-rear.jpg" },
  { id: "ss3", name: "Strut Assembly", slug: "strut-assembly", category: "Suspension & Steering", price: 8500, unit: "per piece", image: "/images/products/strut-assembly.jpg" },
  { id: "ss4", name: "Control Arm", slug: "control-arm", category: "Suspension & Steering", price: 4500, unit: "per piece", image: "/images/products/control-arm.jpg" },
  { id: "ss5", name: "Ball Joint", slug: "ball-joint", category: "Suspension & Steering", price: 1800, unit: "per piece", image: "/images/products/ball-joint.jpg" },
  { id: "ss6", name: "Tie Rod End", slug: "tie-rod-end", category: "Suspension & Steering", price: 1500, unit: "per piece", image: "/images/products/tie-rod-end.jpg" },
  { id: "ss7", name: "Wheel Bearing", slug: "wheel-bearing", category: "Suspension & Steering", price: 2200, unit: "per piece", image: "/images/products/wheel-bearing.jpg" },
  { id: "ss8", name: "Steering Rack", slug: "steering-rack", category: "Suspension & Steering", price: 15000, unit: "per piece", image: "/images/products/steering-rack.jpg" },

  // ==================== ELECTRICAL ====================
  { id: "el1", name: "Car Battery 12V", slug: "car-battery-12v", category: "Electrical", price: 8500, unit: "per piece", image: "/images/products/car-battery.jpg" },
  { id: "el2", name: "Headlight Bulb (H7)", slug: "headlight-bulb-h7", category: "Electrical", price: 450, unit: "per piece", image: "/images/products/headlight-bulb.jpg" },
  { id: "el3", name: "Tail Light Assembly", slug: "tail-light-assembly", category: "Electrical", price: 3500, unit: "per piece", image: "/images/products/tail-light.jpg" },
  { id: "el4", name: "Wiper Blade (22 inch)", slug: "wiper-blade-22", category: "Accessories", price: 650, unit: "per piece", image: "/images/products/wiper-blade.jpg" },
  { id: "el5", name: "Wiper Motor", slug: "wiper-motor", category: "Electrical", price: 4500, unit: "per piece", image: "/images/products/wiper-motor.jpg" },
  { id: "el6", name: "Ignition Coil", slug: "ignition-coil", category: "Electrical", price: 2500, unit: "per piece", image: "/images/products/ignition-coil.jpg" },
  { id: "el7", name: "Fuse Box", slug: "fuse-box", category: "Electrical", price: 1800, unit: "per piece", image: "/images/products/fuse-box.jpg" },
  { id: "el8", name: "Relay Switch", slug: "relay-switch", category: "Electrical", price: 350, unit: "per piece", image: "/images/products/relay-switch.jpg" },
  { id: "el9", name: "Horn", slug: "horn", category: "Electrical", price: 850, unit: "per piece", image: "/images/products/horn.jpg" },
  { id: "el10", name: "Voltage Regulator", slug: "voltage-regulator", category: "Electrical", price: 1200, unit: "per piece", image: "/images/products/voltage-regulator.jpg" },

  // ==================== FILTERS ====================
  { id: "fl1", name: "Cabin Air Filter", slug: "cabin-air-filter", category: "Filters", price: 1200, unit: "per piece", image: "/images/products/cabin-air-filter.jpg" },
  { id: "fl2", name: "Transmission Filter", slug: "transmission-filter", category: "Filters", price: 1800, unit: "per piece", image: "/images/products/transmission-filter.jpg" },
  { id: "fl3", name: "Fuel Filter (Inline)", slug: "fuel-filter-inline", category: "Filters", price: 950, unit: "per piece", image: "/images/products/fuel-filter-inline.jpg" },
  { id: "fl4", name: "PCV Valve", slug: "pcv-valve", category: "Filters", price: 450, unit: "per piece", image: "/images/products/pcv-valve.jpg" },

  // ==================== BODY PARTS ====================
  { id: "bp1", name: "Front Bumper", slug: "front-bumper", category: "Body Parts", price: 8500, unit: "per piece", image: "/images/products/front-bumper.jpg" },
  { id: "bp2", name: "Rear Bumper", slug: "rear-bumper", category: "Body Parts", price: 7500, unit: "per piece", image: "/images/products/rear-bumper.jpg" },
  { id: "bp3", name: "Hood", slug: "hood", category: "Body Parts", price: 15000, unit: "per piece", image: "/images/products/hood.jpg" },
  { id: "bp4", name: "Fender (Front Left)", slug: "fender-front-left", category: "Body Parts", price: 5500, unit: "per piece", image: "/images/products/fender-front.jpg" },
  { id: "bp5", name: "Fender (Front Right)", slug: "fender-front-right", category: "Body Parts", price: 5500, unit: "per piece", image: "/images/products/fender-front.jpg" },
  { id: "bp6", name: "Door Panel (Front)", slug: "door-panel-front", category: "Body Parts", price: 6500, unit: "per piece", image: "/images/products/door-panel.jpg" },
  { id: "bp7", name: "Side Mirror (Left)", slug: "side-mirror-left", category: "Body Parts", price: 2500, unit: "per piece", image: "/images/products/side-mirror.jpg" },
  { id: "bp8", name: "Side Mirror (Right)", slug: "side-mirror-right", category: "Body Parts", price: 2500, unit: "per piece", image: "/images/products/side-mirror.jpg" },
  { id: "bp9", name: "Windshield", slug: "windshield", category: "Body Parts", price: 12000, unit: "per piece", image: "/images/products/windshield.jpg" },
  { id: "bp10", name: "Rear Window", slug: "rear-window", category: "Body Parts", price: 8500, unit: "per piece", image: "/images/products/rear-window.jpg" },

  // ==================== TIRES & WHEELS ====================
  { id: "tw1", name: "Tire 185/65R15", slug: "tire-185-65r15", category: "Tires & Wheels", price: 6500, unit: "per piece", image: "/images/products/tire-185.jpg" },
  { id: "tw2", name: "Tire 195/65R15", slug: "tire-195-65r15", category: "Tires & Wheels", price: 7500, unit: "per piece", image: "/images/products/tire-195.jpg" },
  { id: "tw3", name: "Tire 205/55R16", slug: "tire-205-55r16", category: "Tires & Wheels", price: 9500, unit: "per piece", image: "/images/products/tire-205.jpg" },
  { id: "tw4", name: "Alloy Wheel 15 inch", slug: "alloy-wheel-15", category: "Tires & Wheels", price: 8500, unit: "per piece", image: "/images/products/alloy-wheel-15.jpg" },
  { id: "tw5", name: "Alloy Wheel 16 inch", slug: "alloy-wheel-16", category: "Tires & Wheels", price: 12000, unit: "per piece", image: "/images/products/alloy-wheel-16.jpg" },
  { id: "tw6", name: "Steel Wheel 15 inch", slug: "steel-wheel-15", category: "Tires & Wheels", price: 3500, unit: "per piece", image: "/images/products/steel-wheel-15.jpg" },
  { id: "tw7", name: "Wheel Hub", slug: "wheel-hub", category: "Tires & Wheels", price: 2500, unit: "per piece", image: "/images/products/wheel-hub.jpg" },
  { id: "tw8", name: "Lug Nut Set", slug: "lug-nut-set", category: "Tires & Wheels", price: 850, unit: "per set", image: "/images/products/lug-nut.jpg" },
  { id: "tw9", name: "Tire Pressure Gauge", slug: "tire-pressure-gauge", category: "Accessories", price: 650, unit: "per piece", image: "/images/products/tire-gauge.jpg" },

  // ==================== ACCESSORIES ====================
  { id: "ac1", name: "Car Cover (Medium)", slug: "car-cover-medium", category: "Accessories", price: 3500, unit: "per piece", image: "/images/products/car-cover.jpg" },
  { id: "ac2", name: "Car Cover (Large)", slug: "car-cover-large", category: "Accessories", price: 4500, unit: "per piece", image: "/images/products/car-cover.jpg" },
  { id: "ac3", name: "Seat Cover Set", slug: "seat-cover-set", category: "Accessories", price: 2500, unit: "per set", image: "/images/products/seat-cover.jpg" },
  { id: "ac4", name: "Floor Mat Set", slug: "floor-mat-set", category: "Accessories", price: 1800, unit: "per set", image: "/images/products/floor-mat.jpg" },
  { id: "ac5", name: "Steering Wheel Cover", slug: "steering-wheel-cover", category: "Accessories", price: 650, unit: "per piece", image: "/images/products/steering-cover.jpg" },
  { id: "ac6", name: "Phone Mount", slug: "phone-mount", category: "Accessories", price: 850, unit: "per piece", image: "/images/products/phone-mount.jpg" },
  { id: "ac7", name: "Dash Cam", slug: "dash-cam", category: "Accessories", price: 5500, unit: "per piece", image: "/images/products/dash-cam.jpg" },
  { id: "ac8", name: "Car Vacuum Cleaner", slug: "car-vacuum", category: "Accessories", price: 3500, unit: "per piece", image: "/images/products/car-vacuum.jpg" },
  { id: "ac9", name: "Jump Starter", slug: "jump-starter", category: "Accessories", price: 8500, unit: "per piece", image: "/images/products/jump-starter.jpg" },
  { id: "ac10", name: "Tow Hook", slug: "tow-hook", category: "Accessories", price: 1200, unit: "per piece", image: "/images/products/tow-hook.jpg" },

  // ==================== OILS & FLUIDS ====================
  { id: "of1", name: "Engine Oil 5W-30 (5L)", slug: "engine-oil-5w30-5l", category: "Oils & Fluids", price: 3500, unit: "per 5L", image: "/images/products/engine-oil-5w30.jpg" },
  { id: "of2", name: "Engine Oil 10W-40 (5L)", slug: "engine-oil-10w40-5l", category: "Oils & Fluids", price: 3200, unit: "per 5L", image: "/images/products/engine-oil-10w40.jpg" },
  { id: "of3", name: "Gear Oil 80W-90 (1L)", slug: "gear-oil-80w90-1l", category: "Oils & Fluids", price: 650, unit: "per liter", image: "/images/products/gear-oil.jpg" },
  { id: "of4", name: "Transmission Fluid (1L)", slug: "transmission-fluid-1l", category: "Oils & Fluids", price: 850, unit: "per liter", image: "/images/products/transmission-fluid.jpg" },
  { id: "of5", name: "Coolant (5L)", slug: "coolant-5l", category: "Oils & Fluids", price: 1800, unit: "per 5L", image: "/images/products/coolant.jpg" },
  { id: "of6", name: "Power Steering Fluid (1L)", slug: "power-steering-fluid-1l", category: "Oils & Fluids", price: 550, unit: "per liter", image: "/images/products/power-steering-fluid.jpg" },
  { id: "of7", name: "Windshield Washer Fluid (1L)", slug: "windshield-washer-fluid-1l", category: "Oils & Fluids", price: 250, unit: "per liter", image: "/images/products/washer-fluid.jpg" },
  { id: "of8", name: "Brake Fluid DOT4 (500ml)", slug: "brake-fluid-dot4-500ml", category: "Oils & Fluids", price: 450, unit: "per 500ml", image: "/images/products/brake-fluid.jpg" },

  // ==================== OTHER ====================
  { id: "o1", name: "Jumper Cables", slug: "jumper-cables", category: "Other", price: 1500, unit: "per set", image: "/images/products/jumper-cables.jpg" },
  { id: "o2", name: "Tool Kit (Basic)", slug: "tool-kit-basic", category: "Other", price: 3500, unit: "per set", image: "/images/products/tool-kit.jpg" },
  { id: "o3", name: "Jack (2 Ton)", slug: "jack-2-ton", category: "Other", price: 4500, unit: "per piece", image: "/images/products/jack.jpg" },
  { id: "o4", name: "Jack Stand (Pair)", slug: "jack-stand-pair", category: "Other", price: 2500, unit: "per pair", image: "/images/products/jack-stand.jpg" },
  { id: "o5", name: "Wrench Set (Metric)", slug: "wrench-set-metric", category: "Other", price: 2800, unit: "per set", image: "/images/products/wrench-set.jpg" },
  { id: "o6", name: "Socket Set", slug: "socket-set", category: "Other", price: 3500, unit: "per set", image: "/images/products/socket-set.jpg" },
  { id: "o7", name: "Screwdriver Set", slug: "screwdriver-set", category: "Other", price: 1200, unit: "per set", image: "/images/products/screwdriver-set.jpg" },
  { id: "o8", name: "Pliers Set", slug: "pliers-set", category: "Other", price: 1500, unit: "per set", image: "/images/products/pliers-set.jpg" },
];
