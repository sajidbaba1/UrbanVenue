const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/venues', require('./routes/venueRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'UrbanVenue API is running...' });
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urbanvenue';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ DATABASE: MongoDB Connected Successfully');
        app.listen(PORT, () => {
            console.log(`🚀 SERVER: Running on http://localhost:${PORT}`);
            console.log(`📡 API: Auth and Venue routes are active`);
        });
    })
    .catch(err => {
        console.error('❌ ERROR: Database connection failed!');
        console.error('Check your .env MONGODB_URI and IP Whitelist.');
        console.error(err.message);
    });
