<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueDraggable } from 'vue-draggable-plus'
import { useRecipes } from '@/composables/useRecipes'
import { Button } from '@/components/ui/button'
import RecipeForm from './RecipeForm.vue'
import RecipeItem from './RecipeItem.vue'

const { t } = useI18n()
const { recipes, removeRecipe } = useRecipes()

const showForm = ref(false)

function handleAdded() {
  showForm.value = false
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center gap-3">
      <h2 class="font-display text-2xl text-warm-800 dark:text-warm-100">
        {{ t('recipes.title') }}
      </h2>
      <div class="h-px flex-1 bg-warm-200 dark:bg-warm-700" />
      <Button
        variant="ghost"
        size="sm"
        class="h-8 w-8 p-0 text-warm-400 hover:text-amber-700 dark:text-warm-500 dark:hover:text-amber-400"
        data-test="recipe-add-toggle"
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
      <RecipeForm v-if="showForm" @added="handleAdded" />
    </Transition>

    <Transition name="fade" mode="out-in">
      <div v-if="recipes.length === 0" class="py-14 text-center">
        <div
          class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-warm-100 dark:bg-warm-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="h-5 w-5 text-warm-300 dark:text-warm-600"
          >
            <path d="M4 19h16M4 15h16M8 11h8M10 7h4" stroke-linecap="round" />
          </svg>
        </div>
        <p class="text-sm text-warm-400 dark:text-warm-500">{{ t('recipes.empty') }}</p>
      </div>
      <VueDraggable
        v-else
        v-model="recipes"
        tag="div"
        :animation="200"
        handle=".drag-handle"
        ghost-class="opacity-50"
        class="space-y-3"
        data-test="recipe-list"
      >
        <RecipeItem
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
          @delete="removeRecipe"
        />
      </VueDraggable>
    </Transition>
  </div>
</template>
