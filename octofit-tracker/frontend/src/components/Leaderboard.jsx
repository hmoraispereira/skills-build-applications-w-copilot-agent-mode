import { useFetchApiResource } from '../hooks/useApiResource.js'
import ResourceSection from './ResourceSection.jsx'
import { fetch } from '../api.js'

const columns = [
  { key: 'rank', label: 'Rank' },
  { key: 'user.displayName', label: 'Athlete' },
  { key: 'team.name', label: 'Team' },
  { key: 'period', label: 'Period' },
  { key: 'points', label: 'Points' },
]

function Leaderboard() {
  const { data, loading, error } = useFetchApiResource('/api/leaderboard/', fetch)
  return (
    <ResourceSection
      columns={columns}
      data={data}
      description="Celebrate effort and friendly competition across the community."
      error={error}
      loading={loading}
      title="Leaderboard"
    />
  )
}

export default Leaderboard
