const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { auth, authorize } = require('../middleware/auth');

// 🔒 RESTRICTED: Get all users
router.get('/users', auth, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔒 RESTRICTED: Delete a user
router.delete('/users/:id', auth, authorize('admin'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔒 RESTRICTED: Update a user's password (Force reset)
router.put('/users/:id/password', auth, authorize('admin'), async (req, res) => {
    try {
        const { newPassword } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const Venue = require('../models/Venue');

// 🔒 RESTRICTED: Get all venues for auditing
router.get('/venues', auth, authorize('admin'), async (req, res) => {
    try {
        const venues = await Venue.find().populate('owner', 'name email');
        res.json(venues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🔒 RESTRICTED: Approve/Verify a venue
router.put('/venues/:id/verify', auth, authorize('admin'), async (req, res) => {
    try {
        const venue = await Venue.findByIdAndUpdate(
            req.params.id, 
            { isVerified: true }, 
            { new: true }
        );
        res.json({ message: 'Venue approved successfully', venue });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
