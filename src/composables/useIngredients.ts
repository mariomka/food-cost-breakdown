import type { Ingredient, UnitType } from '@/types'
import { useLocalStorage } from './useLocalStorage'
import { useId } from './useId'

const ingredients = useLocalStorage<Ingredient[]>('ingredients', [])
const generateId = useId()

export function useIngredients() {
  function addIngredient(name: string, price: number, quantity: number, unit: UnitType) {
    ingredients.value.push({
      id: generateId(),
      name,
      price,
      quantity,
      unit,
    })
  }

  function removeIngredient(id: string) {
    ingredients.value = ingredients.value.filter((i) => i.id !== id)
  }

  function getIngredient(id: string): Ingredient | undefined {
    return ingredients.value.find((i) => i.id === id)
  }

  return {
    ingredients,
    addIngredient,
    removeIngredient,
    getIngredient,
  }
}
