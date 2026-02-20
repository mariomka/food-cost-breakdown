import { createI18n } from 'vue-i18n'
import en from './locales/en'
import es from './locales/es'

function getLocale(): string {
  const saved = localStorage.getItem('locale')
  if (saved === 'es' || saved === 'en') return saved
  const lang = navigator.language.split('-')[0]
  return lang === 'es' ? 'es' : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getLocale(),
  fallbackLocale: 'en',
  messages: { en, es },
})

export default i18n
