const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'owner', 'admin'],
        default: 'customer'
    },
    profileImage: String,
    aadharCard: String, // Identification for KYC
    kycStatus: {
        type: String,
        enum: ['not_submitted', 'pending', 'verified', 'rejected'],
        default: 'not_submitted'
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue'
    }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
