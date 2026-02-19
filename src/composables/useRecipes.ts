import type { Recipe, RecipeIngredient } from '@/types'
import { useLocalStorage } from './useLocalStorage'
import { useId } from './useId'

const recipes = useLocalStorage<Recipe[]>('recipes', [])
const generateId = useId()

export function useRecipes() {
  function addRecipe(
    name: string,
    ingredients: RecipeIngredient[],
    targetMargin: number,
    servings: number,
  ) {
    recipes.value.push({
      id: generateId(),
      name,
      ingredients,
      targetMargin,
      servings,
    })
  }

  function updateRecipe(id: string, updates: Partial<Omit<Recipe, 'id'>>) {
    const index = recipes.value.findIndex((r) => r.id === id)
    if (index === -1) return
    recipes.value[index] = { ...recipes.value[index]!, ...updates }
  }

  function removeRecipe(id: string) {
    recipes.value = recipes.value.filter((r) => r.id !== id)
  }

  function getRecipe(id: string): Recipe | undefined {
    return recipes.value.find((r) => r.id === id)
  }

  function removeIngredientFromAllRecipes(ingredientId: string) {
    recipes.value = recipes.value.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.filter((ri) => ri.ingredientId !== ingredientId),
    }))
  }

  return {
    recipes,
    addRecipe,
    updateRecipe,
    removeRecipe,
    getRecipe,
    removeIngredientFromAllRecipes,
  }
}
