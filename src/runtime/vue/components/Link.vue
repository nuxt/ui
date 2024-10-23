<script lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import { hasProtocol } from 'ufo'
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/link'
import type { RouterLinkProps } from 'vue-router'
import { RouterLink } from 'vue-router'

const appConfig = _appConfig as AppConfig & { ui: { link: Partial<typeof theme> } }

const link = tv({ extend: tv(theme), ...(appConfig.ui?.link || {}) })

export interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  /** Ensures we are accepting an undefined `to` when running without Nuxt context */
  to?: RouterLinkProps['to']
  /**
   * The element or component this component should render as when not a link.
   * @defaultValue 'button'
   */
  as?: any
  /**
   * The type of the button when not a link.
   * @defaultValue 'button'
   */
  type?: ButtonHTMLAttributes['type']
  disabled?: boolean
  /** Force the link to be active independent of the current route. */
  active?: boolean
  /** Will only be active if the current route is an exact match. */
  exact?: boolean
  /** Will only be active if the current route query is an exact match. */
  exactQuery?: boolean
  /** Will only be active if the current route hash is an exact match. */
  exactHash?: boolean
  /** The class to apply when the link is inactive. */
  inactiveClass?: string
  custom?: boolean
  /** When `true`, only styles from `class`, `activeClass`, and `inactiveClass` will be applied. */
  raw?: boolean
  class?: any
}

export interface LinkSlots {
  default(props: { active: boolean }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { isEqual } from 'ohash'
import { useForwardProps } from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import { useRoute } from '#imports'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'button',
  type: 'button',
  active: undefined,
  activeClass: '',
  inactiveClass: ''
})
defineSlots<LinkSlots>()

const route = useRoute()
const routerLinkProps = useForwardProps(reactiveOmit(props, 'as', 'type', 'disabled', 'active', 'exact', 'exactQuery', 'exactHash', 'activeClass', 'inactiveClass', 'to'))

const ui = computed(() => tv({
  extend: link,
  variants: {
    active: {
      true: props.activeClass,
      false: props.inactiveClass
    }
  }
}))

const isExternal = computed(() => typeof props.to === 'string' && hasProtocol(props.to, { acceptRelative: true }))

function isLinkActive({ route: linkRoute, isActive, isExactActive }: any) {
  if (props.active !== undefined) {
    return props.active
  }

  if (props.exactQuery && !isEqual(linkRoute.query, route.query)) {
    return false
  }
  if (props.exactHash && linkRoute.hash !== route.hash) {
    return false
  }

  if (props.exact && isExactActive) {
    return true
  }

  if (!props.exact && isActive) {
    return true
  }

  return false
}

function resolveLinkClass({ route, isActive, isExactActive }: any) {
  const active = isLinkActive({ route, isActive, isExactActive })

  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass]
  }

  return ui.value({ class: props.class, active, disabled: props.disabled })
}
</script>

<template>
  <RouterLink v-slot="{ href, navigate, route: linkRoute, isActive, isExactActive }" v-bind="routerLinkProps" :to="to || '#'" custom>
    <template v-if="custom">
      <slot
        v-bind="{
          ...$attrs,
          as,
          type,
          disabled,
          href: to ? (isExternal ? to as string : href) : undefined,
          navigate,
          active: to ? isLinkActive({ route: linkRoute, isActive, isExactActive }) : false
        }"
      />
    </template>
    <ULinkBase
      v-else
      v-bind="{
        ...$attrs,
        as,
        type,
        disabled,
        href: to ? (isExternal ? to as string : href) : undefined,
        navigate
      }"
      :class="resolveLinkClass({ route: linkRoute, isActive: to ? isActive : false, isExactActive: to ? isExactActive : false })"
    >
      <slot :active="to ? isLinkActive({ route: linkRoute, isActive, isExactActive }) : false" />
    </ULinkBase>
  </RouterLink>
</template>
