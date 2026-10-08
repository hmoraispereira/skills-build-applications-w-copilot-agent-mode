import ResourceTable from './ResourceTable.jsx'

function ResourceSection({ columns, data, description, error, loading, title }) {
  return (
    <section className="resource-section" aria-labelledby="resource-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">OCTOFIT COMMUNITY</p>
          <h2 id="resource-title">{title}</h2>
          <p className="section-description">{description}</p>
        </div>
        <span className="record-count">
          {loading ? 'Loading' : `${data.length} ${data.length === 1 ? 'record' : 'records'}`}
        </span>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading
        ? <div className="loading-state" role="status">Loading {title.toLowerCase()}…</div>
        : !error && (
          <ResourceTable
            columns={columns}
            data={data}
            emptyMessage={`No ${title.toLowerCase()} to show yet.`}
          />
        )}
    </section>
  )
}

export default ResourceSection
