import { describe, it, expect } from 'vitest'
import { useCostCalculations } from './useCostCalculations'
import type { Ingredient, RecipeIngredient } from '@/types'

describe('useCostCalculations', () => {
  const { getIngredientCost, getTotalCost, getCostPerServing, getSuggestedPrice } =
    useCostCalculations()

  const flour: Ingredient = { id: '1', name: 'Flour', price: 2.0, quantity: 1, unit: 'kg' }
  const milk: Ingredient = { id: '2', name: 'Milk', price: 1.5, quantity: 1, unit: 'L' }
  const eggs: Ingredient = { id: '3', name: 'Eggs', price: 3.0, quantity: 12, unit: 'unit' }

  const ingredientsMap: Record<string, Ingredient> = {
    '1': flour,
    '2': milk,
    '3': eggs,
  }

  const getIngredientById = (id: string) => ingredientsMap[id]

  describe('getIngredientCost', () => {
    it('calculates cost for same unit', () => {
      const ri: RecipeIngredient = { ingredientId: '1', quantity: 0.5, unit: 'kg' }
      expect(getIngredientCost(ri, flour)).toBeCloseTo(1.0)
    })

    it('calculates cost with unit conversion (g to kg)', () => {
      const ri: RecipeIngredient = { ingredientId: '1', quantity: 500, unit: 'g' }
      expect(getIngredientCost(ri, flour)).toBeCloseTo(1.0)
    })

    it('calculates cost with unit conversion (mL to L)', () => {
      const ri: RecipeIngredient = { ingredientId: '2', quantity: 250, unit: 'mL' }
      expect(getIngredientCost(ri, milk)).toBeCloseTo(0.375)
    })

    it('calculates cost for unit-based ingredients', () => {
      const ri: RecipeIngredient = { ingredientId: '3', quantity: 3, unit: 'unit' }
      expect(getIngredientCost(ri, eggs)).toBeCloseTo(0.75)
    })
  })

  describe('getTotalCost', () => {
    it('sums costs of all recipe ingredients', () => {
      const recipeIngredients: RecipeIngredient[] = [
        { ingredientId: '1', quantity: 0.5, unit: 'kg' },
        { ingredientId: '2', quantity: 250, unit: 'mL' },
        { ingredientId: '3', quantity: 3, unit: 'unit' },
      ]
      const total = getTotalCost(recipeIngredients, getIngredientById)
      expect(total).toBeCloseTo(1.0 + 0.375 + 0.75)
    })

    it('skips missing ingredients', () => {
      const recipeIngredients: RecipeIngredient[] = [
        { ingredientId: 'missing', quantity: 1, unit: 'kg' },
      ]
      expect(getTotalCost(recipeIngredients, getIngredientById)).toBe(0)
    })

    it('returns 0 for empty ingredients list', () => {
      expect(getTotalCost([], getIngredientById)).toBe(0)
    })
  })

  describe('getCostPerServing', () => {
    it('divides total cost by servings', () => {
      expect(getCostPerServing(10, 4)).toBeCloseTo(2.5)
    })

    it('returns 0 for zero servings', () => {
      expect(getCostPerServing(10, 0)).toBe(0)
    })
  })

  describe('getSuggestedPrice', () => {
    it('calculates price with 30% margin', () => {
      expect(getSuggestedPrice(7, 30)).toBeCloseTo(10)
    })

    it('calculates price with 50% margin', () => {
      expect(getSuggestedPrice(5, 50)).toBeCloseTo(10)
    })

    it('returns 0 for 100% margin', () => {
      expect(getSuggestedPrice(5, 100)).toBe(0)
    })
  })
})
