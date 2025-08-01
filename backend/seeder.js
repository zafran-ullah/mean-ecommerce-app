const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    role: 'admin',
    isEmailVerified: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    isEmailVerified: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1987654321',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    isEmailVerified: false
  }
];

// Sample products
const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip. Features titanium design, Action Button, and USB-C connectivity.',
    price: 999.99,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Apple',
    images: [
      {
        url: 'https://via.placeholder.com/400x400?text=iPhone+15+Pro',
        alt: 'iPhone 15 Pro'
      }
    ],
    stock: 25,
    isActive: true,
    isFeatured: true,
    specifications: {
      'Screen Size': '6.1 inches',
      'Storage': '128GB',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      'Processor': 'A17 Pro chip',
      'Operating System': 'iOS 17'
    },
    tags: ['smartphone', 'apple', 'ios', 'premium'],
    weight: 187,
    dimensions: {
      length: 146.6,
      width: 70.6,
      height: 8.25
    },
    sku: 'APPLE-IP15P-128-TIT'
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, powerful cameras, and AI features. Large display perfect for productivity and entertainment.',
    price: 1199.99,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Samsung',
    images: [
      {
        url: 'https://via.placeholder.com/400x400?text=Galaxy+S24+Ultra',
        alt: 'Samsung Galaxy S24 Ultra'
      }
    ],
    stock: 18,
    isActive: true,
    isFeatured: true,
    specifications: {
      'Screen Size': '6.8 inches',
      'Storage': '256GB',
      'Camera': '200MP Main + 50MP Telephoto + 12MP Ultra Wide + 10MP Telephoto',
      'Processor': 'Snapdragon 8 Gen 3',
      'Operating System': 'Android 14'
    },
    tags: ['smartphone', 'samsung', 'android', 'spen'],
    weight: 232,
    dimensions: {
      length: 162.3,
      width: 79.0,
      height: 8.6
    },
    sku: 'SAMS-GS24U-256-BLK'
  },
  {
    name: 'MacBook Air M3',
    description: 'Ultra-thin laptop powered by Apple M3 chip. Perfect for students and professionals who need portability without sacrificing performance.',
    price: 1099.99,
    originalPrice: 1199.99,
    category: 'Electronics',
    subcategory: 'Laptops',
    brand: 'Apple',
    images: [
      {
        url: 'https://via.placeholder.com/400x400?text=MacBook+Air+M3',
        alt: 'MacBook Air M3'
      }
    ],
    stock: 12,
    isActive: true,
    isFeatured: false,
    specifications: {
      'Screen Size': '13.6 inches',
      'Processor': 'Apple M3 8-core CPU',
      'Memory': '8GB unified memory',
      'Storage': '256GB SSD',
      'Graphics': '10-core GPU',
      'Operating System': 'macOS Sonoma'
    },
    tags: ['laptop', 'apple', 'macos', 'portable'],
    weight: 1240,
    dimensions: {
      length: 304,
      width: 215,
      height: 11.3
    },
    sku: 'APPLE-MBA-M3-256-SLVR'
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality. 30-hour battery life and premium comfort.',
    price: 349.99,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'Sony',
    images: [
      {
        url: 'https://via.placeholder.com/400x400?text=Sony+WH-1000XM5',
        alt: 'Sony WH-1000XM5 Headphones'
      }
    ],
    stock: 35,
    isActive: true,
    isFeatured: false,
    specifications: {
      'Driver': '30mm',
      'Frequency Response': '4 Hz - 40 kHz',
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.2, USB-C',
      'Noise Canceling': 'Yes',
      'Weight': '250g'
    },
    tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
    weight: 250,
    sku: 'SONY-WH1000XM5-BLK'
  },
  {
    name: 'Nike Air Max 270',
    description: 'Lifestyle sneakers with large Air unit for maximum comfort. Modern design meets classic Nike styling.',
    price: 150.00,
    category: 'Clothing',
    subcategory: 'Shoes',
    brand: 'Nike',
    images: [
      {
        url: 'https://via.placeholder.com/400x400?text=Nike+Air+Max+270',
        alt: 'Nike Air Max 270'
      }
    ],
    stock: 50,
    isActive: true,
    isFeatured: false,
    specifications: {
      'Material': 'Mesh and synthetic leather',
      'Sole': 'Air Max cushioning',
      'Closure': 'Lace-up',
      'Care': 'Spot clean'
    },
    tags: ['shoes', 'nike', 'sneakers', 'lifestyle'],
    sku: 'NIKE-AM270-WHT-10'
  }
];

// Import data into DB
const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    const createdUsers = await User.create(users);
    console.log('Users Imported...'.green.inverse);

    // Add createdBy field to products (using admin user)
    const adminUser = createdUsers.find(user => user.role === 'admin');
    const productsWithCreator = products.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    await Product.create(productsWithCreator);
    console.log('Products Imported...'.green.inverse);

    console.log('Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
