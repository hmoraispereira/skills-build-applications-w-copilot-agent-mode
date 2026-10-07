import { useFetchApiResource } from '../hooks/useApiResource.js'
import ResourceSection from './ResourceSection.jsx'
import { fetch } from '../api.js'

const columns = [
  { key: 'title', label: 'Workout' },
  { key: 'description', label: 'Description' },
  { key: 'activityType', label: 'Type' },
  { key: 'level', label: 'Level' },
  { key: 'durationMinutes', label: 'Minutes' },
  { key: 'exercises', label: 'Exercises' },
]

function Workouts() {
  const { data, loading, error } = useFetchApiResource('/api/workouts/', fetch)
  return (
    <ResourceSection
      columns={columns}
      data={data}
      description="Pick a session that suits your goals and your day."
      error={error}
      loading={loading}
      title="Workouts"
    />
  )
}

export default Workouts
