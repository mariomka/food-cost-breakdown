<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'

const { t } = useI18n()
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-12 sm:px-6">
    <div class="space-y-8">
      <div>
        <h2 class="font-display text-2xl text-warm-800">{{ t('info.title') }}</h2>
        <p class="mt-3 leading-relaxed text-warm-600">{{ t('info.description') }}</p>
      </div>

      <div>
        <h3 class="font-display mb-3 text-lg text-warm-800">{{ t('info.features') }}</h3>
        <ul class="space-y-2">
          <li
            v-for="key in ['ingredients', 'recipes', 'margin', 'export', 'offline', 'i18n']"
            :key="key"
            class="flex items-start gap-2 text-sm text-warm-600"
          >
            <span class="mt-1 text-amber-600">&#x2022;</span>
            {{ t(`info.featureList.${key}`) }}
          </li>
        </ul>
      </div>

      <RouterLink to="/">
        <Button variant="outline" size="sm"> &larr; {{ t('info.back') }} </Button>
      </RouterLink>
    </div>
  </div>
</template>
