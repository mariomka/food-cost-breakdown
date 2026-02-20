<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6">
    <div class="space-y-8">
      <div>
        <h2 class="font-display text-2xl text-warm-800 dark:text-warm-100">
          {{ t('info.title') }}
        </h2>
        <p class="mt-3 leading-relaxed text-warm-600 dark:text-warm-300">
          {{ t('info.description') }}
        </p>
      </div>

      <div>
        <h3 class="font-display mb-3 text-lg text-warm-800 dark:text-warm-100">
          {{ t('info.features') }}
        </h3>
        <ul class="list-disc space-y-2 pl-5 marker:text-amber-600 dark:marker:text-amber-400">
          <li
            v-for="key in ['ingredients', 'recipes', 'margin', 'export', 'offline', 'i18n']"
            :key="key"
            class="text-sm text-warm-600 dark:text-warm-300"
          >
            {{ t(`info.featureList.${key}`) }}
          </li>
        </ul>
      </div>

      <i18n-t keypath="info.openSource" tag="p" class="text-sm text-warm-600 dark:text-warm-300">
        <a
          href="https://github.com/mariomka/food-cost-breakdown"
          target="_blank"
          rel="noopener noreferrer"
          class="text-amber-600 underline hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
        >
          GitHub
        </a>
      </i18n-t>
    </div>
  </div>
</template>
