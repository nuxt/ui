<script lang="ts">
export interface IconProps {
  name: string
}
</script>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<IconProps>()
</script>

<template>
  <Icon :icon="name.replace(/^i-/, '')" />
</template>
