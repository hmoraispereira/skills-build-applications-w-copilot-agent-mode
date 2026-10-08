import { Schema, model } from 'mongoose';
const leaderboardSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    period: { type: String, enum: ['weekly', 'monthly'], required: true },
    periodStart: { type: Date, required: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
    seedKey: { type: String, unique: true, sparse: true },
}, { timestamps: true });
leaderboardSchema.index({ user: 1, period: 1, periodStart: 1 }, { unique: true });
export default model('Leaderboard', leaderboardSchema);
