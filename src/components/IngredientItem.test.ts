import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import IngredientItem from './IngredientItem.vue'
import en from '@/i18n/locales/en'
import type { Ingredient } from '@/types'

const ingredient: Ingredient = {
  id: 'test-1',
  name: 'Flour',
  price: 2.5,
  quantity: 1,
  unit: 'kg',
}

function createWrapper(props = { ingredient }) {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en },
  })

  return mount(IngredientItem, {
    props,
    global: { plugins: [i18n] },
  })
}

describe('IngredientItem', () => {
  it('displays ingredient name and price', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Flour')
    expect(wrapper.text()).toContain('$2.50')
  })

  it('displays ingredient quantity and unit', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('kg')
  })

  it('emits delete event on double-click', async () => {
    const wrapper = createWrapper()
    await wrapper.find('[data-test="ingredient-item"]').trigger('dblclick')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual(['test-1'])
  })
})
