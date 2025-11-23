<script setup lang="ts">
import Logo from './Logo.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto max-w-6xl px-6 py-6">
        <div class="flex items-center gap-4">
          <Logo class="w-12 h-12" />
          <h1 class="text-3xl font-bold tracking-tight logo-font">{{ t('app.title') }}</h1>
        </div>
      </div>
    </header>

    <main class="container mx-auto max-w-6xl px-6 py-12">
      <slot />
    </main>
  </div>
</template>
