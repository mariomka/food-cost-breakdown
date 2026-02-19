<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import IngredientPanel from '@/components/IngredientPanel.vue'
import RecipePanel from '@/components/RecipePanel.vue'
</script>

<template>
  <AppLayout>
    <template #ingredients>
      <IngredientPanel />
    </template>
    <template #recipes>
      <RecipePanel />
    </template>
  </AppLayout>
</template>
