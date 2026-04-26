const express = require('express');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get Owner Dashboard Stats
router.get('/stats/owner', auth, authorize('owner'), async (req, res) => {
    try {
        const myVenues = await Venue.find({ owner: req.user.id });
        const venueIds = myVenues.map(v => v._id);

        const totalVenues = myVenues.length;
        
        // Count Pending Bookings
        const newBookings = await Booking.countDocuments({ 
            venue: { $in: venueIds }, 
            status: 'pending_approval' 
        });

        // Calculate Avg Rating
        const avgRating = myVenues.length > 0 
            ? (myVenues.reduce((acc, curr) => acc + (curr.rating || 0), 0) / myVenues.length).toFixed(1)
            : 0;

        // Calculate Revenue from PAID bookings
        const financials = await Booking.aggregate([
            { $match: { venue: { $in: venueIds }, paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$ownerAmount' } } }
        ]);

        const estRevenue = financials.length > 0 ? financials[0].total : 0;

        res.json({
            totalVenues,
            newBookings,
            avgRating,
            estRevenue
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all venues
router.get('/', async (req, res) => {
    try {
        const venues = await Venue.find().populate('owner', 'name');
        res.json(venues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single venue
router.get('/:id', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id).populate('owner', 'name');
        if (!venue) return res.status(404).json({ message: 'Venue not found' });
        res.json(venue);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const upload = require('../middleware/upload');

// Create Venue (Owner Only)
router.post('/', auth, authorize('owner', 'admin'), upload.array('images', 5), async (req, res) => {
    try {
        console.log('📥 INCOMING VENUE DATA:', req.body);
        
        const { 
            name, description, location, address, capacity, 
            pricePerHour, type, amenities, addons 
        } = req.body;

        // Secure JSON Parsing
        let parsedAmenities = [];
        let parsedAddons = [];
        try {
            parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : (amenities || []);
            parsedAddons = typeof addons === 'string' ? JSON.parse(addons) : (addons || []);
        } catch (e) {
            console.error('❌ JSON PARSE ERROR:', e.message);
            return res.status(400).json({ message: 'Invalid format for amenities or addons' });
        }

        const imagePaths = req.files ? req.files.map(file => file.path) : [];

        const venue = new Venue({
            owner: req.user.id,
            name,
            description,
            location,
            address,
            capacity: Number(capacity) || 0,
            pricePerHour: Number(pricePerHour) || 0,
            type,
            amenities: parsedAmenities,
            addons: parsedAddons,
            images: imagePaths,
            isVerified: req.user.role === 'admin'
        });

        const savedVenue = await venue.save();
        console.log('✅ VENUE SAVED:', savedVenue._id);
        res.status(201).json(savedVenue);
    } catch (err) {
        console.error('❌ VENUE CREATION FAILED:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// Update Venue
router.put('/:id', auth, async (req, res) => {
    try {
        let venue = await Venue.findById(req.params.id);
        if (!venue) return res.status(404).json({ message: 'Venue not found' });

        // Check if owner
        if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(venue);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
