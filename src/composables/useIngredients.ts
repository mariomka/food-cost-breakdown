import { ref, computed } from 'vue'
import type { Ingredient } from '@/types/ingredient'

const STORAGE_KEY = 'food-cost-breakdown:ingredients'

const ingredients = ref<Ingredient[]>([])
let isInitialized = false

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      ingredients.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load ingredients from storage:', error)
    ingredients.value = []
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients.value))
  } catch (error) {
    console.error('Failed to save ingredients to storage:', error)
  }
}

export function useIngredients() {
  if (!isInitialized) {
    loadFromStorage()
    isInitialized = true
  }

  const sortedIngredients = computed(() => {
    return [...ingredients.value].sort((a, b) => b.createdAt - a.createdAt)
  })

  function addIngredient(ingredient: Omit<Ingredient, 'id' | 'createdAt'>) {
    const newIngredient: Ingredient = {
      ...ingredient,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    ingredients.value.push(newIngredient)
    saveToStorage()
    return newIngredient
  }

  function updateIngredient(id: string, updates: Partial<Omit<Ingredient, 'id' | 'createdAt'>>) {
    const index = ingredients.value.findIndex((i: Ingredient) => i.id === id)
    if (index !== -1) {
      ingredients.value[index] = {
        ...ingredients.value[index],
        ...updates,
      } as Ingredient
      saveToStorage()
      return true
    }
    return false
  }

  function deleteIngredient(id: string) {
    const index = ingredients.value.findIndex((i: Ingredient) => i.id === id)
    if (index !== -1) {
      ingredients.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  function getIngredientById(id: string) {
    return ingredients.value.find((i: Ingredient) => i.id === id)
  }

  function reset() {
    ingredients.value = []
    isInitialized = false
  }

  return {
    ingredients: sortedIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    getIngredientById,
    reset,
  }
}
