<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Recipe, RecipeIngredient } from '@/types'
import { useIngredients } from '@/composables/useIngredients'
import { useRecipes } from '@/composables/useRecipes'
import { useCostCalculations } from '@/composables/useCostCalculations'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const props = defineProps<{
  recipe: Recipe
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const { t } = useI18n()
const { ingredients, getIngredient } = useIngredients()
const { updateRecipe } = useRecipes()
const { getTotalCost, getCostPerServing, getSuggestedPrice } = useCostCalculations()

const totalCost = computed(() => getTotalCost(props.recipe.ingredients, (id) => getIngredient(id)))
const costPerServing = computed(() => getCostPerServing(totalCost.value, props.recipe.servings))
const suggestedPrice = computed(() =>
  getSuggestedPrice(costPerServing.value, props.recipe.targetMargin),
)

// Edit state
const editing = ref(false)
const editName = ref('')
const editServings = ref<number>(1)
const editMargin = ref<number>(0)
const editIngredients = ref<RecipeIngredient[]>([])
const selectedIngredientId = ref('')

const editTotalCost = computed(() => getTotalCost(editIngredients.value, (id) => getIngredient(id)))
const editCostPerServing = computed(() =>
  getCostPerServing(editTotalCost.value, editServings.value || 0),
)
const editSuggestedPrice = computed(() =>
  getSuggestedPrice(editCostPerServing.value, editMargin.value || 0),
)

const availableIngredients = computed(() => {
  const usedIds = new Set(editIngredients.value.map((ri) => ri.ingredientId))
  return ingredients.value.filter((i) => !usedIds.has(i.id))
})

// Watch for ingredient removals while editing
watch(
  () => ingredients.value.map((i) => i.id),
  (currentIds) => {
    if (!editing.value) return
    const idSet = new Set(currentIds)
    editIngredients.value = editIngredients.value.filter((ri) => idSet.has(ri.ingredientId))
  },
)

function startEdit() {
  editName.value = props.recipe.name
  editServings.value = props.recipe.servings
  editMargin.value = props.recipe.targetMargin
  editIngredients.value = props.recipe.ingredients.map((ri) => ({ ...ri }))
  editing.value = true
}

function saveEdit() {
  if (!editName.value.trim()) return
  updateRecipe(props.recipe.id, {
    name: editName.value.trim(),
    servings: editServings.value || 1,
    targetMargin: editMargin.value || 0,
    ingredients: editIngredients.value,
  })
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}

function addEditIngredient() {
  if (!selectedIngredientId.value) return
  const ingredient = getIngredient(selectedIngredientId.value)
  if (!ingredient) return
  editIngredients.value.push({
    ingredientId: selectedIngredientId.value,
    quantity: 0,
  })
  selectedIngredientId.value = ''
}

function removeEditIngredient(index: number) {
  editIngredients.value.splice(index, 1)
}

function handleDelete() {
  editing.value = false
  emit('delete', props.recipe.id)
}

function handleClick() {
  if (!editing.value) {
    startEdit()
  }
}
</script>

<template>
  <Transition name="edit" mode="out-in">
    <!-- Edit mode -->
    <form
      v-if="editing"
      key="edit"
      data-test="recipe-edit-form"
      class="space-y-3 rounded-lg border border-terracotta-200 bg-terracotta-50/20 p-4"
      @submit.prevent="saveEdit"
    >
      <div class="mb-1 flex items-center gap-2">
        <span
          class="rounded-full bg-terracotta-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-terracotta-600 uppercase"
        >
          {{ t('recipes.editing') }}
        </span>
      </div>

      <Input v-model="editName" data-test="recipe-edit-name" class="h-8 text-sm" />

      <div class="grid grid-cols-2 gap-2">
        <Input
          v-model.number="editServings"
          type="number"
          min="1"
          class="h-8 text-sm"
          :placeholder="t('recipes.servings')"
        />
        <Input
          v-model.number="editMargin"
          type="number"
          min="0"
          max="99"
          class="h-8 text-sm"
          :placeholder="t('recipes.targetMargin')"
        />
      </div>

      <Separator />

      <!-- Add ingredient -->
      <Select
        v-model="selectedIngredientId"
        :disabled="availableIngredients.length === 0"
        @update:model-value="addEditIngredient"
      >
        <SelectTrigger class="h-8 text-sm">
          <SelectValue :placeholder="t('recipes.selectIngredient')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="ing in availableIngredients" :key="ing.id" :value="ing.id">
            {{ ing.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <!-- Ingredient rows -->
      <div v-if="editIngredients.length > 0" class="space-y-1">
        <div
          v-for="(ri, index) in editIngredients"
          :key="ri.ingredientId"
          class="flex items-center gap-2 rounded border border-warm-200/60 bg-white px-2 py-1.5"
        >
          <span class="min-w-0 flex-1 truncate text-xs text-warm-700">
            {{ getIngredient(ri.ingredientId)?.name }}
          </span>
          <Input
            v-model.number="ri.quantity"
            type="number"
            step="0.01"
            min="0"
            class="h-7 w-20 text-xs"
            placeholder="Qty"
          />
          <span class="text-xs text-warm-400">{{
            t(`units.${getIngredient(ri.ingredientId)?.unit}`)
          }}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="h-6 w-6 p-0 text-warm-400 hover:text-destructive"
            @click="removeEditIngredient(index)"
          >
            &times;
          </Button>
        </div>
      </div>

      <!-- Live cost -->
      <div v-if="editIngredients.length > 0" class="rounded-md bg-warm-50 p-2 text-xs">
        <div class="flex justify-between py-0.5">
          <span class="text-warm-500">{{ t('recipes.totalCost') }}</span>
          <span class="font-medium tabular-nums text-warm-700"
            >${{ editTotalCost.toFixed(2) }}</span
          >
        </div>
        <div class="flex justify-between py-0.5">
          <span class="text-warm-500">{{ t('recipes.costPerServing') }}</span>
          <span class="font-medium tabular-nums text-warm-700"
            >${{ editCostPerServing.toFixed(2) }}</span
          >
        </div>
        <div class="mt-1 flex justify-between border-t border-warm-200 pt-1">
          <span class="font-medium text-warm-600">{{ t('recipes.suggestedPrice') }}</span>
          <span class="font-semibold tabular-nums text-amber-700"
            >${{ editSuggestedPrice.toFixed(2) }}</span
          >
        </div>
      </div>

      <div class="flex gap-2">
        <Button type="submit" size="sm" class="h-8 flex-1 text-xs" data-test="recipe-edit-save">
          {{ t('common.save') }}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          class="h-8 flex-1 text-xs"
          @click="cancelEdit"
        >
          {{ t('common.cancel') }}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          class="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
          data-test="recipe-edit-delete"
          @click="handleDelete"
        >
          {{ t('common.delete') }}
        </Button>
      </div>
    </form>

    <!-- Display mode -->
    <div v-else key="display">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <div
              data-test="recipe-item"
              class="group cursor-pointer rounded-lg border border-warm-200/60 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-warm-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              @click="handleClick"
            >
              <div class="mb-3 flex items-start justify-between">
                <h3 class="font-display text-lg text-warm-800">{{ recipe.name }}</h3>
                <span
                  class="rounded-full bg-warm-100 px-2 py-0.5 text-[11px] font-medium tabular-nums text-warm-500"
                >
                  {{ recipe.servings }} {{ t('recipes.servings').toLowerCase() }}
                </span>
              </div>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-warm-400">{{ t('recipes.totalCost') }}</span>
                  <span class="tabular-nums text-warm-600">${{ totalCost.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-warm-400">{{ t('recipes.costPerServing') }}</span>
                  <span class="tabular-nums text-warm-600">${{ costPerServing.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between border-t border-warm-100 pt-1.5">
                  <span class="font-medium text-warm-600">{{ t('recipes.suggestedPrice') }}</span>
                  <span class="font-semibold tabular-nums text-amber-700"
                    >${{ suggestedPrice.toFixed(2) }}</span
                  >
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ t('recipes.editHint') }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </Transition>
</template>

<style scoped>
.edit-enter-active,
.edit-leave-active {
  transition: opacity 0.15s ease;
}
.edit-enter-from,
.edit-leave-to {
  opacity: 0;
}
</style>
