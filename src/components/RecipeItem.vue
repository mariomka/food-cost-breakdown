<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Recipe, RecipeIngredient } from '@/types'
import { useIngredients } from '@/composables/useIngredients'
import { useRecipes } from '@/composables/useRecipes'
import { useCostCalculations } from '@/composables/useCostCalculations'
import { useCurrencyFormat } from '@/composables/useCurrencyFormat'
import { GripVertical, EllipsisVertical, Pencil, Copy, Trash2 } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const props = defineProps<{
  recipe: Recipe
}>()

const emit = defineEmits<{
  delete: [id: string]
  duplicate: [id: string]
}>()

const { t } = useI18n()
const { ingredients, getIngredient } = useIngredients()
const { updateRecipe } = useRecipes()
const { getTotalCost, getCostPerServing, getSuggestedPrice, getMarginFromPrice } =
  useCostCalculations()
const { formatCurrency } = useCurrencyFormat()

const isPriceMode = computed(() => (props.recipe.targetPrice ?? 0) > 0)

const totalCost = computed(() => getTotalCost(props.recipe.ingredients, (id) => getIngredient(id)))
const costPerServing = computed(() => getCostPerServing(totalCost.value, props.recipe.servings))

const displayPrice = computed(() => {
  if (isPriceMode.value) return props.recipe.targetPrice!
  return getSuggestedPrice(costPerServing.value, props.recipe.targetMargin)
})

const displayMargin = computed(() => {
  if (isPriceMode.value) return getMarginFromPrice(costPerServing.value, props.recipe.targetPrice!)
  return props.recipe.targetMargin
})

// Edit state
const editing = ref(false)
const editName = ref('')
const editServings = ref<number>(1)
const editMargin = ref<number>(0)
const editTargetPrice = ref<number | undefined>()
const editPricingMode = ref<'margin' | 'price'>('margin')
const editIngredients = ref<RecipeIngredient[]>([])
const selectedIngredientId = ref('')

const editTotalCost = computed(() => getTotalCost(editIngredients.value, (id) => getIngredient(id)))
const editCostPerServing = computed(() =>
  getCostPerServing(editTotalCost.value, editServings.value || 0),
)

const editSuggestedPrice = computed(() => {
  if (editPricingMode.value === 'price') return editTargetPrice.value || 0
  return getSuggestedPrice(editCostPerServing.value, editMargin.value || 0)
})

const editCalculatedMargin = computed(() => {
  if (editPricingMode.value === 'margin') return editMargin.value || 0
  return getMarginFromPrice(editCostPerServing.value, editTargetPrice.value || 0)
})

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
  if (isPriceMode.value) {
    editPricingMode.value = 'price'
    editTargetPrice.value = props.recipe.targetPrice
  } else {
    editPricingMode.value = 'margin'
    editTargetPrice.value = undefined
  }
  editing.value = true
}

