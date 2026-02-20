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
        <slot name="recipes" />
      </section>
      <section>
        <slot name="ingredients" />
      </section>
    </div>

    <!-- Mobile: tabbed layout -->
    <div class="lg:hidden">
      <Tabs default-value="recipes">
        <TabsList class="mb-6 grid w-full grid-cols-2 bg-warm-200/80 dark:bg-warm-700/80">
          <TabsTrigger
            value="recipes"
            class="data-[state=inactive]:text-warm-500 dark:data-[state=inactive]:text-warm-400"
            >{{ t('recipes.title') }}</TabsTrigger
          >
          <TabsTrigger
            value="ingredients"
            class="data-[state=inactive]:text-warm-500 dark:data-[state=inactive]:text-warm-400"
            >{{ t('ingredients.title') }}</TabsTrigger
          >
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
