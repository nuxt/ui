<script lang="ts">
import type { RuntimeOptions } from '@nuxt/icon'

export interface IconProps {
  name: string | any
  mode?: 'svg' | 'css'
  size?: string | number
  customize?: RuntimeOptions['customize'] | boolean | null
}
</script>

<script setup lang="ts">
import { useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'

const props = defineProps<IconProps>()

const iconProps = useForwardProps(reactivePick(props, 'mode', 'size', 'customize'))
</script>

<template>
  <Icon v-if="typeof name === 'string'" :name="name" v-bind="iconProps" />
  <component :is="name" v-else />
</template>
