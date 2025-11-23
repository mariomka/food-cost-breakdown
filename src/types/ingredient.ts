export type MetricUnit = 'kg' | 'g' | 'L' | 'ml'
export type ImperialUnit = 'lb' | 'oz' | 'gal' | 'fl oz'
export type GenericUnit = 'unit' | 'piece'

export type Unit = MetricUnit | ImperialUnit | GenericUnit

export interface Ingredient {
  id: string
  name: string
  unit: Unit
  pricePerUnit: number
  notes?: string
  createdAt: number
}
