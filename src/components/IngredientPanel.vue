<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIngredients } from '@/composables/useIngredients'
import { useRecipes } from '@/composables/useRecipes'
import { Button } from '@/components/ui/button'
import IngredientForm from './IngredientForm.vue'
import IngredientItem from './IngredientItem.vue'

const { t } = useI18n()
const { ingredients, removeIngredient } = useIngredients()
const { removeIngredientFromAllRecipes } = useRecipes()

const showForm = ref(false)

function handleDelete(id: string) {
  removeIngredientFromAllRecipes(id)
  removeIngredient(id)
}

function handleAdded() {
  showForm.value = false
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-3">
      <h2 class="font-display text-2xl text-warm-800">{{ t('ingredients.title') }}</h2>
      <div class="h-px flex-1 bg-warm-200" />
      <Button
        variant="ghost"
        size="sm"
        class="h-8 w-8 p-0 text-warm-400 hover:text-amber-700"
        data-test="ingredient-add-toggle"
        @click="showForm = !showForm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          class="h-5 w-5 transition-transform duration-200"
          :class="{ 'rotate-45': showForm }"
        >
          <path d="M12 5v14m-7-7h14" />
        </svg>
      </Button>
    </div>

    <Transition name="slide">
      <IngredientForm v-if="showForm" @added="handleAdded" />
    </Transition>

    <Transition name="fade" mode="out-in">
      <div v-if="ingredients.length === 0" class="py-14 text-center">
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
          @delete="handleDelete"
        />
      </TransitionGroup>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  margin-bottom: 0;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 300px;
}

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
