import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns default value when no stored value exists', () => {
    const data = useLocalStorage('test-key', 'default')
    expect(data.value).toBe('default')
  })

  it('returns stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'))
    const data = useLocalStorage('test-key', 'default')
    expect(data.value).toBe('stored')
  })

  it('persists value changes to localStorage', async () => {
    const data = useLocalStorage('test-key', 'initial')
    data.value = 'updated'
    await nextTick()
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('updated')
  })

  it('handles objects', async () => {
    const data = useLocalStorage('test-key', { name: 'test' })
    expect(data.value).toEqual({ name: 'test' })

    data.value = { name: 'updated' }
    await nextTick()
    expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual({ name: 'updated' })
  })

  it('handles arrays', async () => {
    const data = useLocalStorage<string[]>('test-key', [])
    data.value.push('item')
    await nextTick()
    expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual(['item'])
  })
})
