import { createI18n } from 'vue-i18n'
import en from './locales/en'
import es from './locales/es'

function getBrowserLocale(): string {
  const lang = navigator.language.split('-')[0]
  return lang === 'es' ? 'es' : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(),
  fallbackLocale: 'en',
  messages: { en, es },
})

export default i18n
