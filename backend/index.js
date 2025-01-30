import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { socketHandler } from './socketHandler.js';
import { EventEmitter } from 'events';
import connectDB from './Config/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import relatedProductsRoutes from './routes/relatedProductsRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';
import paymentInfoRoutes from './routes/paymentInfoRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import reviewRoutes from './routes/ReviewRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import checkoutRoutes from './routes/CheckoutRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import deliveryScheRoutes from './routes/deliveryScheRoutes.js';
import notificationRoutes from './routes/NotificationRoutes.js';

// Middleware
import authMiddleware, { requireAdmin } from './Middleware/AuthMiddleware.js';

// Load environment variables
dotenv.config();

// Increase EventEmitter max listeners
EventEmitter.defaultMaxListeners = 15;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Attach Socket.IO handler
socketHandler(io);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// Serve uploads
app.use('/uploads', express.static('uploads'));

// Connect to the database
connectDB()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

// Serve React frontend
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = process.env.FRONTEND_PATH || path.join(__dirname, '../Frontend/dist');
app.use(express.static(frontendPath));

// Fallback for React SPA (for GET requests only)
app.get('*', (req, res) => {
  if (req.method === 'GET') {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/', relatedProductsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentInfoRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/delivery', deliveryScheRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);

// Protected Routes
app.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.user.userId}!` });
});

app.get('/admin/dashboard', authMiddleware, requireAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

// PayPal Configuration
app.get('/api/config/paypal', (req, res) =>
  res.send({
    clientId: process.env.PAYPAL_CLIENT_ID,
  })
);

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
