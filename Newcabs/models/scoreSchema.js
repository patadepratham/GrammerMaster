import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    uname: { type: String, required: true, unique: true },
    score: { type: Number, default: 0 }
});

const Score = mongoose.model('Score', scoreSchema);
export default Score;