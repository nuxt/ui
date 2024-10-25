import { useDark } from '@vueuse/core'
import type { Plugin } from 'vue'

export default {
  install() {
    useDark()
  }
} satisfies Plugin
