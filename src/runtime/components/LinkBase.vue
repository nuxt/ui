<script lang="ts">
export interface LinkBaseProps {
  as?: string
  type?: string
  disabled?: boolean
  onClick?: ((e: MouseEvent) => void | Promise<void>) | Array<((e: MouseEvent) => void | Promise<void>)>
  href?: string
  navigate?: (e: MouseEvent) => void
  rel?: string
  target?: string
  isExternal?: boolean
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

const props = withDefaults(defineProps<LinkBaseProps>(), {
  as: 'button',
  type: 'button'
})

function onClickWrapper(e: MouseEvent) {
  if (props.disabled) {
    e.stopPropagation()
    e.preventDefault()
    return
  }

  if (props.onClick) {
    for (const onClick of Array.isArray(props.onClick) ? props.onClick : [props.onClick]) {
      onClick(e)
    }
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
      'role': disabled ? 'link' : undefined,
      'tabindex': disabled ? -1 : undefined
    } : as === 'button' ? {
      as,
      type,
      disabled
    } : {
      as
    }"
    :rel="rel"
    :target="target"
    @click="onClickWrapper"
  >
    <slot />
  </Primitive>
</template>
