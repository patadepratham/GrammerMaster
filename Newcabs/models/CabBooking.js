import mongoose from 'mongoose';

const cabBookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    start: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, default: 'upcoming' },     
});

const CabBooking = mongoose.model('CabBooking', cabBookingSchema);

export default CabBooking;
