<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Ingredient } from '@/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const props = defineProps<{
  ingredient: Ingredient
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const { t } = useI18n()

function handleDblClick() {
  emit('delete', props.ingredient.id)
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <div
          data-test="ingredient-item"
          class="flex cursor-default items-center justify-between rounded-md border border-warm-200 bg-white px-4 py-3 transition-colors hover:border-amber-200 hover:bg-amber-50/50"
          @dblclick="handleDblClick"
        >
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-warm-800">{{ ingredient.name }}</p>
            <p class="text-xs text-warm-400">
              {{ ingredient.quantity }} {{ t(`units.${ingredient.unit}`) }}
            </p>
          </div>
          <div class="ml-4 text-right">
            <p class="text-sm font-semibold text-amber-700">${{ ingredient.price.toFixed(2) }}</p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ t('ingredients.deleteHint') }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
