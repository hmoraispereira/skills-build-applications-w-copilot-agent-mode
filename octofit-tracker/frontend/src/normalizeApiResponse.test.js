import { describe, expect, it } from 'vitest'
import { normalizeApiResponse } from './normalizeApiResponse.js'

describe('normalizeApiResponse', () => {
  it('accepts a plain array response', () => {
    expect(normalizeApiResponse([{ id: 1 }])).toEqual([{ id: 1 }])
  })

  it('accepts common paginated response shapes', () => {
    const records = [{ id: 1 }]
    expect(normalizeApiResponse({ count: 1, results: records })).toEqual(records)
    expect(normalizeApiResponse({ data: records, total: 1 })).toEqual(records)
    expect(normalizeApiResponse({ items: records, page: 1 })).toEqual(records)
  })

  it('rejects malformed response shapes rather than hiding the API error', () => {
    expect(() => normalizeApiResponse({ results: 'not an array' }))
      .toThrow(/unexpected response/)
  })
})
