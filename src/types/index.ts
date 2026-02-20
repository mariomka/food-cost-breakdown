export type UnitType = 'kg' | 'g' | 'L' | 'mL' | 'lb' | 'oz' | 'fl oz' | 'unit'

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
}

export interface Recipe {
  id: string
  name: string
  ingredients: RecipeIngredient[]
  targetMargin: number
  servings: number
}
