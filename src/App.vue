<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { Toaster } from '@/components/ui/sonner'
import { RouterView } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

useTheme()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-warm-50 dark:bg-warm-900">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <Toaster position="top-center" />
  </div>
</template>
