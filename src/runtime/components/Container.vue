<script lang="ts">
import { tv } from 'tailwind-variants'
// import appConfig from '#build/app.config'
import theme from '#ui/theme/container'

const appContainer = tv(theme)
// const appContainer = tv({ extend: container, ...(appConfig.ui?.container || {}) })

export interface ContainerProps {
  as?: string
  class?: any
  ui?: Partial<typeof appContainer>
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ContainerProps>(), {
  as: 'div',
  class: undefined,
  ui: undefined
})

// Computed

const ui = computed(() => tv({ extend: appContainer, ...props.ui })({ class: props.class }))
</script>

<template>
  <component :is="as" :class="ui" v-bind="$attrs">
    <slot />
  </component>
</template>