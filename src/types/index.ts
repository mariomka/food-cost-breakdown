export type UnitType = 'kg' | 'g' | 'L' | 'mL' | 'unit'

export interface Ingredient {
  id: string
  name: string
  price: number
  quantity: number
  unit: UnitType
}

export interface RecipeIngredient {
  ingredientId: string
  quantity: number
  unit: UnitType
}

export interface Recipe {
  id: string
  name: string
  ingredients: RecipeIngredient[]
  targetMargin: number
  servings: number
}
