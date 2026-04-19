import express from 'express';
import walletRoutes from './routes/walletRoutes.js';
import cors from "cors"

const app = express();

// Middlewares
app.use(cors())
app.use(express.json());

// Routes
app.use('/api', walletRoutes);

export default app;