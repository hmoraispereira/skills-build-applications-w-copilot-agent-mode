export function normalizeApiResponse(payload) {
  if (Array.isArray(payload)) return payload

  if (payload && typeof payload === 'object') {
    for (const key of ['results', 'data', 'items']) {
      if (Array.isArray(payload[key])) return payload[key]
    }
  }

  throw new Error('The API returned an unexpected response.')
}
