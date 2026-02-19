<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UnitType, RecipeIngredient } from '@/types'
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

const recipeIngredients = ref<(RecipeIngredient & { tempUnit: UnitType })[]>([])
const selectedIngredientId = ref('')

const units: UnitType[] = ['kg', 'g', 'L', 'mL', 'unit']

function addRecipeIngredient() {
  if (!selectedIngredientId.value) return
  const ingredient = getIngredient(selectedIngredientId.value)
  if (!ingredient) return

  recipeIngredients.value.push({
    ingredientId: selectedIngredientId.value,
    quantity: 0,
    unit: ingredient.unit,
    tempUnit: ingredient.unit,
  })
  selectedIngredientId.value = ''
}

function removeRecipeIngredient(index: number) {
  recipeIngredients.value.splice(index, 1)
}

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
    recipeIngredients.value.map(({ ingredientId, quantity, unit }) => ({
      ingredientId,
      quantity,
      unit,
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
  <form data-test="recipe-form" class="space-y-3" @submit.prevent="handleSubmit">
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

    <Separator />

    <!-- Add ingredient to recipe -->
    <div class="flex gap-2">
      <Select v-model="selectedIngredientId" class="flex-1">
        <SelectTrigger data-test="recipe-ingredient-select">
          <SelectValue :placeholder="t('recipes.selectIngredient')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="ing in availableIngredients" :key="ing.id" :value="ing.id">
            {{ ing.name }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Button type="button" variant="outline" size="sm" @click="addRecipeIngredient">+</Button>
    </div>

    <!-- Recipe ingredients list -->
    <div v-if="recipeIngredients.length > 0" class="space-y-2" data-test="recipe-ingredients-list">
      <div
        v-for="(ri, index) in recipeIngredients"
        :key="ri.ingredientId"
        class="flex items-center gap-2 rounded-md border border-warm-100 bg-warm-50 px-3 py-2"
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
        <Select v-model="ri.unit" class="w-20">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="u in units" :key="u" :value="u">
              {{ t(`units.${u}`) }}
            </SelectItem>
          </SelectContent>
        </Select>
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
      class="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm"
      data-test="recipe-cost-summary"
    >
      <div class="flex justify-between">
        <span class="text-warm-600">{{ t('recipes.totalCost') }}</span>
        <span class="font-semibold text-warm-800">${{ totalCost.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-warm-600">{{ t('recipes.costPerServing') }}</span>
        <span class="font-semibold text-warm-800">${{ costPerServing.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-warm-600">{{ t('recipes.suggestedPrice') }}</span>
        <span class="font-bold text-amber-700">${{ suggestedPrice.toFixed(2) }}</span>
      </div>
    </div>

    <Button type="submit" class="w-full" data-test="recipe-submit">
      {{ t('recipes.addRecipe') }}
    </Button>
  </form>
</template>
