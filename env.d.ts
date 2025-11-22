/// <reference types="vite/client" />

declare module '@vue/runtime-core' {
  import type { Composer } from 'vue-i18n'

  export interface ComponentCustomProperties {
    $t: Composer['t']
  }
}
