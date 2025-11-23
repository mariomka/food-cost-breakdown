import { createI18n } from 'vue-i18n'
import en from './locales/en'
import es from './locales/es'

const supportedLocales = ['en', 'es']

const getBrowserLocale = (): string => {
  const browserLocale = navigator.language.split('-')[0]
  return browserLocale && supportedLocales.includes(browserLocale) ? browserLocale : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(),
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en,
    es,
  },
})

export default i18n
