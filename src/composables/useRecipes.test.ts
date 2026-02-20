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
    addRecipe('Bread', [{ ingredientId: '1', quantity: 0.5 }], 30, 4)
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

  it('updates a recipe', () => {
    const { recipes, addRecipe, updateRecipe } = useRecipes()
    addRecipe('Bread', [], 30, 4)
    const id = recipes.value[0]!.id
    updateRecipe(id, { name: 'Sourdough Bread', targetMargin: 40 })
    expect(recipes.value[0]!.name).toBe('Sourdough Bread')
    expect(recipes.value[0]!.targetMargin).toBe(40)
    expect(recipes.value[0]!.servings).toBe(4)
  })

  it('removes ingredient from all recipes', () => {
    const { recipes, addRecipe, removeIngredientFromAllRecipes } = useRecipes()
    addRecipe('Bread', [{ ingredientId: 'ing-1', quantity: 0.5 }], 30, 4)
    addRecipe(
      'Cake',
      [
        { ingredientId: 'ing-1', quantity: 0.3 },
        { ingredientId: 'ing-2', quantity: 0.2 },
      ],
      40,
      8,
    )
    removeIngredientFromAllRecipes('ing-1')
    expect(recipes.value[0]!.ingredients).toHaveLength(0)
    expect(recipes.value[1]!.ingredients).toHaveLength(1)
    expect(recipes.value[1]!.ingredients[0]!.ingredientId).toBe('ing-2')
  })

  it('shares state across calls (singleton)', () => {
    const { addRecipe } = useRecipes()
    addRecipe('Bread', [], 30, 4)
    const { recipes } = useRecipes()
    expect(recipes.value).toHaveLength(1)
  })
})
