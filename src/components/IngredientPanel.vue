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
    <Transition name="fade" mode="out-in">
      <div v-if="ingredients.length === 0" class="py-12 text-center">
        <div
          class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-warm-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="h-6 w-6 text-warm-400"
          >
            <path d="M12 3v18m-9-9h18" stroke-linecap="round" />
          </svg>
        </div>
        <p class="text-sm text-warm-400">{{ t('ingredients.empty') }}</p>
      </div>
      <TransitionGroup v-else tag="div" name="list" class="space-y-2" data-test="ingredient-list">
        <IngredientItem
          v-for="ingredient in ingredients"
          :key="ingredient.id"
          :ingredient="ingredient"
          @delete="removeIngredient"
        />
      </TransitionGroup>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active {
  transition: all 0.3s ease;
}
.list-leave-active {
  transition: all 0.2s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
