<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RecipeIngredient } from '@/types'
import { useIngredients } from '@/composables/useIngredients'
import { useRecipes } from '@/composables/useRecipes'
import { useCostCalculations } from '@/composables/useCostCalculations'
import { useCurrencyFormat } from '@/composables/useCurrencyFormat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const emit = defineEmits<{ added: [] }>()

const { t } = useI18n()
const { ingredients, getIngredient } = useIngredients()
const { addRecipe } = useRecipes()
const { getTotalCost, getCostPerServing, getSuggestedPrice, getMarginFromPrice } =
  useCostCalculations()
const { formatCurrency } = useCurrencyFormat()

const name = ref('')
const servings = ref<number | undefined>()
const targetMargin = ref<number>(66)
const targetPrice = ref<number | undefined>()
const pricingMode = ref<'margin' | 'price'>('margin')

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
  if (pricingMode.value === 'price') return targetPrice.value || 0
  return getSuggestedPrice(costPerServing.value, targetMargin.value || 0)
})

const calculatedMargin = computed(() => {
  if (pricingMode.value === 'margin') return targetMargin.value || 0
  return getMarginFromPrice(costPerServing.value, targetPrice.value || 0)
})

const availableIngredients = computed(() => {
  const usedIds = new Set(recipeIngredients.value.map((ri) => ri.ingredientId))
  return ingredients.value.filter((i) => !usedIds.has(i.id))
})

function handleSubmit() {
  if (!name.value.trim() || recipeIngredients.value.length === 0) return

  const submitMargin =
    pricingMode.value === 'margin' ? targetMargin.value || 0 : calculatedMargin.value
  const submitPrice = pricingMode.value === 'price' ? targetPrice.value || 0 : 0

  addRecipe(
    name.value.trim(),
    recipeIngredients.value.map(({ ingredientId, quantity }) => ({
      ingredientId,
      quantity,
    })),
    submitMargin,
    servings.value || 1,
    submitPrice,
  )
  name.value = ''
  servings.value = undefined
  targetMargin.value = 66
  targetPrice.value = undefined
  pricingMode.value = 'margin'
  recipeIngredients.value = []
  emit('added')
}
</script>

<template>
  <form
    data-test="recipe-form"
    class="space-y-3 rounded-lg border border-warm-200/80 bg-white p-4 shadow-sm dark:border-warm-700/80 dark:bg-warm-800"
    @submit.prevent="handleSubmit"
  >
    <div class="space-y-1">
      <Label for="recipe-name" class="text-xs text-warm-500 dark:text-warm-400">{{
        t('common.name')
      }}</Label>
      <Input
        id="recipe-name"
        v-model="name"
        data-test="recipe-name"
        :placeholder="t('recipes.namePlaceholder')"
      />
    </div>

    <div class="space-y-1">
      <Label for="recipe-servings" class="text-xs text-warm-500 dark:text-warm-400">{{
        t('recipes.servings')
      }}</Label>
      <Input
        id="recipe-servings"
        v-model.number="servings"
        data-test="recipe-servings"
        type="number"
        min="1"
        :placeholder="t('recipes.servings')"
      />
    </div>

    <div class="space-y-2">
      <Tabs v-model="pricingMode" class="w-full">
        <TabsList class="w-full">
          <TabsTrigger value="margin" class="flex-1" data-test="pricing-mode-margin">
            {{ t('recipes.margin') }}
          </TabsTrigger>
          <TabsTrigger value="price" class="flex-1" data-test="pricing-mode-price">
            {{ t('recipes.price') }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div v-if="pricingMode === 'margin'" class="space-y-1">
        <Label for="recipe-margin" class="text-xs text-warm-500 dark:text-warm-400">{{
          t('recipes.margin')
        }}</Label>
        <Input
          id="recipe-margin"
          v-model.number="targetMargin"
          data-test="recipe-margin"
          type="number"
          min="0"
          max="99"
          :placeholder="t('recipes.margin')"
        />
      </div>
      <div v-else class="space-y-1">
        <Label for="recipe-price" class="text-xs text-warm-500 dark:text-warm-400">{{
          t('recipes.price')
        }}</Label>
        <Input
          id="recipe-price"
          v-model.number="targetPrice"
          data-test="recipe-price"
          type="number"
          step="0.01"
          min="0"
          :placeholder="t('recipes.price')"
        />
      </div>
    </div>

    <Separator class="!my-4" />

    <!-- Add ingredient to recipe — auto-adds on select -->
    <Select
      v-model="selectedIngredientId"
      :disabled="availableIngredients.length === 0"
      @update:model-value="onIngredientSelected"
    >
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
        class="flex items-center gap-2 rounded-md border border-warm-100 bg-warm-50/50 px-3 py-2 dark:border-warm-700 dark:bg-warm-800/50"
        data-test="recipe-ingredient-row"
      >
        <span class="min-w-0 flex-1 truncate text-sm text-warm-700 dark:text-warm-200">
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
        <span class="w-12 text-center text-xs text-warm-400 dark:text-warm-500">{{
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
      class="rounded-md bg-warm-50 p-3 text-sm dark:bg-warm-800"
      data-test="recipe-cost-summary"
    >
      <div class="flex justify-between py-0.5">
        <span class="text-warm-500 dark:text-warm-400">{{ t('recipes.totalCost') }}</span>
        <span class="font-medium tabular-nums text-warm-700 dark:text-warm-200">{{
          formatCurrency(totalCost)
        }}</span>
      </div>
      <div class="flex justify-between py-0.5">
        <span class="text-warm-500 dark:text-warm-400">{{ t('recipes.costPerServing') }}</span>
        <span class="font-medium tabular-nums text-warm-700 dark:text-warm-200">{{
          formatCurrency(costPerServing)
        }}</span>
      </div>
      <div class="mt-1 space-y-0.5 border-t border-warm-200 pt-1.5 dark:border-warm-700">
        <div class="flex justify-between">
          <span
            class="text-warm-600 dark:text-warm-300"
            :class="
              pricingMode === 'margin' ? 'italic text-warm-400 dark:text-warm-500' : 'font-medium'
            "
          >
            {{ t('recipes.margin') }}
          </span>
          <span
            class="tabular-nums"
            :class="[
              pricingMode === 'margin'
                ? 'italic text-warm-400 dark:text-warm-500'
                : 'font-semibold text-amber-700 dark:text-amber-500',
              calculatedMargin < 0 ? 'text-red-600 dark:text-red-400' : '',
            ]"
          >
            {{ calculatedMargin.toFixed(1) }}%
          </span>
        </div>
        <div class="flex justify-between">
          <span
            class="text-warm-600 dark:text-warm-300"
            :class="
              pricingMode === 'price' ? 'italic text-warm-400 dark:text-warm-500' : 'font-medium'
            "
          >
            {{ t('recipes.price') }}
          </span>
          <span
            class="tabular-nums"
            :class="
              pricingMode === 'price'
                ? 'italic text-warm-400 dark:text-warm-500'
                : 'font-semibold text-amber-700 dark:text-amber-500'
            "
          >
            {{ formatCurrency(suggestedPrice) }}
          </span>
        </div>
      </div>
    </div>

    <Button type="submit" class="w-full" data-test="recipe-submit">
      {{ t('recipes.addRecipe') }}
    </Button>
  </form>
</template>
