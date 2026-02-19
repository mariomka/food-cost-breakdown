<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useIngredients } from '@/composables/useIngredients'
import IngredientForm from './IngredientForm.vue'
import IngredientItem from './IngredientItem.vue'
import { Separator } from '@/components/ui/separator'

const { t } = useI18n()
const { ingredients, removeIngredient } = useIngredients()
</script>

<template>
  <div class="space-y-4">
    <IngredientForm />
    <Separator />
    <div v-if="ingredients.length === 0" class="py-8 text-center">
      <p class="text-sm text-warm-400">{{ t('ingredients.empty') }}</p>
    </div>
    <div v-else class="space-y-2" data-test="ingredient-list">
      <IngredientItem
        v-for="ingredient in ingredients"
        :key="ingredient.id"
        :ingredient="ingredient"
        @delete="removeIngredient"
      />
    </div>
  </div>
</template>
