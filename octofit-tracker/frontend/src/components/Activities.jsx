import { useFetchApiResource } from '../hooks/useApiResource.js'
import ResourceSection from './ResourceSection.jsx'
import { fetch } from '../api.js'

const columns = [
  { key: 'user.displayName', label: 'Athlete' },
  { key: 'type', label: 'Activity' },
  { key: 'durationMinutes', label: 'Minutes' },
  { key: 'distanceKm', label: 'Distance (km)' },
  { key: 'points', label: 'Points' },
  { key: 'completedAt', label: 'Completed' },
]

function Activities() {
  const { data, loading, error } = useFetchApiResource('/api/activities/', fetch)
  return (
    <ResourceSection
      columns={columns}
      data={data}
      description="Every run, walk, and strength session adds up."
      error={error}
      loading={loading}
      title="Activities"
    />
  )
}

export default Activities
