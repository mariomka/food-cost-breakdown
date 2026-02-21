<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Ingredient, UnitType } from '@/types'
import { useIngredients } from '@/composables/useIngredients'
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

const props = defineProps<{
  ingredient: Ingredient
}>()

const emit = defineEmits<{
  delete: [id: string]
  duplicate: [id: string]
}>()

const { t } = useI18n()
const { updateIngredient } = useIngredients()
const { formatCurrency } = useCurrencyFormat()

const editing = ref(false)
const editName = ref('')
const editPrice = ref<number>(0)
const editQuantity = ref<number>(0)
const editUnit = ref<UnitType>('kg')

const units: UnitType[] = ['kg', 'g', 'L', 'mL', 'lb', 'oz', 'fl oz', 'unit']

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

function handleDelete() {
  editing.value = false
  emit('delete', props.ingredient.id)
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
      data-test="ingredient-edit-form"
      class="space-y-3 rounded-lg border border-amber-200 bg-amber-50/20 p-4 dark:border-amber-800 dark:bg-amber-950/30"
      @submit.prevent="saveEdit"
    >
      <div class="mb-1 flex items-center gap-2">
        <span
          class="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-600 uppercase dark:bg-amber-900/40 dark:text-amber-400"
        >
          {{ t('ingredients.editing') }}
        </span>
      </div>

      <div class="space-y-1">
        <Label class="text-xs text-warm-500 dark:text-warm-400">{{ t('common.name') }}</Label>
        <Input v-model="editName" data-test="ingredient-edit-name" class="h-8 text-sm" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div class="space-y-1">
          <Label class="text-xs text-warm-500 dark:text-warm-400">{{ t('common.price') }}</Label>
          <Input v-model.number="editPrice" type="number" step="0.01" min="0" class="h-8 text-sm" />
        </div>
        <div class="space-y-1">
          <Label class="text-xs text-warm-500 dark:text-warm-400">{{ t('common.quantity') }}</Label>
          <Input
            v-model.number="editQuantity"
            type="number"
            step="0.01"
            min="0"
            class="h-8 text-sm"
          />
        </div>
        <div class="space-y-1">
          <Label class="text-xs text-warm-500 dark:text-warm-400">{{ t('common.unit') }}</Label>
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
      </div>
      <div class="flex gap-2">
        <Button type="submit" size="sm" class="h-8 flex-1 text-xs" data-test="ingredient-edit-save">
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
          data-test="ingredient-edit-delete"
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
              data-test="ingredient-item"
              class="group flex cursor-pointer items-center justify-between rounded-lg border border-warm-200/60 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-warm-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:border-warm-700/60 dark:bg-warm-800 dark:hover:border-warm-600"
              @click="handleClick"
            >
              <div
                class="drag-handle -ml-1 mr-2 cursor-grab touch-none text-warm-300 transition-colors group-hover:text-warm-500 active:cursor-grabbing dark:text-warm-600 dark:group-hover:text-warm-400"
                @click.stop
              >
                <GripVertical class="h-4 w-4" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-warm-800 dark:text-warm-100">
                  {{ ingredient.name }}
                </p>
                <p class="text-xs text-warm-400 dark:text-warm-500">
                  {{ ingredient.quantity }} {{ t(`units.${ingredient.unit}`) }}
                </p>
              </div>
              <div class="ml-4 flex items-center gap-2">
                <p class="text-sm font-semibold tabular-nums text-amber-700 dark:text-amber-500">
                  {{ formatCurrency(ingredient.price) }}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button
                      class="rounded p-1 text-warm-300 opacity-0 transition-all hover:bg-warm-100 hover:text-warm-600 group-hover:opacity-100 dark:text-warm-600 dark:hover:bg-warm-700 dark:hover:text-warm-300"
                      data-test="ingredient-menu-trigger"
                      @click.stop
                    >
                      <EllipsisVertical class="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem data-test="ingredient-menu-edit" @click.stop="startEdit">
                      <Pencil class="mr-2 h-4 w-4" />
                      {{ t('common.edit') }}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      data-test="ingredient-menu-duplicate"
                      @click.stop="emit('duplicate', ingredient.id)"
                    >
                      <Copy class="mr-2 h-4 w-4" />
                      {{ t('common.duplicate') }}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-destructive focus:text-destructive"
                      data-test="ingredient-menu-delete"
                      @click.stop="emit('delete', ingredient.id)"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      {{ t('common.delete') }}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ t('ingredients.editHint') }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </Transition>
</template>
