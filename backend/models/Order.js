const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    }
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: [true, 'Please add a full name']
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a zip code']
    },
    country: {
      type: String,
      required: [true, 'Please add a country']
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number']
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add a payment method'],
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery']
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Calculate order totals
OrderSchema.methods.calculateTotals = function() {
  // Calculate items total
  const itemsPrice = this.orderItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  // Calculate tax (assuming 10% tax rate)
  this.taxPrice = Math.round(itemsPrice * 0.1 * 100) / 100;

  // Calculate shipping (free shipping for orders over $100)
  this.shippingPrice = itemsPrice > 100 ? 0 : 10;

  // Calculate total
  this.totalPrice = Math.round((itemsPrice + this.taxPrice + this.shippingPrice) * 100) / 100;

  return {
    itemsPrice,
    taxPrice: this.taxPrice,
    shippingPrice: this.shippingPrice,
    totalPrice: this.totalPrice
  };
};

// Generate tracking number
OrderSchema.methods.generateTrackingNumber = function() {
  const prefix = 'EC';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  this.trackingNumber = `${prefix}${timestamp}${random}`;
  return this.trackingNumber;
};

// Middleware to calculate totals before saving
OrderSchema.pre('save', function() {
  if (this.orderItems && this.orderItems.length > 0) {
    this.calculateTotals();
  }
});

module.exports = mongoose.model('Order', OrderSchema);
