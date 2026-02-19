import { describe, it, expect } from 'vitest'
import { useId } from './useId'

describe('useId', () => {
  it('generates a string id', () => {
    const generateId = useId()
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('generates unique ids', () => {
    const generateId = useId()
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})
