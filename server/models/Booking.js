const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in hours
        required: true
    },
    selectedAddons: [{
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    platformFee: {
        type: Number, // Commission for admin
        required: true
    },
    ownerAmount: {
        type: Number, // Amount to be paid to owner
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
    status: {
        type: String,
        enum: ['pending_approval', 'approved_for_payment', 'confirmed', 'cancelled', 'rejected'],
        default: 'pending_approval'
    },
    transactionId: String,
    isPaidOut: {
        type: Boolean, // Whether owner has been paid
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
