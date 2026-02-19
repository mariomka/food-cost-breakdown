<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const { t } = useI18n()
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <!-- Desktop: split-screen layout -->
    <div class="hidden gap-6 lg:grid lg:grid-cols-2">
      <section>
        <h2 class="font-display mb-4 text-2xl text-warm-800">{{ t('ingredients.title') }}</h2>
        <slot name="ingredients" />
      </section>
      <section>
        <h2 class="font-display mb-4 text-2xl text-warm-800">{{ t('recipes.title') }}</h2>
        <slot name="recipes" />
      </section>
    </div>

    <!-- Mobile: tabbed layout -->
    <div class="lg:hidden">
      <Tabs default-value="ingredients">
        <TabsList class="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="ingredients">{{ t('ingredients.title') }}</TabsTrigger>
          <TabsTrigger value="recipes">{{ t('recipes.title') }}</TabsTrigger>
        </TabsList>
        <TabsContent value="ingredients">
          <slot name="ingredients" />
        </TabsContent>
        <TabsContent value="recipes">
          <slot name="recipes" />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
