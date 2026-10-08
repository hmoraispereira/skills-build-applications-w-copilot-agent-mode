const codespaceName = import.meta.env.VITE_CODESPACE_NAME

export const apiBase = import.meta.env.VITE_API_BASE_URL
  || (codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000')

// Set VITE_CODESPACE_NAME in frontend/.env.local when Vite is not started in Codespaces.
export async function fetch(endpoint, signal) {
  const response = await globalThis.fetch(`${apiBase}${endpoint}`, { signal })
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json()
}
