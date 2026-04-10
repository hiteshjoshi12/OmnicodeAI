const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const historyRoutes = require('./routes/historyRoutes');
const supportRoutes = require('./routes/support');
const paymentRoutes = require('./routes/paymentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

connectDB();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173', // Keep local development working
    'https://omnicode-ai.vercel.app' // Allow your production frontend
  ],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Omnicode AI API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // <-- Mount it here
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes); // <-- ADD THIS LINE
app.use('/api/support', supportRoutes);
app.use('/api/payment', paymentRoutes);

app.use('/api/history', historyRoutes);


app.use('/api/contact', contactRoutes);

app.use('/api/newsletter', newsletterRoutes);
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});