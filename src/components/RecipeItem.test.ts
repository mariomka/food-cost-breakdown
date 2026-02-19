import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import RecipeItem from './RecipeItem.vue'
import en from '@/i18n/locales/en'
import type { Recipe } from '@/types'
import { useIngredients } from '@/composables/useIngredients'

const recipe: Recipe = {
  id: 'recipe-1',
  name: 'Bread',
  ingredients: [{ ingredientId: 'ing-1', quantity: 0.5, unit: 'kg' }],
  targetMargin: 30,
  servings: 4,
}

function createWrapper(props = { recipe }) {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en },
  })

  return mount(RecipeItem, {
    props,
    global: { plugins: [i18n] },
  })
}

describe('RecipeItem', () => {
  beforeEach(() => {
    localStorage.clear()
    const { ingredients, addIngredient } = useIngredients()
    ingredients.value = []
    addIngredient('Flour', 2.0, 1, 'kg')
    // Override the generated id to match our recipe
    ingredients.value[0]!.id = 'ing-1'
  })

  it('displays recipe name', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Bread')
  })

  it('displays servings', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('4')
  })

  it('displays cost calculations', () => {
    const wrapper = createWrapper()
    // Total cost: 0.5kg * $2/kg = $1.00
    expect(wrapper.text()).toContain('$1.00')
  })

  it('emits delete event from edit mode delete button', async () => {
    const wrapper = createWrapper()
    await wrapper.find('[data-test="recipe-item"]').trigger('click')
    await wrapper.find('[data-test="recipe-edit-delete"]').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual(['recipe-1'])
  })
})
