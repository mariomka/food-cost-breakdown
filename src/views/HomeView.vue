<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useIngredients } from '@/composables/useIngredients'
import { useLocale } from '@/composables/useLocale'
import type { Ingredient, Unit } from '@/types/ingredient'

const { t } = useI18n()
const { formatCurrency } = useLocale()

const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useIngredients()

const editingId = ref<string | null>(null)
const editForm = ref<Omit<Ingredient, 'id' | 'createdAt'>>({
  name: '',
  unit: 'kg',
  pricePerUnit: 0,
  notes: '',
})
const deleteConfirmId = ref<string | null>(null)
const nameInputRef = ref<InstanceType<typeof Input>[]>([])

const metricUnits: Unit[] = ['kg', 'g', 'L', 'ml']
const imperialUnits: Unit[] = ['lb', 'oz', 'gal', 'fl oz']
const generalUnits: Unit[] = ['unit', 'piece']

function startAdd() {
  const newIngredient = addIngredient({
    name: t('ingredients.new'),
    unit: 'kg',
    pricePerUnit: 1,
    notes: '',
  })
  startEdit(newIngredient)
  nextTick(() => {
    const input = nameInputRef.value[0]
    input?.focus()
    input?.select()
  })
}

function startEdit(ingredient: Ingredient) {
  editingId.value = ingredient.id
  editForm.value = {
    name: ingredient.name,
    unit: ingredient.unit,
    pricePerUnit: ingredient.pricePerUnit,
    notes: ingredient.notes || '',
  }
}

function autoSave() {
  if (editingId.value && editForm.value.name.trim() && editForm.value.pricePerUnit >= 0) {
    updateIngredient(editingId.value, {
      name: editForm.value.name.trim(),
      unit: editForm.value.unit,
      pricePerUnit: editForm.value.pricePerUnit,
      notes: editForm.value.notes?.trim() || undefined,
    })
  }
}

function cancelEdit() {
  editingId.value = null
  editForm.value = {
    name: '',
    unit: 'kg',
    pricePerUnit: 0,
    notes: '',
  }
}

function handleDelete(ingredient: Ingredient) {
  if (deleteConfirmId.value === ingredient.id) {
    // Second click - actually delete
    deleteIngredient(ingredient.id)
    if (editingId.value === ingredient.id) {
      cancelEdit()
    }
    deleteConfirmId.value = null
  } else {
    // First click - ask for confirmation
    deleteConfirmId.value = ingredient.id
    // Reset confirmation after 3 seconds
    setTimeout(() => {
      if (deleteConfirmId.value === ingredient.id) {
        deleteConfirmId.value = null
      }
    }, 3000)
  }
}

function formatPrice(price: number) {
  return formatCurrency(price)
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">{{ t('ingredients.title') }}</h1>
        <p class="text-muted-foreground mt-1">{{ t('app.description') }}</p>
      </div>
      <Button @click="startAdd">
        <Plus class="h-4 w-4" />
        {{ t('ingredients.add') }}
      </Button>
    </div>

    <div v-if="ingredients.length === 0" class="text-center py-12">
      <p class="text-muted-foreground mb-4">{{ t('ingredients.empty') }}</p>
    </div>

    <div class="space-y-2">
      <!-- Ingredients List -->
      <div
        v-for="ingredient in ingredients"
        :key="ingredient.id"
        class="border rounded-lg overflow-hidden transition-all hover:shadow-md group"
      >
        <!-- Ingredient Header -->
        <button
          @click="editingId === ingredient.id ? cancelEdit() : startEdit(ingredient)"
          class="w-full px-4 py-3 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-accent/5 transition-colors"
        >
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold">{{ ingredient.name }}</h3>
            <div class="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <span
                >{{ formatPrice(ingredient.pricePerUnit) }} /
                {{ t(`units.${ingredient.unit}`) }}</span
              >
              <span v-if="ingredient.notes" class="truncate">• {{ ingredient.notes }}</span>
            </div>
          </div>
          <span
            class="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {{
              editingId === ingredient.id
                ? t('ingredients.clickToClose')
                : t('ingredients.clickToEdit')
            }}
          </span>
        </button>

        <!-- Edit Form -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-[600px] opacity-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="max-h-[600px] opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-if="editingId === ingredient.id" class="overflow-hidden">
            <Separator />

            <div class="px-4 py-4 space-y-4">
              <div class="grid gap-4">
                <div class="grid gap-2">
                  <Label for="edit-name">{{ t('ingredients.name') }}</Label>
                  <Input
                    ref="nameInputRef"
                    id="edit-name"
                    v-model="editForm.name"
                    :placeholder="t('ingredients.name')"
                    @input="autoSave"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="grid gap-2">
                    <Label for="edit-unit">{{ t('ingredients.unit') }}</Label>
                    <Select v-model="editForm.unit" @update:model-value="autoSave">
                      <SelectTrigger id="edit-unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{{ t('units.metric') }}</SelectLabel>
                          <SelectItem v-for="unit in metricUnits" :key="unit" :value="unit">
                            {{ t(`units.${unit}`) }}
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>{{ t('units.imperial') }}</SelectLabel>
                          <SelectItem v-for="unit in imperialUnits" :key="unit" :value="unit">
                            {{ t(`units.${unit}`) }}
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>{{ t('units.general') }}</SelectLabel>
                          <SelectItem v-for="unit in generalUnits" :key="unit" :value="unit">
                            {{ t(`units.${unit}`) }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="grid gap-2">
                    <Label for="edit-price">{{ t('ingredients.pricePerUnit') }}</Label>
                    <Input
                      id="edit-price"
                      v-model="editForm.pricePerUnit"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0.00"
                      @input="autoSave"
                    />
                  </div>
                </div>

                <div class="grid gap-2">
                  <Label for="edit-notes">{{ t('ingredients.notes') }}</Label>
                  <Textarea
                    id="edit-notes"
                    v-model="editForm.notes"
                    :placeholder="t('ingredients.notes')"
                    rows="3"
                    @input="autoSave"
                  />
                </div>
              </div>

              <div class="flex justify-start">
                <Button variant="destructive" size="sm" @click="handleDelete(ingredient)">
                  <Trash2 v-if="deleteConfirmId !== ingredient.id" class="h-3 w-3" />
                  {{
                    deleteConfirmId === ingredient.id
                      ? t('ingredients.confirmDelete')
                      : t('ingredients.delete')
                  }}
                </Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
