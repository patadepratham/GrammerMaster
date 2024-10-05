import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    uname: { type: String, required: true },
    pwd: { type: String, required: true },
    score: { type: Number, default: 0 }
});

export default mongoose.model('User', userSchema);
