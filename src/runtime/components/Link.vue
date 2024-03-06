<script lang="ts">
import type { NuxtLinkProps } from '#app'

export interface LinkProps extends NuxtLinkProps {
  as?: string
  type?: string
  disabled?: boolean
  active?: boolean
  exact?: boolean
  exactQuery?: boolean
  exactHash?: boolean
  inactiveClass?: string
}
</script>

<script setup lang="ts">
import { isEqual } from 'ohash'
import { useForwardProps } from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import type { RouteLocation } from '#vue-router'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'button',
  type: 'button',
  inactiveClass: undefined
})

const forward = useForwardProps(reactiveOmit(props, 'as', 'type', 'disabled', 'active', 'exact', 'exactQuery', 'exactHash', 'inactiveClass'))

function resolveLinkClass (route: RouteLocation, currentRoute: RouteLocation, { isActive, isExactActive }: { isActive: boolean, isExactActive: boolean }) {
  if (props.exactQuery && !isEqual(route.query, currentRoute.query)) {
    return props.inactiveClass
  }
  if (props.exactHash && route.hash !== currentRoute.hash) {
    return props.inactiveClass
  }

  if (props.exact && isExactActive) {
    return props.activeClass
  }

  if (!props.exact && isActive) {
    return props.activeClass
  }

  return props.inactiveClass
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <component
    :is="as"
    v-if="!to"
    :type="type"
    :disabled="disabled"
    v-bind="$attrs"
    :class="active ? activeClass : inactiveClass"
  >
    <slot v-bind="{ isActive: active }" />
  </component>
  <NuxtLink v-else v-slot="{ route, href, target, rel, navigate, isActive, isExactActive, isExternal }" v-bind="forward" custom>
    <a
      v-bind="$attrs"
      :href="!disabled ? href : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :role="disabled ? 'link' : undefined"
      :rel="rel"
      :target="target"
      :class="active !== undefined ? (active ? activeClass : inactiveClass) : resolveLinkClass(route, $route, { isActive, isExactActive })"
      @click="(e) => (!isExternal && !disabled) && navigate(e)"
    >
      <slot v-bind="{ isActive: active !== undefined ? active : (exact ? isExactActive : isActive) }" />
    </a>
  </NuxtLink>
</template>