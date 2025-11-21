import { config } from '@vue/test-utils'
import { vi } from 'vitest'

export const mockT = vi.fn((key: string) => key)

config.global.mocks = {
  $t: mockT,
}
