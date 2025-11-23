import { vi } from 'vitest'

export const mockT = vi.fn((key: string) => key)

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: mockT,
    locale: { value: 'en' },
  }),
  createI18n: vi.fn(),
}))
