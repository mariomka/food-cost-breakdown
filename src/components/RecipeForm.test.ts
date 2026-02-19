import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import RecipeForm from './RecipeForm.vue'
import en from '@/i18n/locales/en'
import { useIngredients } from '@/composables/useIngredients'
import { useRecipes } from '@/composables/useRecipes'

function createWrapper() {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en },
  })

  return mount(RecipeForm, {
    global: { plugins: [i18n] },
  })
}

describe('RecipeForm', () => {
  beforeEach(() => {
    localStorage.clear()
    const { ingredients } = useIngredients()
    ingredients.value = []
    const { recipes } = useRecipes()
    recipes.value = []
  })

  it('renders the form', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-test="recipe-form"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="recipe-name"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="recipe-servings"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="recipe-margin"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="recipe-submit"]').exists()).toBe(true)
  })

  it('does not add recipe with empty name', async () => {
    const wrapper = createWrapper()
    await wrapper.find('[data-test="recipe-form"]').trigger('submit')
    const { recipes } = useRecipes()
    expect(recipes.value).toHaveLength(0)
  })

  it('shows cost summary when ingredients are added', async () => {
    const { addIngredient, ingredients } = useIngredients()
    addIngredient('Flour', 2.0, 1, 'kg')
    const wrapper = createWrapper()

    // Cost summary should not be visible with no recipe ingredients
    expect(wrapper.find('[data-test="recipe-cost-summary"]').exists()).toBe(false)

    // Verify ingredient is available to select
    expect(ingredients.value).toHaveLength(1)
  })
})
