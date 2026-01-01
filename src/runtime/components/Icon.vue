<script lang="ts">
export interface IconProps {
  name: string | any
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
  <Icon v-if="typeof name === 'string'" v-bind="iconProps" />
  <component :is="name" v-else />
</template>
