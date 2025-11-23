import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useIngredients } from '@/composables/useIngredients'

describe('useIngredients', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    const { reset } = useIngredients()
    reset()
  })

  it('should initialize with empty ingredients list', () => {
    const { ingredients } = useIngredients()
    expect(ingredients.value).toEqual([])
  })

  it('should add an ingredient', () => {
    const { ingredients, addIngredient } = useIngredients()

    const newIngredient = addIngredient({
      name: 'Tomato',
      unit: 'kg',
      pricePerUnit: 2.5,
      notes: 'Fresh tomatoes',
    })

    expect(ingredients.value).toHaveLength(1)
    expect(newIngredient.id).toBeDefined()
    expect(newIngredient.name).toBe('Tomato')
    expect(newIngredient.pricePerUnit).toBe(2.5)
  })

  it('should update an ingredient', () => {
    const { ingredients, addIngredient, updateIngredient } = useIngredients()

    const ingredient = addIngredient({
      name: 'Tomato',
      unit: 'kg',
      pricePerUnit: 2.5,
    })

    const success = updateIngredient(ingredient.id, {
      pricePerUnit: 3.0,
      notes: 'Updated price',
    })

    expect(success).toBe(true)
    expect(ingredients.value[0]!.pricePerUnit).toBe(3.0)
    expect(ingredients.value[0]!.notes).toBe('Updated price')
  })

  it('should delete an ingredient', () => {
    const { ingredients, addIngredient, deleteIngredient } = useIngredients()

    const ingredient = addIngredient({
      name: 'Tomato',
      unit: 'kg',
      pricePerUnit: 2.5,
    })

    expect(ingredients.value).toHaveLength(1)

    const success = deleteIngredient(ingredient.id)

    expect(success).toBe(true)
    expect(ingredients.value).toHaveLength(0)
  })

  it('should get ingredient by id', () => {
    const { addIngredient, getIngredientById } = useIngredients()

    const ingredient = addIngredient({
      name: 'Tomato',
      unit: 'kg',
      pricePerUnit: 2.5,
    })

    const found = getIngredientById(ingredient.id)
    expect(found).toEqual(ingredient)
  })

  it('should return undefined for non-existent ingredient', () => {
    const { getIngredientById } = useIngredients()
    const found = getIngredientById('non-existent-id')
    expect(found).toBeUndefined()
  })

  it('should sort ingredients by creation date descending', () => {
    const { ingredients, addIngredient } = useIngredients()

    // Mock Date.now to ensure different timestamps
    let timestamp = 1000
    vi.spyOn(Date, 'now').mockImplementation(() => timestamp++)

    const first = addIngredient({ name: 'Zucchini', unit: 'kg', pricePerUnit: 1.5 })
    const second = addIngredient({ name: 'Apple', unit: 'kg', pricePerUnit: 2.0 })
    const third = addIngredient({ name: 'Milk', unit: 'L', pricePerUnit: 1.2 })

    // Most recent first (Milk), then Apple, then Zucchini
    expect(ingredients.value[0]!.name).toBe('Milk')
    expect(ingredients.value[1]!.name).toBe('Apple')
    expect(ingredients.value[2]!.name).toBe('Zucchini')

    // Verify createdAt timestamps are in ascending order (oldest to newest)
    expect(first.createdAt).toBe(1000)
    expect(second.createdAt).toBe(1001)
    expect(third.createdAt).toBe(1002)
  })

  it('should persist to localStorage', () => {
    const { addIngredient } = useIngredients()

    addIngredient({
      name: 'Tomato',
      unit: 'kg',
      pricePerUnit: 2.5,
    })

    const stored = localStorage.getItem('food-cost-breakdown:ingredients')
    expect(stored).toBeTruthy()

    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].name).toBe('Tomato')
  })

  it('should load from localStorage on initialization', async () => {
    const testData = [
      {
        id: 'test-id',
        name: 'Tomato',
        unit: 'kg',
        pricePerUnit: 2.5,
        createdAt: Date.now(),
      },
    ]

    localStorage.setItem('food-cost-breakdown:ingredients', JSON.stringify(testData))

    vi.resetModules()
    const { useIngredients: freshUseIngredients } = await import('@/composables/useIngredients')
    const { ingredients } = freshUseIngredients()

    expect(ingredients.value).toHaveLength(1)
    expect(ingredients.value[0]!.name).toBe('Tomato')
  })
})
