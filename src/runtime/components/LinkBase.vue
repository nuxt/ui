<script lang="ts">
export interface LinkBaseProps {
  as?: string
  type?: string
  disabled?: boolean
  click?: (e: MouseEvent) => void
  href?: string
  navigate?: (e: MouseEvent) => void
  rel?: string
  target?: string
  isExternal?: boolean
}
</script>

<script setup lang="ts">
import { Primitive } from 'radix-vue'

const props = withDefaults(defineProps<LinkBaseProps>(), {
  as: 'button',
  type: 'button'
})

function onClick(e: MouseEvent) {
  if (props.disabled) {
    e.stopPropagation()
    e.preventDefault()
    return
  }

  if (props.click) {
    props.click(e)
  }

  if (props.href && props.navigate && !props.isExternal) {
    props.navigate(e)
  }
}
</script>

<template>
  <Primitive
    v-bind="href ? {
      'as': 'a',
      'href': disabled ? undefined : href,
      'aria-disabled': disabled ? 'true' : undefined,
      'role': disabled ? 'link' : undefined
    } : as === 'button' ? {
      as,
      type,
      disabled
    } : {
      as
    }"
    :rel="rel"
    :target="target"
    @click="onClick"
  >
    <slot />
  </Primitive>
</template>
