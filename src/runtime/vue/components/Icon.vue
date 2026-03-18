<script lang="ts">
import type { IconifyRenderMode } from '@iconify/vue'
import type { IconProps } from '../../types'

type CustomizeFn = Exclude<IconProps['customize'], boolean | null | undefined>
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import { useAppConfig } from '#imports'

const props = defineProps<IconProps>()

const appConfig = useAppConfig()

function resolveCustomizeFn(
  customize: IconProps['customize'],
  globalCustomize: CustomizeFn | undefined
): CustomizeFn | undefined {
  if (customize === false) return undefined
  if (customize === true || customize === null) return globalCustomize
  return customize
}

const mode = computed(() => {
  const mode = props.mode || appConfig.icon?.mode
  if (mode === 'css') return 'style'
  return mode as IconifyRenderMode
})

const size = computed(() => props.size || appConfig.icon?.size)

const customize = computed(() => resolveCustomizeFn(props.customize, appConfig.icon?.customize))
</script>

<template>
  <IconifyIcon
    v-if="typeof name === 'string'"
    :icon="name.replace(/^i-/, '')"
    :mode="mode"
    :width="size"
    :height="size"
    :customise="customize"
  />
  <component :is="name" v-else />
</template>
