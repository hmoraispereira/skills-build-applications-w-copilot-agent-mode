import { useFetchApiResource } from '../hooks/useApiResource.js'
import ResourceSection from './ResourceSection.jsx'
import { fetch } from '../api.js'

const columns = [
  { key: 'name', label: 'Team' },
  { key: 'description', label: 'About' },
  { key: 'members', label: 'Members' },
]

function Teams() {
  const { data, loading, error } = useFetchApiResource('/api/teams/', fetch)
  return (
    <ResourceSection
      columns={columns}
      data={data}
      description="Find your crew and keep each other moving."
      error={error}
      loading={loading}
      title="Teams"
    />
  )
}

export default Teams
