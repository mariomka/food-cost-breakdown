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

  function updateIngredient(id: string, updates: Partial<Omit<Ingredient, 'id'>>) {
    const index = ingredients.value.findIndex((i) => i.id === id)
    if (index === -1) return
    ingredients.value[index] = { ...ingredients.value[index]!, ...updates }
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
    updateIngredient,
    removeIngredient,
    getIngredient,
  }
}
