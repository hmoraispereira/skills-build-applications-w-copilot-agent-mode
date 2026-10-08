import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    age: { type: Number, min: 1, max: 120 },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, min: 0, default: 0 },
}, { timestamps: true });
export default model('User', userSchema);
