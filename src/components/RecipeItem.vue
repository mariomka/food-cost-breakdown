<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Recipe } from '@/types'
import { useIngredients } from '@/composables/useIngredients'
import { useCostCalculations } from '@/composables/useCostCalculations'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const props = defineProps<{
  recipe: Recipe
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const { t } = useI18n()
const { getIngredient } = useIngredients()
const { getTotalCost, getCostPerServing, getSuggestedPrice } = useCostCalculations()

const totalCost = computed(() => getTotalCost(props.recipe.ingredients, (id) => getIngredient(id)))
const costPerServing = computed(() => getCostPerServing(totalCost.value, props.recipe.servings))
const suggestedPrice = computed(() =>
  getSuggestedPrice(costPerServing.value, props.recipe.targetMargin),
)

function handleDblClick() {
  emit('delete', props.recipe.id)
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <div
          data-test="recipe-item"
          class="cursor-default rounded-lg border border-warm-200 bg-white p-4 transition-colors hover:border-terracotta-200 hover:bg-terracotta-50/30"
          @dblclick="handleDblClick"
        >
          <div class="mb-3 flex items-start justify-between">
            <h3 class="font-display text-lg text-warm-800">{{ recipe.name }}</h3>
            <span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {{ recipe.servings }} {{ t('recipes.servings').toLowerCase() }}
            </span>
          </div>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between text-warm-500">
              <span>{{ t('recipes.totalCost') }}</span>
              <span class="text-warm-700">${{ totalCost.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-warm-500">
              <span>{{ t('recipes.costPerServing') }}</span>
              <span class="text-warm-700">${{ costPerServing.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-medium">
              <span class="text-warm-600">{{ t('recipes.suggestedPrice') }}</span>
              <span class="text-amber-700">${{ suggestedPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ t('recipes.deleteHint') }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
