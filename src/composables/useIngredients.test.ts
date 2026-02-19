import { describe, it, expect, beforeEach } from 'vitest'
import { useIngredients } from './useIngredients'

describe('useIngredients', () => {
  beforeEach(() => {
    localStorage.clear()
    const { ingredients } = useIngredients()
    ingredients.value = []
  })

  it('starts with empty ingredients', () => {
    const { ingredients } = useIngredients()
    expect(ingredients.value).toEqual([])
  })

  it('adds an ingredient', () => {
    const { ingredients, addIngredient } = useIngredients()
    addIngredient('Flour', 2.5, 1, 'kg')
    expect(ingredients.value).toHaveLength(1)
    expect(ingredients.value[0]!.name).toBe('Flour')
    expect(ingredients.value[0]!.price).toBe(2.5)
    expect(ingredients.value[0]!.quantity).toBe(1)
    expect(ingredients.value[0]!.unit).toBe('kg')
  })

  it('removes an ingredient', () => {
    const { ingredients, addIngredient, removeIngredient } = useIngredients()
    addIngredient('Flour', 2.5, 1, 'kg')
    const id = ingredients.value[0]!.id
    removeIngredient(id)
    expect(ingredients.value).toHaveLength(0)
  })

  it('gets an ingredient by id', () => {
    const { ingredients, addIngredient, getIngredient } = useIngredients()
    addIngredient('Flour', 2.5, 1, 'kg')
    const id = ingredients.value[0]!.id
    const ingredient = getIngredient(id)
    expect(ingredient?.name).toBe('Flour')
  })

  it('returns undefined for non-existent ingredient', () => {
    const { getIngredient } = useIngredients()
    expect(getIngredient('non-existent')).toBeUndefined()
  })

  it('shares state across calls (singleton)', () => {
    const { addIngredient } = useIngredients()
    addIngredient('Flour', 2.5, 1, 'kg')
    const { ingredients } = useIngredients()
    expect(ingredients.value).toHaveLength(1)
  })
})
