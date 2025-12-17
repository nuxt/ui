<script lang="ts">
import type { IconProps as NuxtIconProps } from '../../types'

export interface IconProps {
  name: NuxtIconProps['name']
}
</script>

<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue'

defineProps<IconProps>()
</script>

<template>
  <IconifyIcon v-if="typeof name === 'string'" :icon="name.replace(/^i-/, '')" />
  <component :is="name" v-else />
</template>
