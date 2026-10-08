import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    await connectDatabase();
    try {
        const userData = [
            {
                username: 'mona-octocat',
                displayName: 'Mona Octocat',
                email: 'mona@example.test',
                age: 16,
                points: 240,
            },
            {
                username: 'paul-octopus',
                displayName: 'Paul Octopus',
                email: 'paul@example.test',
                age: 17,
                points: 190,
            },
            {
                username: 'jessica-cat',
                displayName: 'Jessica Cat',
                email: 'jessica@example.test',
                age: 16,
                points: 210,
            },
            {
                username: 'sam-squid',
                displayName: 'Sam Squid',
                email: 'sam@example.test',
                age: 15,
                points: 155,
            },
        ];
        const existingUsers = await User.find({ username: { $in: userData.map(({ username }) => username) } })
            .select('username')
            .lean();
        const existingUsernames = new Set(existingUsers.map(({ username }) => username));
        const newUsers = userData.filter(({ username }) => !existingUsernames.has(username));
        if (newUsers.length)
            await User.insertMany(newUsers);
        const users = await User.find({ username: { $in: userData.map(({ username }) => username) } }).lean();
        const userByName = new Map(users.map((user) => [user.username, user]));
        const getUser = (username) => {
            const user = userByName.get(username);
            if (!user)
                throw new Error(`Cannot seed data: user "${username}" is missing.`);
            return user;
        };
        const teamData = [
            {
                name: 'Octocats',
                description: 'A team that keeps moving and cheering each other on.',
                usernames: ['mona-octocat', 'jessica-cat'],
            },
            {
                name: 'Squid Squad',
                description: 'Friendly competition, steady progress, and strong teamwork.',
                usernames: ['paul-octopus', 'sam-squid'],
            },
        ];
        const existingTeams = await Team.find({ name: { $in: teamData.map(({ name }) => name) } })
            .select('name')
            .lean();
        const existingTeamNames = new Set(existingTeams.map(({ name }) => name));
        const newTeams = teamData
            .filter(({ name }) => !existingTeamNames.has(name))
            .map(({ name, description, usernames }) => ({
            name,
            description,
            members: usernames.map((username) => getUser(username)._id),
        }));
        if (newTeams.length)
            await Team.insertMany(newTeams);
        const teams = await Team.find({ name: { $in: teamData.map(({ name }) => name) } }).lean();
        const teamByName = new Map(teams.map((team) => [team.name, team]));
        await User.bulkWrite(teamData.flatMap(({ name, usernames }) => {
            const team = teamByName.get(name);
            if (!team)
                return [];
            return usernames.map((username) => ({
                updateOne: {
                    filter: { username },
                    update: { $set: { team: team._id } },
                },
            }));
        }));
        const activityData = [
            {
                seedKey: 'demo-run-mona',
                username: 'mona-octocat',
                type: 'run',
                durationMinutes: 28,
                distanceKm: 4.2,
                points: 80,
                notes: 'Steady afternoon run.',
            },
            {
                seedKey: 'demo-strength-paul',
                username: 'paul-octopus',
                type: 'strength',
                durationMinutes: 35,
                points: 75,
                notes: 'Bodyweight strength circuit.',
            },
            {
                seedKey: 'demo-walk-jessica',
                username: 'jessica-cat',
                type: 'walk',
                durationMinutes: 42,
                distanceKm: 3.1,
                points: 65,
                notes: 'Walked with a teammate.',
            },
            {
                seedKey: 'demo-run-sam',
                username: 'sam-squid',
                type: 'run',
                durationMinutes: 22,
                distanceKm: 3.0,
                points: 60,
                notes: 'Short, energetic run.',
            },
        ];
        const existingActivities = await Activity.find({ seedKey: { $in: activityData.map(({ seedKey }) => seedKey) } })
            .select('seedKey')
            .lean();
        const existingActivityKeys = new Set(existingActivities.map(({ seedKey }) => seedKey));
        const newActivities = activityData
            .filter(({ seedKey }) => !existingActivityKeys.has(seedKey))
            .map(({ username, ...activity }) => ({ ...activity, user: getUser(username)._id }));
        if (newActivities.length)
            await Activity.insertMany(newActivities);
        const leaderboardData = [
            {
                seedKey: 'demo-weekly-mona',
                username: 'mona-octocat',
                teamName: 'Octocats',
                period: 'weekly',
                periodStart: new Date('2026-10-05T00:00:00.000Z'),
                points: 240,
                rank: 1,
            },
            {
                seedKey: 'demo-weekly-jessica',
                username: 'jessica-cat',
                teamName: 'Octocats',
                period: 'weekly',
                periodStart: new Date('2026-10-05T00:00:00.000Z'),
                points: 210,
                rank: 2,
            },
            {
                seedKey: 'demo-weekly-paul',
                username: 'paul-octopus',
                teamName: 'Squid Squad',
                period: 'weekly',
                periodStart: new Date('2026-10-05T00:00:00.000Z'),
                points: 190,
                rank: 3,
            },
            {
                seedKey: 'demo-weekly-sam',
                username: 'sam-squid',
                teamName: 'Squid Squad',
                period: 'weekly',
                periodStart: new Date('2026-10-05T00:00:00.000Z'),
                points: 155,
                rank: 4,
            },
        ];
        const existingLeaderboard = await Leaderboard.find({ seedKey: { $in: leaderboardData.map(({ seedKey }) => seedKey) } })
            .select('seedKey')
            .lean();
        const existingLeaderboardKeys = new Set(existingLeaderboard.map(({ seedKey }) => seedKey));
        const newLeaderboardRows = leaderboardData
            .filter(({ seedKey }) => !existingLeaderboardKeys.has(seedKey))
            .map(({ username, teamName, ...entry }) => {
            const user = getUser(username);
            const team = teamByName.get(teamName);
            if (!team)
                throw new Error(`Cannot seed leaderboard: team "${teamName}" is missing.`);
            return { ...entry, user: user._id, team: team._id };
        });
        if (newLeaderboardRows.length)
            await Leaderboard.insertMany(newLeaderboardRows);
        const workoutData = [
            {
                title: 'Octocat Easy Run',
                description: 'A relaxed session to build a running habit.',
                level: 'beginner',
                activityType: 'run',
                durationMinutes: 25,
                exercises: ['5-minute warmup walk', '15-minute easy run', '5-minute cooldown'],
            },
            {
                title: 'Team Strength Circuit',
                description: 'A balanced bodyweight circuit that can be done with a partner.',
                level: 'intermediate',
                activityType: 'strength',
                durationMinutes: 30,
                exercises: ['Squats', 'Incline push-ups', 'Reverse lunges', 'Plank'],
            },
            {
                title: 'Recovery Walk',
                description: 'An easy-paced walk for an active recovery day.',
                level: 'beginner',
                activityType: 'walk',
                durationMinutes: 20,
                exercises: ['Comfortable-paced walk', 'Gentle mobility'],
            },
        ];
        const existingWorkouts = await Workout.find({ title: { $in: workoutData.map(({ title }) => title) } })
            .select('title')
            .lean();
        const existingWorkoutTitles = new Set(existingWorkouts.map(({ title }) => title));
        const newWorkouts = workoutData.filter(({ title }) => !existingWorkoutTitles.has(title));
        if (newWorkouts.length)
            await Workout.insertMany(newWorkouts);
        console.log('Database seeding complete');
    }
    finally {
        await mongoose.disconnect();
    }
}
seedDatabase().catch((error) => {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
});
