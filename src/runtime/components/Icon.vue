<script lang="ts">
export interface IconProps {
  name: string
  mode?: 'svg' | 'css'
  size?: string | number
  customize?: (
    content: string,
    name?: string,
    prefix?: string,
    provider?: string
  ) => string
}
</script>

<script setup lang="ts">
import { useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'

const props = defineProps<IconProps>()

const iconProps = useForwardProps(reactivePick(props, 'name', 'mode', 'size', 'customize'))
</script>

<template>
  <Icon v-bind="iconProps" />
</template>
