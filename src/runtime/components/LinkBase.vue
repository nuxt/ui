<script lang="ts">
import type { LinkProps } from './Link.vue'

export interface LinkBaseProps {
  as?: string
  type?: string
  disabled?: boolean
  onClick?: ((e: MouseEvent) => void) | Array<((e: MouseEvent) => void)>
  href?: string | null
  navigate?: (e: MouseEvent) => void
  target?: LinkProps['target']
  rel?: LinkProps['rel']
  active?: boolean
  isExternal?: boolean
  /** Prefetches the target route. Provided by the `NuxtLink` custom slot through `ULink`. */
  prefetch?: () => Promise<void>
  /** Whether the target route has been prefetched. Provided by the `NuxtLink` custom slot through `ULink`. */
  prefetched?: boolean
  /** Whether prefetching should run for a trigger. Provided by the `NuxtLink` custom slot through `ULink`. */
  shouldPrefetch?: (mode: 'visibility' | 'interaction') => boolean
}
</script>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import { Primitive } from 'reka-ui'
import { requestIdleCallback, cancelIdleCallback, observeIntersection } from '../utils/prefetch'

const props = withDefaults(defineProps<LinkBaseProps>(), {
  as: 'button',
  type: 'button'
})

const linkRef = useTemplateRef('linkRef')

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

// Called without arguments on purpose: NuxtLink's `prefetch` takes an optional
// `nuxtApp` and would otherwise receive the event.
function onPrefetch() {
  props.prefetch?.()
}

// Since Nuxt 4.5, NuxtLink no longer wires prefetching for `custom` links and
// exposes `prefetch` / `shouldPrefetch` to the slot instead, so both triggers
// are attached here on the rendered element.
const prefetchListeners = computed(() => {
  if (!props.shouldPrefetch?.('interaction')) {
    return {}
  }

  return { onPointerenter: onPrefetch, onFocus: onPrefetch }
})

let idleId: ReturnType<typeof requestIdleCallback>
let unobserve: (() => void) | null = null

onMounted(() => {
  if (!props.shouldPrefetch?.('visibility')) {
    return
  }

  // `$el` is on the component instance but not part of reka-ui's exposed type.
  const el = (linkRef.value as unknown as { $el?: HTMLElement } | null)?.$el
  if (!el?.tagName) {
    return
  }

  idleId = requestIdleCallback(() => {
    unobserve = observeIntersection(el, () => {
      unobserve?.()
      unobserve = null
      onPrefetch()
    })
  })
})

onBeforeUnmount(() => {
  cancelIdleCallback(idleId)
  unobserve?.()
  unobserve = null
})
</script>

<template>
  <Primitive
    ref="linkRef"
    v-bind="{
      ...(href ? {
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
      }),
      ...prefetchListeners
    }"
    :rel="rel"
    :target="target"
    @click="onClickWrapper"
  >
    <slot />
  </Primitive>
</template>
