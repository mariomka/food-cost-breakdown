import type { Ingredient, Recipe } from '@/types'
import { useIngredients } from './useIngredients'
import { useRecipes } from './useRecipes'

interface ExportData {
  version: 1
  ingredients: Ingredient[]
  recipes: Recipe[]
}

export function useExportImport() {
  const { ingredients } = useIngredients()
  const { recipes } = useRecipes()

  function exportData() {
    const data: ExportData = {
      version: 1,
      ingredients: ingredients.value,
      recipes: recipes.value,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'food-cost-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as ExportData
          if (!data.ingredients || !data.recipes) {
            reject(new Error('Invalid file format'))
            return
          }
          ingredients.value = data.ingredients
          recipes.value = data.recipes
          resolve()
        } catch {
          reject(new Error('Invalid JSON file'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  return { exportData, importData }
}
