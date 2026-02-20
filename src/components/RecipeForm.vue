<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RecipeIngredient } from '@/types'
import { useIngredients } from '@/composables/useIngredients'
import { useRecipes } from '@/composables/useRecipes'
import { useCostCalculations } from '@/composables/useCostCalculations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const { t } = useI18n()
const { ingredients, getIngredient } = useIngredients()
const { addRecipe } = useRecipes()
const { getTotalCost, getCostPerServing, getSuggestedPrice } = useCostCalculations()

const name = ref('')
const servings = ref<number | undefined>()
const targetMargin = ref<number | undefined>()

const recipeIngredients = ref<RecipeIngredient[]>([])
const selectedIngredientId = ref('')

// Auto-add ingredient when selected
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onIngredientSelected(value: string | number | bigint | Record<string, any> | null) {
  if (!value || typeof value !== 'string') return
  const ingredientId = value
  const ingredient = getIngredient(ingredientId)
  if (!ingredient) return

  recipeIngredients.value.push({
    ingredientId,
    quantity: 0,
  })
  selectedIngredientId.value = ''
}

function removeRecipeIngredient(index: number) {
  recipeIngredients.value.splice(index, 1)
}

// Remove recipe ingredients when their source ingredient is deleted
watch(
  () => ingredients.value.map((i) => i.id),
  (currentIds) => {
    const idSet = new Set(currentIds)
    recipeIngredients.value = recipeIngredients.value.filter((ri) => idSet.has(ri.ingredientId))
  },
)

const totalCost = computed(() => {
  return getTotalCost(recipeIngredients.value, (id) => getIngredient(id))
})

const costPerServing = computed(() => {
  return getCostPerServing(totalCost.value, servings.value || 0)
})

const suggestedPrice = computed(() => {
  return getSuggestedPrice(costPerServing.value, targetMargin.value || 0)
})

const availableIngredients = computed(() => {
  const usedIds = new Set(recipeIngredients.value.map((ri) => ri.ingredientId))
  return ingredients.value.filter((i) => !usedIds.has(i.id))
})

function handleSubmit() {
  if (!name.value.trim() || recipeIngredients.value.length === 0) return
  addRecipe(
    name.value.trim(),
    recipeIngredients.value.map(({ ingredientId, quantity }) => ({
      ingredientId,
      quantity,
    })),
    targetMargin.value || 0,
    servings.value || 1,
  )
  name.value = ''
  servings.value = undefined
  targetMargin.value = undefined
  recipeIngredients.value = []
}
</script>

<template>
  <form
    data-test="recipe-form"
    class="space-y-3 rounded-lg border border-warm-200/80 bg-white p-4 shadow-sm"
    @submit.prevent="handleSubmit"
  >
    <Input v-model="name" data-test="recipe-name" :placeholder="t('recipes.namePlaceholder')" />

    <div class="grid grid-cols-2 gap-2">
      <Input
        v-model.number="servings"
        data-test="recipe-servings"
        type="number"
        min="1"
        :placeholder="t('recipes.servings')"
      />
      <Input
        v-model.number="targetMargin"
        data-test="recipe-margin"
        type="number"
        min="0"
        max="99"
        :placeholder="t('recipes.targetMargin')"
      />
    </div>

    <Separator class="!my-4" />

    <!-- Add ingredient to recipe — auto-adds on select -->
    <Select v-model="selectedIngredientId" @update:model-value="onIngredientSelected">
      <SelectTrigger data-test="recipe-ingredient-select">
        <SelectValue :placeholder="t('recipes.selectIngredient')" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="ing in availableIngredients" :key="ing.id" :value="ing.id">
          {{ ing.name }}
        </SelectItem>
      </SelectContent>
    </Select>

    <!-- Recipe ingredients list -->
    <div
      v-if="recipeIngredients.length > 0"
      class="space-y-1.5"
      data-test="recipe-ingredients-list"
    >
      <div
        v-for="(ri, index) in recipeIngredients"
        :key="ri.ingredientId"
        class="flex items-center gap-2 rounded-md border border-warm-100 bg-warm-50/50 px-3 py-2"
        data-test="recipe-ingredient-row"
      >
        <span class="min-w-0 flex-1 truncate text-sm text-warm-700">
          {{ getIngredient(ri.ingredientId)?.name }}
        </span>
        <Input
          v-model.number="ri.quantity"
          type="number"
          step="0.01"
          min="0"
          class="w-20"
          placeholder="Qty"
        />
        <span class="w-12 text-center text-xs text-warm-400">{{
          t(`units.${getIngredient(ri.ingredientId)?.unit}`)
        }}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          class="h-8 w-8 p-0 text-warm-400 hover:text-destructive"
          @click="removeRecipeIngredient(index)"
        >
          &times;
        </Button>
      </div>
    </div>

    <!-- Live cost calculations -->
    <div
      v-if="recipeIngredients.length > 0"
      class="rounded-md bg-warm-50 p-3 text-sm"
      data-test="recipe-cost-summary"
    >
      <div class="flex justify-between py-0.5">
        <span class="text-warm-500">{{ t('recipes.totalCost') }}</span>
        <span class="font-medium tabular-nums text-warm-700">${{ totalCost.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between py-0.5">
        <span class="text-warm-500">{{ t('recipes.costPerServing') }}</span>
        <span class="font-medium tabular-nums text-warm-700">${{ costPerServing.toFixed(2) }}</span>
      </div>
      <div class="mt-1 flex justify-between border-t border-warm-200 pt-1.5">
        <span class="font-medium text-warm-600">{{ t('recipes.suggestedPrice') }}</span>
        <span class="font-semibold tabular-nums text-amber-700"
          >${{ suggestedPrice.toFixed(2) }}</span
        >
      </div>
    </div>

    <Button type="submit" class="w-full" data-test="recipe-submit">
      {{ t('recipes.addRecipe') }}
    </Button>
  </form>
</template>
