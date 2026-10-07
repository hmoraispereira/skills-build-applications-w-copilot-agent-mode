import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import Activity from '../src/models/Activity.js';
import Leaderboard from '../src/models/Leaderboard.js';
import Team from '../src/models/Team.js';
import User from '../src/models/User.js';
import Workout from '../src/models/Workout.js';

const connectionString = `mongodb://127.0.0.1:27017/octofit_test_${process.pid}`;
const models = [Activity, Leaderboard, Team, User, Workout];
let server: Server;
let apiBase: string;

before(async () => {
  await mongoose.connect(connectionString);
  await mongoose.connection.dropDatabase();
  await Promise.all(models.map((model) => model.init()));

  const user = await User.create({
    username: 'test-athlete',
    displayName: 'Test Athlete',
    email: 'test-athlete@example.test',
    points: 100,
  });
  const team = await Team.create({
    name: 'Test Team',
    description: 'A team for API tests.',
    members: [user._id],
  });
  user.team = team._id;
  await user.save();

  await Promise.all([
    Activity.create({
      user: user._id,
      type: 'run',
      durationMinutes: 20,
      distanceKm: 3,
      points: 50,
    }),
    Leaderboard.create({
      user: user._id,
      team: team._id,
      period: 'weekly',
      periodStart: new Date('2026-10-05T00:00:00.000Z'),
      points: 100,
      rank: 1,
    }),
    Workout.create({
      title: 'Test Run',
      description: 'A sample workout for API tests.',
      level: 'beginner',
      activityType: 'run',
      durationMinutes: 20,
      exercises: ['Easy run'],
    }),
  ]);

  server = createApp().listen(0);
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const address = server.address() as AddressInfo;
  apiBase = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server?.listening) {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

test('health route reports service status', async () => {
  const response = await fetch(`${apiBase}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', service: 'octofit-tracker' });
});

test('resource routes return records and populated relations', async (t) => {
  await t.test('users include team but omit private email', async () => {
    const response = await fetch(`${apiBase}/api/users/`);
    assert.equal(response.status, 200);
    const users = await response.json() as Array<{
      username: string;
      email?: string;
      team: { _id: string; name: string };
    }>;
    assert.equal(users.length, 1);
    assert.equal(users[0].username, 'test-athlete');
    assert.deepEqual(users[0].team, { _id: users[0].team._id, name: 'Test Team' });
    assert.equal('email' in users[0], false);
  });

  await t.test('teams include their athlete members', async () => {
    const response = await fetch(`${apiBase}/api/teams/`);
    assert.equal(response.status, 200);
    const teams = await response.json() as Array<{ members: Array<{ username: string }> }>;
    assert.equal(teams[0].name, 'Test Team');
    assert.equal(teams[0].members[0].username, 'test-athlete');
  });

  await t.test('activities include athlete details', async () => {
    const response = await fetch(`${apiBase}/api/activities/`);
    assert.equal(response.status, 200);
    const activities = await response.json() as Array<{ user: { displayName: string }; type: string }>;
    assert.equal(activities[0].type, 'run');
    assert.equal(activities[0].user.displayName, 'Test Athlete');
  });

  await t.test('leaderboard entries include athlete and team', async () => {
    const response = await fetch(`${apiBase}/api/leaderboard/`);
    assert.equal(response.status, 200);
    const rows = await response.json() as Array<{
      user: { displayName: string };
      team: { name: string };
      rank: number;
    }>;
    assert.equal(rows[0].user.displayName, 'Test Athlete');
    assert.equal(rows[0].team.name, 'Test Team');
    assert.equal(rows[0].rank, 1);
  });

  await t.test('workouts return available exercises', async () => {
    const response = await fetch(`${apiBase}/api/workouts/`);
    assert.equal(response.status, 200);
    const workouts = await response.json() as Array<{ title: string; exercises: string[] }>;
    assert.equal(workouts[0].title, 'Test Run');
    assert.deepEqual(workouts[0].exercises, ['Easy run']);
  });
});

test('CORS permits the local presentation tier', async () => {
  const response = await fetch(`${apiBase}/api/health`, {
    headers: { Origin: 'http://localhost:5173' },
  });
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5173');
});
