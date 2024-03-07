<script lang="ts">
import { tv } from 'tailwind-variants'
// import appConfig from '#build/app.config'
import theme from '#build/ui/container'

const container = tv(theme)
// const appContainer = tv({ extend: container, ...(appConfig.ui?.container || {}) })

export interface ContainerProps {
  as?: string
  class?: any
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ContainerProps>(), {
  as: 'div',
  class: undefined
})
</script>

<template>
  <component :is="as" :class="container({ class: props.class })" v-bind="$attrs">
    <slot />
  </component>
</template>