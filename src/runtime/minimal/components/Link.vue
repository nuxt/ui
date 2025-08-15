<script lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/link'
import type { ComponentConfig } from '../../types/utils'

type Link = ComponentConfig<typeof theme, AppConfig, 'link'>

interface NuxtLinkProps {
  /**
   * Route Location the link should navigate to when clicked on.
   */
  to?: string
  /**
   * An alias for `to`. If used with `to`, `href` will be ignored
   */
  href?: string
  /**
   * Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases
   */
  external?: boolean
  /**
   * Where to display the linked URL, as the name for a browsing context.
   */
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null
  /**
   * A rel attribute value to apply on the link. Defaults to "noopener noreferrer" for external links.
   */
  rel?: 'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc' | (string & {}) | null
  /**
   * If set to true, no rel attribute will be added to the link
   */
  noRel?: boolean
  /**
   * A class to apply to links that have been prefetched.
   */
  prefetchedClass?: string
  /**
   * When enabled will prefetch middleware, layouts and payloads of links in the viewport.
   */
  prefetch?: boolean
  /**
   * Allows controlling when to prefetch links. By default, prefetch is triggered only on visibility.
   */
  prefetchOn?: 'visibility' | 'interaction' | Partial<{
    visibility: boolean
    interaction: boolean
  }>
  /**
   * Escape hatch to disable `prefetch` attribute.
   */
  noPrefetch?: boolean
  /**
   * Allows passing additional attributes to the actual rendered link.
   */
  linkAttrs?: Record<string, any>
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
  /** Will only be active if the current route query is an exact match. */
  exactQuery?: boolean
  /** Will only be active if the current route hash is an exact match. */
  exactHash?: boolean
  /** The class to apply when the link is active. */
  activeClass?: string
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

const appConfig = useAppConfig() as Link['AppConfig']

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

const to = computed(() => props.to ?? props.href)

const isExternal = computed(() => {
  if (props.external) {
    return true
  }

  if (!to.value) {
    return false
  }

  return typeof to.value === 'string' && hasProtocol(to.value, { acceptRelative: true })
})

const active = computed(() => {
  if (props.active !== undefined) {
    return props.active
  }

  // Without router, we can't determine if link is active
  return false
})

const rel = computed(() => {
  if (props.noRel) {
    return undefined
  }

  if (props.rel) {
    return props.rel
  }

  if (isExternal.value) {
    return 'noopener noreferrer'
  }

  return undefined
})

function resolveLinkClass() {
  if (props.raw) {
    return [props.class, active.value ? props.activeClass : props.inactiveClass]
  }

  return ui.value({
    active: active.value,
    disabled: !!props.disabled,
    class: [props.class]
  })
}
</script>

<template>
  <template v-if="custom">
    <slot
      v-bind="{
        ...$attrs,
        as,
        type,
        disabled,
        href: to,
        rel,
        target: isExternal ? '_blank' : props.target,
        isExternal,
        active
      }"
    />
  </template>
  <ULinkBase
    v-else
    v-bind="{
      ...$attrs,
      as: to && !isExternal && !disabled ? 'a' : as,
      type,
      disabled,
      href: to,
      rel,
      target: isExternal ? '_blank' : props.target,
      isExternal
    }"
    :class="resolveLinkClass()"
  >
    <slot :active="active" />
  </ULinkBase>
</template>
