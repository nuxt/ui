<script setup lang="ts">
import type { TabsProps } from '@nuxt/ui'

/**
 * System, light and dark as an icon-only segmented control, the picker the
 * theme menu and the studio's theme bar share. The menu drops the framing
 * ring, it sits on a menu row rather than beside other controls.
 */
withDefaults(defineProps<{
  size?: TabsProps['size']
}>(), {
  size: 'xs'
})
</script>

<template>
  <UColorModeTabs
    :size="size"
    :ui="{
      label: 'sr-only',
      list: 'bg-tint ring ring-default p-0.5',
      indicator: 'inset-y-0.5',
      trigger: 'w-full p-1.5'
    }"
    aria-label="Color mode"
  />
</template>
