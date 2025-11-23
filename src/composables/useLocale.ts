import { computed } from 'vue'

const getCurrencyFromLocale = (locale: string): string => {
  const currencyMap: Record<string, string> = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-CA': 'CAD',
    'en-AU': 'AUD',
    'es-ES': 'EUR',
    'es-MX': 'MXN',
    'es-AR': 'ARS',
    'es-CL': 'CLP',
    'es-CO': 'COP',
    'es-PE': 'PEN',
    'es-VE': 'VES',
    'es-EC': 'USD',
    'es-GT': 'GTQ',
    'es-CU': 'CUP',
    'es-BO': 'BOB',
    'es-DO': 'DOP',
    'es-HN': 'HNL',
    'es-PY': 'PYG',
    'es-SV': 'USD',
    'es-NI': 'NIO',
    'es-CR': 'CRC',
    'es-PA': 'PAB',
    'es-UY': 'UYU',
    'es-GQ': 'XAF',
    'fr-FR': 'EUR',
    'de-DE': 'EUR',
    'it-IT': 'EUR',
    'pt-BR': 'BRL',
    'pt-PT': 'EUR',
    'ja-JP': 'JPY',
    'zh-CN': 'CNY',
    'ko-KR': 'KRW',
  }

  if (locale in currencyMap) {
    return currencyMap[locale]!
  }

  const languageCode = locale.split('-')[0]
  if (!languageCode) {
    return 'USD'
  }

  const defaultCurrencyByLanguage: Record<string, string> = {
    en: 'USD',
    es: 'EUR',
    fr: 'EUR',
    de: 'EUR',
    it: 'EUR',
    pt: 'EUR',
    ja: 'JPY',
    zh: 'CNY',
    ko: 'KRW',
  }

  if (languageCode in defaultCurrencyByLanguage) {
    return defaultCurrencyByLanguage[languageCode]!
  }

  return 'USD'
}

export function useLocale() {
  const browserLocale = computed(() => navigator.language || 'en-US')
  const currency = computed(() => getCurrencyFromLocale(browserLocale.value))

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(browserLocale.value, {
      style: 'currency',
      currency: currency.value,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return {
    browserLocale,
    currency,
    formatCurrency,
  }
}
