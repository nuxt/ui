<script lang="ts">
import type { IconifyRenderMode } from '@iconify/vue'
import type { IconProps } from '../../components/Icon.vue'

type CustomizeFn = Exclude<IconProps['customize'], boolean | null | undefined>
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon as IconifyIcon, iconLoaded } from '@iconify/vue'
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

const iconName = computed(() => typeof props.name === 'string' ? props.name.replace(/^i-/, '') : '')
</script>

<template>
  <IconifyIcon
    v-if="typeof name === 'string'"
    :icon="iconName"
    :mode="mode"
    :width="size"
    :height="size"
    :customise="customize"
    :ssr="iconLoaded(iconName)"
  />
  <component :is="name" v-else />
</template>
