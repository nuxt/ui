<script lang="ts">
import { tv } from 'tailwind-variants'
// import appConfig from '#build/app.config'
import theme from '#ui/theme/container'

const appContainer = tv(theme)
// const appContainer = tv({ extend: container, ...(appConfig.ui?.container || {}) })

export interface ContainerProps {
  as?: string
  class?: any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ContainerProps>(), {
  as: 'div',
  class: undefined
})

// Computed

const base = computed(() => appContainer({ class: props.class }))
</script>

<template>
  <component :is="as" :class="base" v-bind="$attrs">
    <slot />
  </component>
</template>