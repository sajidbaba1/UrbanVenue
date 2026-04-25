const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    images: [String],
    amenities: [String], // WiFi, Parking, AC, etc.
    type: {
        type: String,
        enum: ['Marriage Hall', 'Party Garden', 'Conference Room', 'Rooftop', 'Studio'],
        required: true
    },
    addons: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        priceType: {
            type: String,
            enum: ['fixed', 'per_guest', 'hourly'],
            default: 'fixed'
        },
        description: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);
