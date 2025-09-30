<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/code-icon'
import type { IconProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ProseCodeIcon = ComponentConfig<typeof theme, AppConfig, 'codeIcon', 'ui.prose'>

export interface ProseCodeIconProps {
  icon?: IconProps['name']
  filename?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
import UIcon from '../Icon.vue'

const props = defineProps<ProseCodeIconProps>()

const appConfig = useAppConfig() as ProseCodeIcon['AppConfig']

const icons = computed<any>(() => defu(appConfig.ui?.prose?.codeIcon || {}, theme))

const icon = computed(() => {
  if (props.icon) {
    return props.icon
  }

  if (!props.filename) {
    return
  }

  const cleanFilename = props.filename.replace(/\s*\(.*\)\s*$/, '')

  const extension = cleanFilename.includes('.') && cleanFilename.split('.').pop()
  const name = cleanFilename.split('/').pop()

  return (name && icons.value[name.toLowerCase()]) ?? (extension && (icons.value[extension] ?? `i-vscode-icons-file-type-${extension}`))
})
</script>

<template>
  <UIcon v-if="icon" :name="icon" />
</template>
