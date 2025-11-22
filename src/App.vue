<script setup lang="ts">
import AppLayout from './components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="space-y-8">
      <div class="space-y-2">
        <p class="text-lg text-muted-foreground max-w-2xl">
          {{ $t('app.description') }}
        </p>
      </div>
    </div>
  </AppLayout>
</template>
