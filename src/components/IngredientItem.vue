<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Ingredient, UnitType } from '@/types'
import { useIngredients } from '@/composables/useIngredients'
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

const props = defineProps<{
  ingredient: Ingredient
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const { t } = useI18n()
const { updateIngredient } = useIngredients()

const editing = ref(false)
const editName = ref('')
const editPrice = ref<number>(0)
const editQuantity = ref<number>(0)
const editUnit = ref<UnitType>('kg')

const units: UnitType[] = ['kg', 'g', 'L', 'mL', 'unit']

function startEdit() {
  editName.value = props.ingredient.name
  editPrice.value = props.ingredient.price
  editQuantity.value = props.ingredient.quantity
  editUnit.value = props.ingredient.unit
  editing.value = true
}

function saveEdit() {
  if (!editName.value.trim() || !editPrice.value || !editQuantity.value) return
  updateIngredient(props.ingredient.id, {
    name: editName.value.trim(),
    price: editPrice.value,
    quantity: editQuantity.value,
    unit: editUnit.value,
  })
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}

function handleClick() {
  if (!editing.value) {
    startEdit()
  }
}

function handleDblClick() {
  editing.value = false
  emit('delete', props.ingredient.id)
}
</script>

<template>
  <!-- Edit mode -->
  <form
    v-if="editing"
    data-test="ingredient-edit-form"
    class="space-y-2 rounded-md border-2 border-amber-300 bg-amber-50/50 px-3 py-3"
    @submit.prevent="saveEdit"
  >
    <Input v-model="editName" data-test="ingredient-edit-name" class="h-8 text-sm" />
    <div class="grid grid-cols-3 gap-2">
      <Input v-model.number="editPrice" type="number" step="0.01" min="0" class="h-8 text-sm" />
      <Input v-model.number="editQuantity" type="number" step="0.01" min="0" class="h-8 text-sm" />
      <Select v-model="editUnit">
        <SelectTrigger class="h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="u in units" :key="u" :value="u">
            {{ t(`units.${u}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="flex gap-2">
      <Button type="submit" size="sm" class="h-7 flex-1 text-xs" data-test="ingredient-edit-save">
        {{ t('common.save') }}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        class="h-7 flex-1 text-xs"
        @click="cancelEdit"
      >
        {{ t('common.cancel') }}
      </Button>
    </div>
  </form>

  <!-- Display mode -->
  <TooltipProvider v-else>
    <Tooltip>
      <TooltipTrigger as-child>
        <div
          data-test="ingredient-item"
          class="flex cursor-pointer items-center justify-between rounded-md border border-warm-200 bg-white px-4 py-3 transition-colors hover:border-amber-200 hover:bg-amber-50/50"
          @click="handleClick"
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
        <p>{{ t('ingredients.editHint') }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
