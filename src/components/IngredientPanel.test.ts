import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import IngredientPanel from './IngredientPanel.vue'
import en from '@/i18n/locales/en'
import { useIngredients } from '@/composables/useIngredients'

function createWrapper() {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en },
  })

  return mount(IngredientPanel, {
    global: { plugins: [i18n] },
  })
}

describe('IngredientPanel', () => {
  beforeEach(() => {
    localStorage.clear()
    const { ingredients } = useIngredients()
    ingredients.value = []
  })

  it('shows empty state when no ingredients', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('No ingredients added yet')
  })

  it('shows ingredient list when ingredients exist', () => {
    const { addIngredient } = useIngredients()
    addIngredient('Flour', 2.5, 1, 'kg')
    const wrapper = createWrapper()
    expect(wrapper.find('[data-test="ingredient-list"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Flour')
  })
})
