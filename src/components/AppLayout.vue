<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const { t } = useI18n()
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
    <!-- Desktop: split-screen layout -->
    <div class="hidden gap-10 lg:grid lg:grid-cols-2">
      <section>
        <div class="mb-6 flex items-center gap-3">
          <h2 class="font-display text-2xl text-warm-800">{{ t('recipes.title') }}</h2>
          <div class="h-px flex-1 bg-warm-200" />
        </div>
        <slot name="recipes" />
      </section>
      <section>
        <div class="mb-6 flex items-center gap-3">
          <h2 class="font-display text-2xl text-warm-800">{{ t('ingredients.title') }}</h2>
          <div class="h-px flex-1 bg-warm-200" />
        </div>
        <slot name="ingredients" />
      </section>
    </div>

    <!-- Mobile: tabbed layout -->
    <div class="lg:hidden">
      <Tabs default-value="recipes">
        <TabsList class="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="recipes">{{ t('recipes.title') }}</TabsTrigger>
          <TabsTrigger value="ingredients">{{ t('ingredients.title') }}</TabsTrigger>
        </TabsList>
        <TabsContent value="recipes">
          <slot name="recipes" />
        </TabsContent>
        <TabsContent value="ingredients">
          <slot name="ingredients" />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
