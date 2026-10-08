function readValue(record, key) {
  return key.split('.').reduce((value, part) => value?.[part], record)
}

function formatValue(value) {
  if (value === undefined || value === null || value === '') return '—'
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'string') return item
      return item.displayName || item.username || item.name || 'Member'
    }).join(', ')
  }
  if (typeof value === 'object') {
    return value.displayName || value.username || value.name || '—'
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value))
  }
  return String(value)
}

function ResourceTable({ columns, data, emptyMessage }) {
  if (data.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>
  }

  return (
    <div className="table-responsive">
      <table className="table resource-table align-middle mb-0">
        <thead>
          <tr>
            {columns.map(({ label }) => <th key={label} scope="col">{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record._id}>
              {columns.map(({ key, label }) => (
                <td key={key} data-label={label}>{formatValue(readValue(record, key))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResourceTable
