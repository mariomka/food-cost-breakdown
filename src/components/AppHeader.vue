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
  <header class="sticky top-0 z-50 border-b border-warm-200 bg-white/90 backdrop-blur-md">
    <div class="h-0.5 bg-gradient-to-r from-amber-500 via-terracotta-400 to-amber-600" />
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-terracotta-500 text-white shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
          >
            <path
              d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"
            />
            <path d="M10 21h4" />
            <path d="M12 6v2" />
            <path d="M10 8h4" />
          </svg>
        </div>
        <div>
          <h1 class="font-display text-xl leading-tight font-normal text-warm-900">
            {{ t('app.title') }}
          </h1>
          <p class="text-xs tracking-wide text-warm-400">{{ t('app.subtitle') }}</p>
        </div>
      </div>

      <Select v-model="locale">
        <SelectTrigger class="w-28 text-xs" data-test="language-switcher">
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
