<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UnitType } from '@/types'
import { useIngredients } from '@/composables/useIngredients'
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

const emit = defineEmits<{ added: [] }>()

const { t } = useI18n()
const { addIngredient } = useIngredients()

const name = ref('')
const price = ref<number | undefined>()
const quantity = ref<number | undefined>()
const unit = ref<UnitType>('g')

const units: UnitType[] = ['kg', 'g', 'L', 'mL', 'unit']

function handleSubmit() {
  if (!name.value.trim() || !price.value || !quantity.value) return
  addIngredient(name.value.trim(), price.value, quantity.value, unit.value)
  name.value = ''
  price.value = undefined
  quantity.value = undefined
  unit.value = 'g'
  emit('added')
}
</script>

<template>
  <form
    data-test="ingredient-form"
    class="space-y-3 rounded-lg border border-warm-200/80 bg-white p-4 shadow-sm"
    @submit.prevent="handleSubmit"
  >
    <div class="space-y-1">
      <Label for="ingredient-name" class="text-xs text-warm-500">{{ t('common.name') }}</Label>
      <Input
        id="ingredient-name"
        v-model="name"
        data-test="ingredient-name"
        :placeholder="t('ingredients.namePlaceholder')"
      />
    </div>
    <div class="grid grid-cols-3 gap-2">
      <div class="space-y-1">
        <Label for="ingredient-price" class="text-xs text-warm-500">{{ t('common.price') }}</Label>
        <Input
          id="ingredient-price"
          v-model.number="price"
          data-test="ingredient-price"
          type="number"
          step="0.01"
          min="0"
          :placeholder="t('ingredients.pricePlaceholder')"
        />
      </div>
      <div class="space-y-1">
        <Label for="ingredient-quantity" class="text-xs text-warm-500">{{
          t('common.quantity')
        }}</Label>
        <Input
          id="ingredient-quantity"
          v-model.number="quantity"
          data-test="ingredient-quantity"
          type="number"
          step="0.01"
          min="0"
          :placeholder="t('ingredients.quantityPlaceholder')"
        />
      </div>
      <div class="space-y-1">
        <Label class="text-xs text-warm-500">{{ t('common.unit') }}</Label>
        <Select v-model="unit">
          <SelectTrigger data-test="ingredient-unit">
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
    <Button type="submit" class="w-full" data-test="ingredient-submit">
      {{ t('ingredients.addIngredient') }}
    </Button>
  </form>
</template>
