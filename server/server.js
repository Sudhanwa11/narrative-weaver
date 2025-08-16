import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import diaryEntryRoutes from './routes/diaryEntryRoutes.js';
import aiRoutes from './routes/aiRoutes.js'; // Import AI routes
import exportRoutes from './routes/exportRoutes.js'

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/diary', diaryEntryRoutes);
app.use('/api/ai', aiRoutes); // Use AI routes
app.use('/api/export', exportRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));