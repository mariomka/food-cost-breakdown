<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const { t, locale } = useI18n()

watch(locale, (val) => {
  localStorage.setItem('locale', val)
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-warm-200/80 bg-white/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="h-8 w-8">
            <!-- Pan bowl -->
            <path d="M2 21 C2 27 7.5 31 16 31 C24.5 31 30 27 30 21" fill="rgba(255,255,255,0.85)" />
            <!-- Pan rim -->
            <rect x="1" y="18.5" width="30" height="3" rx="1.5" fill="white" />
            <!-- Handle -->
            <rect x="30" y="19" width="2" height="2" rx="1" fill="rgba(255,255,255,0.35)" />
            <!-- Coin -->
            <circle cx="16" cy="10" r="8.5" fill="#fbbf24" />
            <circle
              cx="16"
              cy="10"
              r="6"
              fill="none"
              stroke="#d97706"
              stroke-width="0.6"
              opacity="0.45"
            />
            <!-- $ as path -->
            <path
              d="M14 7 C14 5.5 18 5.5 18 7.5 C18 9.5 14 9.5 14 12 C14 14.5 18 14.5 18 13"
              stroke="#92400e"
              stroke-width="1.4"
              fill="none"
              stroke-linecap="round"
            />
            <line
              x1="16"
              y1="4.5"
              x2="16"
              y2="15.5"
              stroke="#92400e"
              stroke-width="0.6"
              opacity="0.5"
            />
          </svg>
        </div>
        <div>
          <h1 class="font-display text-lg leading-tight font-normal text-warm-900 sm:text-xl">
            {{ t('app.title') }}
          </h1>
          <p class="text-[11px] font-medium tracking-widest text-warm-400 uppercase">
            {{ t('app.subtitle') }}
          </p>
        </div>
      </div>

      <Select v-model="locale">
        <SelectTrigger class="w-24 border-warm-200 text-xs" data-test="language-switcher">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </header>
</template>
