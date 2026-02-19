import type { RecipeIngredient, Ingredient, UnitType } from '@/types'

const UNIT_CONVERSIONS: Record<string, number> = {
  'kg->g': 1000,
  'g->kg': 0.001,
  'L->mL': 1000,
  'mL->L': 0.001,
}

function convertQuantity(quantity: number, fromUnit: UnitType, toUnit: UnitType): number {
  if (fromUnit === toUnit) return quantity
  const key = `${fromUnit}->${toUnit}`
  const factor = UNIT_CONVERSIONS[key]
  if (factor) return quantity * factor
  return quantity
}

export function useCostCalculations() {
  function getIngredientCost(recipeIngredient: RecipeIngredient, ingredient: Ingredient): number {
    const convertedQuantity = convertQuantity(
      recipeIngredient.quantity,
      recipeIngredient.unit,
      ingredient.unit,
    )
    const pricePerUnit = ingredient.price / ingredient.quantity
    return pricePerUnit * convertedQuantity
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
