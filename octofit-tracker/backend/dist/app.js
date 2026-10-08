import express from 'express';
import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';
export function createApp() {
    const app = express();
    const codespaceName = process.env.CODESPACE_NAME;
    app.use(express.json());
    app.use((request, response, next) => {
        const allowedOrigins = [
            'http://localhost:5173',
            codespaceName ? `https://${codespaceName}-5173.app.github.dev` : undefined,
        ];
        const origin = request.get('origin');
        if (origin && allowedOrigins.includes(origin)) {
            response.setHeader('Access-Control-Allow-Origin', origin);
            response.setHeader('Vary', 'Origin');
        }
        response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (request.method === 'OPTIONS') {
            response.sendStatus(204);
            return;
        }
        next();
    });
    app.get('/api/health', (_request, response) => {
        response.json({ status: 'ok', service: 'octofit-tracker' });
    });
    app.get('/api/users/', async (_request, response) => {
        const users = await User.find()
            .select('-email')
            .populate('team', 'name')
            .sort({ username: 1 })
            .lean();
        response.json(users);
    });
    app.get('/api/teams/', async (_request, response) => {
        const teams = await Team.find()
            .populate('members', 'username displayName')
            .sort({ name: 1 })
            .lean();
        response.json(teams);
    });
    app.get('/api/activities/', async (_request, response) => {
        const activities = await Activity.find()
            .populate('user', 'username displayName')
            .sort({ completedAt: -1 })
            .lean();
        response.json(activities);
    });
    app.get('/api/leaderboard/', async (_request, response) => {
        const leaderboard = await Leaderboard.find()
            .populate('user', 'username displayName')
            .populate('team', 'name')
            .sort({ period: 1, rank: 1 })
            .lean();
        response.json(leaderboard);
    });
    app.get('/api/workouts/', async (_request, response) => {
        const workouts = await Workout.find().sort({ title: 1 }).lean();
        response.json(workouts);
    });
    app.use((error, _request, response, _next) => {
        console.error('API request failed:', error);
        response.status(500).json({ error: 'An unexpected server error occurred.' });
    });
    return app;
}
