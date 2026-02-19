import { describe, it, expect, beforeEach } from 'vitest'
import { useRecipes } from './useRecipes'

describe('useRecipes', () => {
  beforeEach(() => {
    localStorage.clear()
    const { recipes } = useRecipes()
    recipes.value = []
  })

  it('starts with empty recipes', () => {
    const { recipes } = useRecipes()
    expect(recipes.value).toEqual([])
  })

  it('adds a recipe', () => {
    const { recipes, addRecipe } = useRecipes()
    addRecipe('Bread', [{ ingredientId: '1', quantity: 0.5, unit: 'kg' }], 30, 4)
    expect(recipes.value).toHaveLength(1)
    expect(recipes.value[0]!.name).toBe('Bread')
    expect(recipes.value[0]!.targetMargin).toBe(30)
    expect(recipes.value[0]!.servings).toBe(4)
    expect(recipes.value[0]!.ingredients).toHaveLength(1)
  })

  it('removes a recipe', () => {
    const { recipes, addRecipe, removeRecipe } = useRecipes()
    addRecipe('Bread', [], 30, 4)
    const id = recipes.value[0]!.id
    removeRecipe(id)
    expect(recipes.value).toHaveLength(0)
  })

  it('gets a recipe by id', () => {
    const { recipes, addRecipe, getRecipe } = useRecipes()
    addRecipe('Bread', [], 30, 4)
    const id = recipes.value[0]!.id
    const recipe = getRecipe(id)
    expect(recipe?.name).toBe('Bread')
  })

  it('returns undefined for non-existent recipe', () => {
    const { getRecipe } = useRecipes()
    expect(getRecipe('non-existent')).toBeUndefined()
  })

  it('shares state across calls (singleton)', () => {
    const { addRecipe } = useRecipes()
    addRecipe('Bread', [], 30, 4)
    const { recipes } = useRecipes()
    expect(recipes.value).toHaveLength(1)
  })
})
