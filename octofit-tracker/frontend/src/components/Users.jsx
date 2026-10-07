import { useFetchApiResource } from '../hooks/useApiResource.js'
import ResourceSection from './ResourceSection.jsx'
import { fetch } from '../api.js'

const columns = [
  { key: 'displayName', label: 'Athlete' },
  { key: 'username', label: 'Username' },
  { key: 'team.name', label: 'Team' },
  { key: 'points', label: 'Points' },
  { key: 'age', label: 'Age' },
]

function Users() {
  const { data, loading, error } = useFetchApiResource('/api/users/', fetch)
  return (
    <ResourceSection
      columns={columns}
      data={data}
      description="Meet the athletes building healthy habits together."
      error={error}
      loading={loading}
      title="Athletes"
    />
  )
}

export default Users
