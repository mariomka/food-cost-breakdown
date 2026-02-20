import { ref, computed, watch } from 'vue'
import { useLocalStorage } from './useLocalStorage'

export type ThemeMode = 'light' | 'dark' | 'system'

const themeMode = useLocalStorage<ThemeMode>('theme', 'system')
const systemDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
mediaQuery.addEventListener('change', (e) => {
  systemDark.value = e.matches
})

const isDark = computed(() => {
  if (themeMode.value === 'system') {
    return systemDark.value
  }
  return themeMode.value === 'dark'
})

watch(
  isDark,
  (dark) => {
    document.documentElement.classList.toggle('dark', dark)
  },
  { immediate: true },
)

export function useTheme() {
  return {
    themeMode,
    isDark,
  }
}
