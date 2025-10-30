<script setup lang="ts">
import type { IconProps } from '../../types'
import type { IconifyRenderMode } from '@iconify/vue'
import { computed } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import { useAppConfig } from '#imports'
import type { RuntimeOptions } from '@nuxt/icon'

const props = defineProps<IconProps>()

const appConfig = useAppConfig()

function resolveCustomizeFn(
  customize: RuntimeOptions['customize'] | boolean | null | undefined,
  globalCustomize: RuntimeOptions['customize'] | undefined
): RuntimeOptions['customize'] | undefined {
  if (customize === false) return undefined
  if (customize === true || customize === null) return globalCustomize
  return customize
}

const resolvedMode = computed(() => {
  const mode = props.mode || appConfig.icon?.mode
  if (mode === 'css') return 'style'
  return mode as IconifyRenderMode
})
</script>

<template>
  <IconifyIcon
    v-if="typeof name === 'string'"
    :icon="name.replace(/^i-/, '')"
    :mode="resolvedMode"
    :width="size || appConfig.icon?.size"
    :height="size || appConfig.icon?.size"
    :customise="resolveCustomizeFn(props.customize, appConfig.icon?.customize)"
  />
  <component :is="name" v-else />
</template>
