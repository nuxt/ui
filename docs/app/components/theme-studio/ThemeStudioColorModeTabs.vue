<script setup lang="ts">
import type { TabsProps } from '@nuxt/ui'

/**
 * Light, dark and system as an icon-only segmented control, the picker the
 * theme menu and the studio's theme bar share. The menu drops the framing
 * ring, it sits on a menu row rather than beside other controls.
 */
withDefaults(defineProps<{
  size?: TabsProps['size']
}>(), {
  size: 'xs'
})

const appConfig = useAppConfig()
const colorMode = useColorMode()

// The preference is client-only, gate on mount so hydration doesn't adopt
// a selection the server never rendered.
const mounted = useMounted()

// labels for AT only, the ui below hides them so the control stays icon-wide
const items = computed(() => [
  { label: 'Light', value: 'light', icon: appConfig.ui.icons.light },
  { label: 'Dark', value: 'dark', icon: appConfig.ui.icons.dark },
  { label: 'System', value: 'system', icon: appConfig.ui.icons.system }
])

const mode = computed({
  get: () => (mounted.value ? colorMode.preference : 'system'),
  set: (value: string) => (colorMode.preference = value)
})
</script>

<template>
  <UTabs
    v-model="mode"
    :items="items"
    :content="false"
    color="neutral"
    :size="size"
    :ui="{
      label: 'sr-only',
      list: 'bg-elevated/50 ring ring-default p-0.5',
      indicator: 'bg-default inset-y-0.5',
      trigger: 'data-[state=active]:text-highlighted w-full in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-default p-1.5'
    }"
    aria-label="Color mode"
  />
</template>
