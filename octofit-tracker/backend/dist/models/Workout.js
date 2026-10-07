import { Schema, model } from 'mongoose';
const workoutSchema = new Schema({
    title: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    activityType: {
        type: String,
        enum: ['run', 'walk', 'strength'],
        required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    exercises: [{ type: String, trim: true }],
}, { timestamps: true });
export default model('Workout', workoutSchema);
