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
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-700">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="h-5 w-5">
            <!-- Pan base -->
            <ellipse cx="16" cy="22" rx="10" ry="4" fill="rgba(255,255,255,0.2)" />
            <ellipse cx="16" cy="21" rx="10" ry="4" fill="white" />
            <!-- Pan handle -->
            <rect x="25" y="19.5" width="5" height="3" rx="1.5" fill="rgba(255,255,255,0.6)" />
            <!-- Coin stack in pan -->
            <ellipse cx="16" cy="19" rx="5" ry="2" fill="#f59e0b" />
            <rect x="11" y="17" width="10" height="2" fill="#f59e0b" />
            <ellipse cx="16" cy="17" rx="5" ry="2" fill="#fbbf24" />
            <rect x="11" y="15" width="10" height="2" fill="#fbbf24" />
            <ellipse cx="16" cy="15" rx="5" ry="2" fill="#fcd34d" />
            <!-- Dollar sign on top coin -->
            <text
              x="16"
              y="17"
              text-anchor="middle"
              font-size="5"
              font-weight="bold"
              fill="#92400e"
              font-family="sans-serif"
            >
              $
            </text>
            <!-- Steam wisps -->
            <path
              d="M11 12 Q10 9 11 7"
              stroke="white"
              stroke-width="1"
              fill="none"
              opacity="0.5"
              stroke-linecap="round"
            />
            <path
              d="M16 11 Q15 8 16 6"
              stroke="white"
              stroke-width="1"
              fill="none"
              opacity="0.4"
              stroke-linecap="round"
            />
            <path
              d="M21 12 Q20 9 21 7"
              stroke="white"
              stroke-width="1"
              fill="none"
              opacity="0.5"
              stroke-linecap="round"
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
