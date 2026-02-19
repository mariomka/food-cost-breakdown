import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import IngredientForm from './IngredientForm.vue'
import en from '@/i18n/locales/en'
import { useIngredients } from '@/composables/useIngredients'

function createWrapper() {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en },
  })

  return mount(IngredientForm, {
    global: { plugins: [i18n] },
  })
}

describe('IngredientForm', () => {
  beforeEach(() => {
    localStorage.clear()
    const { ingredients } = useIngredients()
    ingredients.value = []
  })

  it('renders the form', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-test="ingredient-form"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="ingredient-name"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="ingredient-price"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="ingredient-quantity"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="ingredient-submit"]').exists()).toBe(true)
  })

  it('does not add ingredient with empty name', async () => {
    const wrapper = createWrapper()
    await wrapper.find('[data-test="ingredient-form"]').trigger('submit')
    const { ingredients } = useIngredients()
    expect(ingredients.value).toHaveLength(0)
  })
})
