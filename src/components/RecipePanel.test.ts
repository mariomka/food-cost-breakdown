import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import RecipePanel from './RecipePanel.vue'
import en from '@/i18n/locales/en'
import { useRecipes } from '@/composables/useRecipes'
import { useIngredients } from '@/composables/useIngredients'

function createWrapper() {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en },
  })

  return mount(RecipePanel, {
    global: { plugins: [i18n] },
  })
}

describe('RecipePanel', () => {
  beforeEach(() => {
    localStorage.clear()
    const { recipes } = useRecipes()
    recipes.value = []
    const { ingredients } = useIngredients()
    ingredients.value = []
  })

  it('shows empty state when no recipes', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('No recipes created yet')
  })

  it('shows recipe list when recipes exist', () => {
    const { addIngredient, ingredients } = useIngredients()
    addIngredient('Flour', 2.0, 1, 'kg')
    const ingId = ingredients.value[0]!.id

    const { addRecipe } = useRecipes()
    addRecipe('Bread', [{ ingredientId: ingId, quantity: 0.5 }], 30, 4)

    const wrapper = createWrapper()
    expect(wrapper.find('[data-test="recipe-list"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Bread')
  })
})
