<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRecipes } from '@/composables/useRecipes'
import RecipeForm from './RecipeForm.vue'
import RecipeItem from './RecipeItem.vue'
import { Separator } from '@/components/ui/separator'

const { t } = useI18n()
const { recipes, removeRecipe } = useRecipes()
</script>

<template>
  <div class="space-y-4">
    <RecipeForm />
    <Separator />
    <div v-if="recipes.length === 0" class="py-8 text-center">
      <p class="text-sm text-warm-400">{{ t('recipes.empty') }}</p>
    </div>
    <div v-else class="space-y-3" data-test="recipe-list">
      <RecipeItem
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
        @delete="removeRecipe"
      />
    </div>
  </div>
</template>
