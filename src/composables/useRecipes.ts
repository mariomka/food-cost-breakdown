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

  function removeRecipe(id: string) {
    recipes.value = recipes.value.filter((r) => r.id !== id)
  }

  function getRecipe(id: string): Recipe | undefined {
    return recipes.value.find((r) => r.id === id)
  }

  return {
    recipes,
    addRecipe,
    removeRecipe,
    getRecipe,
  }
}
