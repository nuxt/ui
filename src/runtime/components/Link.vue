<script lang="ts">
import type { PropType } from 'vue'
import type { NuxtLinkProps } from '#app'
import type { RouteLocationRaw } from '#vue-router'

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

export const linkProps = {
  // Routing
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: undefined,
    required: false
  },
  href: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: undefined,
    required: false
  },

  // Attributes
  target: {
    type: String as PropType<NuxtLinkProps['target']>,
    default: undefined,
    required: false
  },
  rel: {
    type: String as PropType<NuxtLinkProps['rel']>,
    default: undefined,
    required: false
  },
  noRel: {
    type: Boolean as PropType<NuxtLinkProps['noRel']>,
    default: undefined,
    required: false
  },

  // Prefetching
  prefetch: {
    type: Boolean as PropType<NuxtLinkProps['prefetch']>,
    default: undefined,
    required: false
  },
  noPrefetch: {
    type: Boolean as PropType<NuxtLinkProps['noPrefetch']>,
    default: undefined,
    required: false
  },

  // Styling
  activeClass: {
    type: String as PropType<NuxtLinkProps['activeClass']>,
    default: undefined,
    required: false
  },
  exactActiveClass: {
    type: String as PropType<NuxtLinkProps['exactActiveClass']>,
    default: undefined,
    required: false
  },
  prefetchedClass: {
    type: String as PropType<NuxtLinkProps['prefetchedClass']>,
    default: undefined,
    required: false
  },

  // Vue Router's `<RouterLink>` additional props
  replace: {
    type: Boolean as PropType<NuxtLinkProps['replace']>,
    default: undefined,
    required: false
  },
  ariaCurrentValue: {
    type: String as PropType<NuxtLinkProps['ariaCurrentValue']>,
    default: undefined,
    required: false
  },

  // Edge cases handling
  external: {
    type: Boolean as PropType<NuxtLinkProps['external']>,
    default: undefined,
    required: false
  },

  // Specific props
  as: {
    type: String as PropType<LinkProps['as']>,
    default: 'button'
  },
  type: {
    type: String as PropType<LinkProps['type']>,
    default: 'button'
  },
  disabled: {
    type: Boolean as PropType<LinkProps['disabled']>,
    default: false
  },
  active: {
    type: Boolean as PropType<LinkProps['active']>,
    default: undefined
  },
  exact: {
    type: Boolean as PropType<LinkProps['exact']>,
    default: false
  },
  exactQuery: {
    type: Boolean as PropType<LinkProps['exactQuery']>,
    default: false
  },
  exactHash: {
    type: Boolean as PropType<LinkProps['exactHash']>,
    default: false
  },
  inactiveClass: {
    type: String as PropType<LinkProps['inactiveClass']>,
    default: undefined
  }
} as const
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