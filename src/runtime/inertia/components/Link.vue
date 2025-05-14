<script lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { InertiaLinkProps } from '@inertiajs/vue3'
import theme from '#build/ui/link'
import type { ComponentConfig } from '../../types/utils'

type Link = ComponentConfig<typeof theme, AppConfig, 'link'>

interface NuxtLinkProps extends Omit<InertiaLinkProps, 'href' | 'onClick'> {
  activeClass?: string
  /**
   * Route Location the link should navigate to when clicked on.
   */
  to?: string // need to manually type to avoid breaking typedPages
  /**
   * An alias for `to`. If used with `to`, `href` will be ignored
   */
  href?: NuxtLinkProps['to']
  /**
   * Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases
   */
  external?: boolean
  /**
   * Where to display the linked URL, as the name for a browsing context.
   */
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null
  ariaCurrentValue?: string
}

export interface LinkProps extends NuxtLinkProps {
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
import { defu } from 'defu'
import { useForwardProps } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { usePage } from '@inertiajs/vue3'
import { hasProtocol } from 'ufo'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import ULinkBase from '../../components/LinkBase.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'button',
  type: 'button',
  active: undefined,
  activeClass: '',
  inactiveClass: ''
})
defineSlots<LinkSlots>()

const page = usePage()

const appConfig = useAppConfig() as Link['AppConfig']

const routerLinkProps = useForwardProps(reactiveOmit(props, 'as', 'type', 'disabled', 'active', 'exact', 'activeClass', 'inactiveClass', 'to', 'href', 'raw', 'custom', 'class'))

const ui = computed(() => tv({
  extend: tv(theme),
  ...defu({
    variants: {
      active: {
        true: props.activeClass,
        false: props.inactiveClass
      }
    }
  }, appConfig.ui?.link || {})
}))

const href = computed(() => props.to ?? props.href)

const isExternal = computed(() => {
  if (props.external) {
    return true
  }

  if (!href.value) {
    return false
  }

  return typeof href.value === 'string' && hasProtocol(href.value, { acceptRelative: true })
})

const isLinkActive = computed(() => {
  if (props.active !== undefined) {
    return props.active
  }

  if (!href.value) {
    return false
  }

  if (props.exact && page.url === href.value) {
    return true
  }

  if (!props.exact && page.url.startsWith(href.value)) {
    return true
  }

  return false
})

const linkClass = computed(() => {
  const active = isLinkActive.value

  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass]
  }

  return ui.value({ class: props.class, active, disabled: props.disabled })
})
</script>

<template>
  <template v-if="custom">
    <slot
      v-bind="{
        ...$attrs,
        ...routerLinkProps,
        as,
        type,
        disabled,
        href,
        active: isLinkActive,
        isExternal
      }"
    />
  </template>
  <ULinkBase
    v-else
    v-bind="{
      ...$attrs,
      ...routerLinkProps,
      as,
      type,
      disabled,
      href,
      isExternal
    }"
    :class="linkClass"
  >
    <slot :active="isLinkActive" />
  </ULinkBase>
</template>
