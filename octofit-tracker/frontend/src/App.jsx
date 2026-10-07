import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import './App.css'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

const navigation = [
  { to: '/users', label: 'Athletes' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
]

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <div className="container app-container">
            <NavLink className="brand" to="/users" aria-label="OctoFit Tracker home">
              <img src={logo} alt="" className="brand-logo" />
              <span>OctoFit <strong>Tracker</strong></span>
            </NavLink>
            <nav className="main-nav" aria-label="Main navigation">
              {navigation.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="container app-container main-content">
          <section className="welcome-panel">
            <div>
              <p className="eyebrow">YOUR SCHOOL. YOUR TEAM. YOUR NEXT GOAL.</p>
              <h1>Make every move count.</h1>
              <p className="welcome-copy">
                Track your activity, cheer on your teammates, and find your next workout.
              </p>
            </div>
            <div className="welcome-mark" aria-hidden="true">✦</div>
          </section>

          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Navigate to="/users" replace />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <div className="container app-container">
            <span>OctoFit Tracker</span>
            <span>Progress looks good on you.</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
