const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

// Database connection
connectDB();

const app = express();

// Enhanced CORS configuration (exactly as in your original)
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Security middleware (unchanged from your original)
app.use(helmet());
app.use(mongoSanitize());
app.use(cors(corsOptions));

// Rate limiting (300 requests per 15 minutes) - unchanged
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    status: 429,
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/api/health' || 
           req.method === 'OPTIONS' ||
           req.path.startsWith('/api/products');
  }
});

app.use('/api/', limiter);

// Body parser middleware (unchanged)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API routes (only changed the order)
app.use('/api/products', productRoutes); // Now registered first
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint (unchanged)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    database: 'connected',
    security: {
      helmet: true,
      rateLimit: true,
      mongoSanitize: true,
      cors: true
    }
  });
});

// Error handling middleware (unchanged)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\nServer running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`\nSecurity Features:`);
  console.log('- Helmet: enabled');
  console.log('- Rate limiting: enabled (300 req/15min)');
  console.log('- MongoDB sanitize: enabled');
  console.log('- Enhanced CORS: enabled');
  console.log(`  Allowed origins: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});