function saveEdit() {
  if (!editName.value.trim()) return

  const saveMargin =
    editPricingMode.value === 'margin' ? editMargin.value || 0 : editCalculatedMargin.value
  const savePrice = editPricingMode.value === 'price' ? editTargetPrice.value || 0 : 0

  updateRecipe(props.recipe.id, {
    name: editName.value.trim(),
    servings: editServings.value || 1,
    targetMargin: saveMargin,
    targetPrice: savePrice,
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
      class="space-y-3 rounded-lg border border-amber-200 bg-amber-50/20 p-4 dark:border-amber-800 dark:bg-amber-950/30"
      @submit.prevent="saveEdit"
    >
      <div class="mb-1 flex items-center gap-2">
        <span
          class="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-600 uppercase dark:bg-amber-900/40 dark:text-amber-400"
        >
          {{ t('recipes.editing') }}
        </span>
      </div>

      <div class="space-y-1">
        <Label class="text-xs text-warm-500 dark:text-warm-400">{{ t('common.name') }}</Label>
        <Input v-model="editName" data-test="recipe-edit-name" class="h-8 text-sm" />
      </div>

      <div class="space-y-1">
        <Label class="text-xs text-warm-500 dark:text-warm-400">{{ t('recipes.servings') }}</Label>
        <Input
          v-model.number="editServings"
          type="number"
          min="1"
          class="h-8 text-sm"
          :placeholder="t('recipes.servings')"
        />
      </div>

      <div class="space-y-2">
        <Tabs v-model="editPricingMode" class="w-full">
          <TabsList class="w-full">
            <TabsTrigger value="margin" class="flex-1" data-test="edit-pricing-mode-margin">
              {{ t('recipes.margin') }}
            </TabsTrigger>
            <TabsTrigger value="price" class="flex-1" data-test="edit-pricing-mode-price">
              {{ t('recipes.price') }}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div v-if="editPricingMode === 'margin'" class="space-y-1">
          <Label class="text-xs text-warm-500 dark:text-warm-400">{{
            t('recipes.targetMargin')
          }}</Label>
          <Input
            v-model.number="editMargin"
            type="number"
            min="0"
            max="99"
            class="h-8 text-sm"
            :placeholder="t('recipes.targetMargin')"
          />
        </div>
        <div v-else class="space-y-1">
          <Label class="text-xs text-warm-500 dark:text-warm-400">{{
            t('recipes.targetPrice')
          }}</Label>
          <Input
            v-model.number="editTargetPrice"
            type="number"
            step="0.01"
            min="0"
            class="h-8 text-sm"
            :placeholder="t('recipes.targetPrice')"
          />
        </div>
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
          class="flex items-center gap-2 rounded border border-warm-200/60 bg-white px-2 py-1.5 dark:border-warm-700/60 dark:bg-warm-800"
        >
          <span class="min-w-0 flex-1 truncate text-xs text-warm-700 dark:text-warm-200">
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
          <span class="text-xs text-warm-400 dark:text-warm-500">{{
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
      <div
        v-if="editIngredients.length > 0"
        class="rounded-md bg-warm-50 p-2 text-xs dark:bg-warm-800"
      >
        <div class="flex justify-between py-0.5">
          <span class="text-warm-500 dark:text-warm-400">{{ t('recipes.totalCost') }}</span>
          <span class="font-medium tabular-nums text-warm-700 dark:text-warm-200">{{
            formatCurrency(editTotalCost)
          }}</span>
        </div>
        <div class="flex justify-between py-0.5">
          <span class="text-warm-500 dark:text-warm-400">{{ t('recipes.costPerServing') }}</span>
          <span class="font-medium tabular-nums text-warm-700 dark:text-warm-200">{{
            formatCurrency(editCostPerServing)
          }}</span>
        </div>
        <div class="mt-1 space-y-0.5 border-t border-warm-200 pt-1 dark:border-warm-700">
          <div class="flex justify-between">
            <span
              class="text-warm-600 dark:text-warm-300"
              :class="
                editPricingMode === 'margin'
                  ? 'font-medium'
                  : 'italic text-warm-400 dark:text-warm-500'
              "
            >
              {{ t('recipes.targetMargin') }}
            </span>
            <span
              class="tabular-nums"
              :class="[
                editPricingMode === 'margin'
                  ? 'font-semibold text-amber-700 dark:text-amber-500'
                  : 'italic text-warm-400 dark:text-warm-500',
                editCalculatedMargin < 0 ? 'text-red-600 dark:text-red-400' : '',
              ]"
            >
              {{ editCalculatedMargin.toFixed(1) }}%
            </span>
          </div>
          <div class="flex justify-between">
            <span
              class="text-warm-600 dark:text-warm-300"
              :class="
                editPricingMode === 'price'
                  ? 'font-medium'
                  : 'italic text-warm-400 dark:text-warm-500'
              "
            >
              {{ t('recipes.suggestedPrice') }}
            </span>
            <span
              class="tabular-nums"
              :class="
                editPricingMode === 'price'
                  ? 'font-semibold text-amber-700 dark:text-amber-500'
                  : 'italic text-warm-400 dark:text-warm-500'
              "
            >
              {{ formatCurrency(editSuggestedPrice) }}
            </span>
          </div>
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
              class="group cursor-pointer rounded-lg border border-warm-200/60 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-warm-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:border-warm-700/60 dark:bg-warm-800 dark:hover:border-warm-600"
              @click="handleClick"
            >
              <div class="mb-3 flex items-start justify-between">
                <div class="flex items-center gap-2">
                  <div
                    class="drag-handle -ml-1 cursor-grab touch-none text-warm-300 transition-colors group-hover:text-warm-500 active:cursor-grabbing dark:text-warm-600 dark:group-hover:text-warm-400"
                    @click.stop
                  >
                    <GripVertical class="h-4 w-4" />
                  </div>
                  <h3 class="font-display text-lg text-warm-800 dark:text-warm-100">
                    {{ recipe.name }}
                  </h3>
                </div>
                <div class="flex items-center gap-1">
                  <span
                    class="rounded-full bg-warm-100 px-2 py-0.5 text-[11px] font-medium tabular-nums text-warm-500 dark:bg-warm-800 dark:text-warm-400"
                  >
                    {{ t('recipes.servingCount', { count: recipe.servings }, recipe.servings) }}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <button
                        class="rounded p-1 text-warm-300 opacity-0 transition-all hover:bg-warm-100 hover:text-warm-600 group-hover:opacity-100 dark:text-warm-600 dark:hover:bg-warm-700 dark:hover:text-warm-300"
                        data-test="recipe-menu-trigger"
                        @click.stop
                      >
                        <EllipsisVertical class="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-test="recipe-menu-edit" @click.stop="startEdit">
                        <Pencil class="mr-2 h-4 w-4" />
                        {{ t('common.edit') }}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        data-test="recipe-menu-duplicate"
                        @click.stop="emit('duplicate', recipe.id)"
                      >
                        <Copy class="mr-2 h-4 w-4" />
                        {{ t('common.duplicate') }}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        class="text-destructive focus:text-destructive"
                        data-test="recipe-menu-delete"
                        @click.stop="emit('delete', recipe.id)"
                      >
                        <Trash2 class="mr-2 h-4 w-4" />
                        {{ t('common.delete') }}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-warm-400 dark:text-warm-500">{{ t('recipes.totalCost') }}</span>
                  <span class="tabular-nums text-warm-600 dark:text-warm-300">{{
                    formatCurrency(totalCost)
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-warm-400 dark:text-warm-500">{{
                    t('recipes.costPerServing')
                  }}</span>
                  <span class="tabular-nums text-warm-600 dark:text-warm-300">{{
                    formatCurrency(costPerServing)
                  }}</span>
                </div>
                <div class="space-y-0.5 border-t border-warm-100 pt-1.5 dark:border-warm-700">
                  <div class="flex justify-between">
                    <span
                      :class="
                        isPriceMode
                          ? 'italic text-warm-400 dark:text-warm-500'
                          : 'font-medium text-warm-600 dark:text-warm-300'
                      "
                    >
                      {{ t('recipes.targetMargin') }}
                    </span>
                    <span
                      class="tabular-nums"
                      :class="[
                        isPriceMode
                          ? 'italic text-warm-400 dark:text-warm-500'
                          : 'font-semibold text-amber-700 dark:text-amber-500',
                        displayMargin < 0 ? 'text-red-600 dark:text-red-400' : '',
                      ]"
                    >
                      {{ displayMargin.toFixed(1) }}%
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span
                      :class="
                        isPriceMode
                          ? 'font-medium text-warm-600 dark:text-warm-300'
                          : 'italic text-warm-400 dark:text-warm-500'
                      "
                    >
                      {{ t('recipes.suggestedPrice') }}
                    </span>
                    <span
                      class="tabular-nums"
                      :class="
                        isPriceMode
                          ? 'font-semibold text-amber-700 dark:text-amber-500'
                          : 'italic text-warm-400 dark:text-warm-500'
                      "
                    >
                      {{ formatCurrency(displayPrice) }}
                    </span>
                  </div>
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
