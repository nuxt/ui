<script lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/link'
import type { ComponentConfig } from '../../../types/tv'

type Link = ComponentConfig<typeof theme, AppConfig, 'link'>

interface BaseLinkProps {
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
}

export interface LinkProps extends BaseLinkProps {
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
  /** Allows controlling how the current route query sets the link as active. */
  exactQuery?: boolean | 'partial'
  /** Will only be active if the current route hash is an exact match. */
  exactHash?: boolean
  /** The class to apply when the link is inactive. */
  inactiveClass?: string
  /** The class to apply when the link is active. */
  activeClass?: string
  /** The value of the `aria-current` attribute when the link is active. */
  ariaCurrentValue?: string
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
import { computed, inject } from 'vue'
import { defu } from 'defu'
import { hasProtocol } from 'ufo'
import { useAppConfig } from '#imports'
import { mergeClasses } from '../../../utils'
import { tv } from '../../../utils/tv'
import ULinkBase from '../../../components/LinkBase.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'button',
  type: 'button',
  ariaCurrentValue: 'page',
  active: undefined
})
defineSlots<LinkSlots>()

const appConfig = useAppConfig() as Link['AppConfig']

const ui = computed(() => tv({
  extend: tv(theme),
  ...defu({
    variants: {
      active: {
        true: mergeClasses(appConfig.ui?.link?.variants?.active?.true, props.activeClass),
        false: mergeClasses(appConfig.ui?.link?.variants?.active?.false, props.inactiveClass)
      }
    }
  }, appConfig.ui?.link || {})
}))

const href = computed(() => props.to ?? props.href)

const isExternal = computed(() => {
  if (props.target === '_blank') {
    return true
  }

  if (props.external) {
    return true
  }

  if (!href.value) {
    return false
  }

  return hasProtocol(href.value, { acceptRelative: true })
})

const isLinkActive = computed(() => {
  if (props.active !== undefined) {
    return props.active
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

const linkRel = computed(() => {
  if (props.noRel) {
    return null
  }

  if (props.rel) {
    return props.rel
  }

  if (isExternal.value) {
    return 'noopener noreferrer'
  }

  return null
})

const handleNavigation = inject<((event: MouseEvent, context: { href: string, external: boolean, target?: string | null }) => void) | undefined>('nuxtui:router', undefined)

const navigate = handleNavigation
  ? (e: MouseEvent) => {
      handleNavigation(e, {
        href: href.value || '',
        external: isExternal.value,
        target: props.target || (isExternal.value ? '_blank' : undefined)
      })
    }
  : undefined
</script>

<template>
  <template v-if="custom">
    <slot
      v-bind="{
        ...$attrs,
        as,
        type,
        disabled,
        href,
        navigate,
        rel: linkRel,
        target: target || (isExternal ? '_blank' : undefined),
        isExternal,
        active: isLinkActive
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
      href,
      navigate,
      rel: linkRel,
      target: target || (isExternal ? '_blank' : undefined),
      isExternal
    }"
    :class="linkClass"
  >
    <slot :active="isLinkActive" />
  </ULinkBase>
</template>
