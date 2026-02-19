<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRecipes } from '@/composables/useRecipes'
import RecipeForm from './RecipeForm.vue'
import RecipeItem from './RecipeItem.vue'

const { t } = useI18n()
const { recipes, removeRecipe } = useRecipes()
</script>

<template>
  <div class="space-y-5">
    <RecipeForm />
    <Transition name="fade" mode="out-in">
      <div v-if="recipes.length === 0" class="py-14 text-center">
        <div
          class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-warm-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="h-5 w-5 text-warm-300"
          >
            <path d="M4 19h16M4 15h16M8 11h8M10 7h4" stroke-linecap="round" />
          </svg>
        </div>
        <p class="text-sm text-warm-400">{{ t('recipes.empty') }}</p>
      </div>
      <TransitionGroup v-else tag="div" name="list" class="space-y-3" data-test="recipe-list">
        <RecipeItem
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
          @delete="removeRecipe"
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
