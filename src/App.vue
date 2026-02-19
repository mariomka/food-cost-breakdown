<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-warm-50">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>
