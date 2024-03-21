<script setup lang="ts">
import { Primitive } from 'radix-vue'

const props = defineProps<{
  as: string
  type: string
  disabled?: boolean
  click?: (e: MouseEvent) => void
  href?: string
  navigate: (e: MouseEvent) => void
  route?: object
  rel?: string
  target?: string
  isExternal?: boolean
  isActive: boolean
  isExactActive: boolean
}>()

function onClick (e: MouseEvent) {
  if (props.disabled) {
    e.stopPropagation()
    e.preventDefault()
    return
  }

  if (props.click) {
    props.click(e)
  }

  if (props.href && !props.isExternal) {
    props.navigate(e)
  }
}
</script>

<template>
  <Primitive
    v-bind="href ? {
      as: 'a',
      href: disabled ? undefined : href,
      'aria-disabled': disabled ? 'true' : undefined,
      role: disabled ? 'link' : undefined
    } : {
      as,
      type,
      disabled
    }"
    :rel="rel"
    :target="target"
    @click="onClick"
  >
    <slot />
  </Primitive>
</template>
