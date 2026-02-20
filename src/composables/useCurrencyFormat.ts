import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const localeMap: Record<string, { locale: string; currency: string }> = {
  en: { locale: 'en-US', currency: 'USD' },
  es: { locale: 'es-ES', currency: 'EUR' },
}

export function useCurrencyFormat() {
  const { locale } = useI18n()

  const formatter = computed(() => {
    const config = localeMap[locale.value] ?? localeMap.en!
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  })

  function formatCurrency(value: number): string {
    return formatter.value.format(value)
  }

  return { formatCurrency }
}
