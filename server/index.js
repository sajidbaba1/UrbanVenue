const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// 🧪 Health Check Route
app.get('/', (req, res) => {
    res.json({ status: 'active', message: 'UrbanVenue API is healthy!' });
});

// Load Routes with Error Catching
try {
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/venues', require('./routes/venueRoutes'));
    app.use('/api/admin', require('./routes/adminRoutes'));
} catch (error) {
    console.error('❌ ROUTE LOADING ERROR:', error.message);
}

// 🚀 Start Listening IMMEDIATELY
app.listen(PORT, '0.0.0.0', () => {
    console.log('====================================');
    console.log(`🚀 SERVER RUNNING AT: http://localhost:${PORT}`);
    console.log(`📂 DB URI: ${MONGODB_URI ? 'Detected' : 'MISSING!'}`);
    console.log('====================================');
});

// 🍃 Connect to Database
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ DATABASE: Connection Successful'))
        .catch(err => console.error('❌ DATABASE ERROR:', err.message));
} else {
    console.error('❌ FATAL: MONGODB_URI not found in .env file!');
}
