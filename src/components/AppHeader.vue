<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useExportImport } from '@/composables/useExportImport'
import { useTheme } from '@/composables/useTheme'
import AppLogo from '@/components/AppLogo.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const { t, locale } = useI18n()
const router = useRouter()
const { exportData, importData } = useExportImport()
const { themeMode } = useTheme()
const fileInput = ref<HTMLInputElement>()

watch(locale, (val) => {
  localStorage.setItem('locale', val)
})

function triggerImport() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    await importData(file)
    toast.success(t('import.success'))
  } catch (error) {
    toast.error(t('import.error'), {
      description: error instanceof Error ? error.message : undefined,
    })
  }
  input.value = ''
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-warm-200/80 bg-white/95 backdrop-blur-sm dark:border-warm-700/80 dark:bg-warm-900/95"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-3 no-underline">
        <AppLogo />
        <div>
          <h1
            class="font-display text-lg leading-tight font-normal text-warm-900 dark:text-warm-50 sm:text-xl"
          >
            {{ t('app.title') }}
          </h1>
          <p
            class="text-[11px] font-medium tracking-widest text-warm-400 uppercase dark:text-warm-500"
          >
            {{ t('app.subtitle') }}
          </p>
        </div>
      </RouterLink>

      <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileChange" />

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm" class="h-9 w-9 p-0" data-test="menu-trigger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              class="h-5 w-5 text-warm-500 dark:text-warm-400"
            >
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuItem @click="router.push('/info')">
            {{ t('info.title') }}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="exportData">
            {{ t('common.export') }}
          </DropdownMenuItem>
          <DropdownMenuItem @click="triggerImport">
            {{ t('common.import') }}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel class="text-xs font-normal text-warm-400 dark:text-warm-500">
            {{ t('theme.label') }}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup v-model="themeMode">
            <DropdownMenuRadioItem value="system">{{ t('theme.system') }}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="light">{{ t('theme.light') }}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">{{ t('theme.dark') }}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel class="text-xs font-normal text-warm-400 dark:text-warm-500">
            {{ t('language.label') }}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup v-model="locale">
            <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
