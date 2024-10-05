import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    duname: String,
    dpwd: String,
    
    available: { type: Boolean, default: true }
});

export default mongoose.model('Driver', driverSchema);
