import type { RecipeIngredient, Ingredient } from '@/types'

export function useCostCalculations() {
  function getIngredientCost(recipeIngredient: RecipeIngredient, ingredient: Ingredient): number {
    return (ingredient.price / ingredient.quantity) * recipeIngredient.quantity
  }

  function getTotalCost(
    recipeIngredients: RecipeIngredient[],
    getIngredientById: (id: string) => Ingredient | undefined,
  ): number {
    return recipeIngredients.reduce((total, ri) => {
      const ingredient = getIngredientById(ri.ingredientId)
      if (!ingredient) return total
      return total + getIngredientCost(ri, ingredient)
    }, 0)
  }

  function getCostPerServing(totalCost: number, servings: number): number {
    if (servings <= 0) return 0
    return totalCost / servings
  }

  function getSuggestedPrice(costPerServing: number, targetMargin: number): number {
    if (targetMargin >= 100) return 0
    return costPerServing / (1 - targetMargin / 100)
  }

  return {
    getIngredientCost,
    getTotalCost,
    getCostPerServing,
    getSuggestedPrice,
  }
}
