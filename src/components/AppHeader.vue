<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const { t, locale } = useI18n()
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-warm-200/80 bg-white/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="h-6 w-6">
            <!-- Pan bowl -->
            <path
              d="M5 19.5 C5 24.5 9.5 27.5 16 27.5 C22.5 27.5 27 24.5 27 19.5"
              fill="rgba(255,255,255,0.85)"
            />
            <!-- Pan rim -->
            <rect x="4" y="17.5" width="24" height="2.5" rx="1.25" fill="white" />
            <!-- Handle -->
            <rect x="27" y="18" width="3.5" height="1.5" rx="0.75" fill="rgba(255,255,255,0.4)" />
            <!-- Coin -->
            <circle cx="16" cy="11" r="6.5" fill="#fbbf24" />
            <circle
              cx="16"
              cy="11"
              r="4.5"
              fill="none"
              stroke="#d97706"
              stroke-width="0.5"
              opacity="0.45"
            />
            <!-- $ as path (S-curve + vertical line) -->
            <path
              d="M14.8 8.5 C14.8 7.2 17.2 7.2 17.2 9 C17.2 10.5 14.8 10.5 14.8 12.5 C14.8 14.3 17.2 14.3 17.2 13"
              stroke="#92400e"
              stroke-width="1"
              fill="none"
              stroke-linecap="round"
            />
            <line
              x1="16"
              y1="6.5"
              x2="16"
              y2="15.5"
              stroke="#92400e"
              stroke-width="0.5"
              opacity="0.6"
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
          <SelectItem value="en">{{ t('language.en') }}</SelectItem>
          <SelectItem value="es">{{ t('language.es') }}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </header>
</template>
