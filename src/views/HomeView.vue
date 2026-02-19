<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import IngredientPanel from '@/components/IngredientPanel.vue'
</script>

<template>
  <AppLayout>
    <template #ingredients>
      <IngredientPanel />
    </template>
    <template #recipes>
      <div class="rounded-lg border border-warm-200 bg-white p-6">
        <p class="text-sm text-warm-400">Recipes coming soon...</p>
      </div>
    </template>
  </AppLayout>
</template>
