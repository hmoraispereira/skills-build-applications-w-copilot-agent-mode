import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Activities from './Activities.jsx'
import Leaderboard from './Leaderboard.jsx'
import Teams from './Teams.jsx'
import Users from './Users.jsx'
import Workouts from './Workouts.jsx'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function stubFetch(response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('resource pages', () => {
  it('loads and renders athletes with their team and points', async () => {
    const fetchMock = stubFetch({
      ok: true,
      json: async () => [{
        _id: 'athlete-1',
        displayName: 'Mona Octocat',
        username: 'mona-octocat',
        team: { name: 'Octocats' },
        points: 240,
        age: 16,
      }],
    })

    render(<Users />)

    expect(await screen.findByText('Mona Octocat')).toBeTruthy()
    expect(screen.getByText('Octocats')).toBeTruthy()
    expect(screen.getByText('240')).toBeTruthy()
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/users\/$/)
  })

  it('loads and renders activities with the athlete and points', async () => {
    const fetchMock = stubFetch({
      ok: true,
      json: async () => [{
        _id: 'activity-1',
        user: { displayName: 'Mona Octocat' },
        type: 'run',
        durationMinutes: 28,
        distanceKm: 4.2,
        points: 80,
        completedAt: '2026-10-07T12:00:00.000Z',
      }],
    })

    render(<Activities />)

    expect(await screen.findByText('Mona Octocat')).toBeTruthy()
    expect(screen.getByText('run')).toBeTruthy()
    expect(screen.getByText('80')).toBeTruthy()
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/activities\/$/)
  })

  it('loads and renders teams with their members', async () => {
    const fetchMock = stubFetch({
      ok: true,
      json: async () => [{
        _id: 'team-1',
        name: 'Octocats',
        description: 'Cheer each other on.',
        members: [{ username: 'mona-octocat', displayName: 'Mona Octocat' }],
      }],
    })

    render(<Teams />)

    expect(await screen.findByText('Octocats')).toBeTruthy()
    expect(screen.getByText('Cheer each other on.')).toBeTruthy()
    expect(screen.getByText('Mona Octocat')).toBeTruthy()
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/teams\/$/)
  })

  it('loads and renders leaderboard rank and team', async () => {
    const fetchMock = stubFetch({
      ok: true,
      json: async () => [{
        _id: 'leaderboard-1',
        rank: 1,
        user: { displayName: 'Mona Octocat' },
        team: { name: 'Octocats' },
        period: 'weekly',
        points: 240,
      }],
    })

    render(<Leaderboard />)

    expect(await screen.findByText('Mona Octocat')).toBeTruthy()
    expect(screen.getByText('Octocats')).toBeTruthy()
    expect(screen.getByText('240')).toBeTruthy()
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/leaderboard\/$/)
  })

  it('loads and renders workout details and exercises', async () => {
    const fetchMock = stubFetch({
      ok: true,
      json: async () => [{
        _id: 'workout-1',
        title: 'Octocat Easy Run',
        description: 'A relaxed running session.',
        activityType: 'run',
        level: 'beginner',
        durationMinutes: 25,
        exercises: ['Warmup walk', 'Easy run'],
      }],
    })

    render(<Workouts />)

    expect(await screen.findByText('Octocat Easy Run')).toBeTruthy()
    expect(screen.getByText('A relaxed running session.')).toBeTruthy()
    expect(screen.getByText('Warmup walk, Easy run')).toBeTruthy()
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/workouts\/$/)
  })

  it('shows API failures instead of a successful empty state', async () => {
    stubFetch({ ok: false, status: 503 })
    render(<Users />)

    expect(await screen.findByRole('alert')).toBeTruthy()
    expect(screen.getByRole('alert').textContent).toContain('503')
    expect(screen.queryByText('No athletes to show yet.')).toBeNull()
  })
})
