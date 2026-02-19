<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'

const { t } = useI18n()
</script>

<template>
  <AppLayout>
    <template #ingredients>
      <div class="rounded-lg border border-warm-200 bg-white p-6">
        <p class="text-sm text-warm-400">{{ t('ingredients.empty') }}</p>
      </div>
    </template>
    <template #recipes>
      <div class="rounded-lg border border-warm-200 bg-white p-6">
        <p class="text-sm text-warm-400">{{ t('recipes.empty') }}</p>
      </div>
    </template>
  </AppLayout>
</template>
