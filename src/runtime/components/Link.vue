<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { RouterLinkProps, RouteLocationRaw } from 'vue-router'
import theme from '#build/ui/link'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from '../types/html'
import type { ComponentConfig } from '../types/tv'

type Link = ComponentConfig<typeof theme, AppConfig, 'link'>

interface NuxtLinkProps extends Omit<RouterLinkProps, 'to'> {
  /**
   * Route Location the link should navigate to when clicked on.
   */
  to?: RouteLocationRaw
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
   * An option to either add or remove trailing slashes in the `href` for this specific link.
   * Overrides the global `trailingSlash` option if provided.
   */
  trailingSlash?: 'append' | 'remove'
}

export interface LinkProps extends NuxtLinkProps, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled'>, /** @vue-ignore */ Omit<AnchorHTMLAttributes, 'href' | 'target' | 'rel' | 'type'> {
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
  custom?: boolean
  /** When `true`, only styles from `class`, `activeClass`, and `inactiveClass` will be applied. */
  raw?: boolean
  /**
   * Control i18n auto-localization when `@nuxtjs/i18n` is installed.
   * - `undefined` / `true` (default): auto-localizes to the current locale using `$localePath`.
   *   Paths already carrying a locale prefix (from e.g. `switchLocalePath()`) are detected
   *   and left untouched to prevent double-prefixing.
   * - `false`: explicitly disables auto-localization.
   * - `string`: localizes to a specific locale (e.g. `'fr'`).
   */
  locale?: boolean | string
  class?: any
}

/**
 * Link-related props that can be omitted from ButtonProps when link functionality is not needed.
 * Use this with `Omit<ButtonProps, LinkPropsKeys>` in components where buttons should not act as links.
 */
export type LinkPropsKeys = 'to' | 'href' | 'target' | 'rel' | 'noRel' | 'external' | 'prefetch' | 'prefetchOn' | 'prefetchedClass' | 'noPrefetch' | 'trailingSlash' | 'replace' | 'ariaCurrentValue' | 'active' | 'activeClass' | 'exact' | 'exactQuery' | 'exactHash' | 'inactiveClass' | 'locale' | 'download' | 'ping' | 'referrerpolicy' | 'hreflang' | 'media'

export interface LinkSlots {
  default?(props: { active: boolean }): VNode[]
}

// from upstream NuxtLink
interface NuxtLinkDefaultSlotProps {
  rel: string | null
  target: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null
  isExternal: boolean
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { isEqual } from 'ohash/utils'
import { useForwardProps, Slot } from 'reka-ui'
import { defu } from 'defu'
import { hasProtocol } from 'ufo'
import { reactiveOmit } from '@vueuse/core'
import { useRoute, useAppConfig, useNuxtApp } from '#imports'
import { mergeClasses } from '../utils'
import { tv } from '../utils/tv'
import { isPartiallyEqual } from '../utils/link'
import ULinkBase from './LinkBase.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'button',
  type: 'button',
  ariaCurrentValue: 'page',
  active: undefined
})
defineSlots<LinkSlots>()

const route = useRoute()
const appConfig = useAppConfig() as Link['AppConfig']
const nuxtApp = useNuxtApp()

const nuxtLinkProps = useForwardProps(reactiveOmit(props, 'as', 'type', 'disabled', 'active', 'exact', 'exactQuery', 'exactHash', 'activeClass', 'inactiveClass', 'to', 'href', 'raw', 'custom', 'locale', 'class'))

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

const to = computed(() => {
  const path = props.to ?? props.href
  if (!path) return path

  if (typeof path !== 'string') return path

  if (props.external || hasProtocol(path, { acceptRelative: true })) {
    return path
  }

  if (props.locale === false) {
    return path
  }

  const localePath = nuxtApp.$localePath as ((route: RouteLocationRaw, locale?: string) => string) | undefined
  if (!localePath) {
    return path
  }

  const i18n = nuxtApp.$i18n as { localeCodes?: { value: string[] } } | undefined
  const codes = i18n?.localeCodes?.value
  if (codes?.length && new RegExp(`^/(${codes.join('|')})($|[/?#])`).test(path)) {
    return path
  }

  return localePath(path, typeof props.locale === 'string' ? props.locale : undefined)
})

const isInternalLink = computed(() => {
  if (!to.value) return false
  if (props.external) return false
  if (typeof to.value !== 'string') return true
  if (hasProtocol(to.value, { acceptRelative: true })) return false
  if (props.target && props.target !== '_self') return false
  return true
})

const externalRel = computed(() => {
  if (props.noRel) return null
  if (props.rel) return props.rel
  return 'noopener noreferrer'
})

function isLinkActive({ route: linkRoute, isActive, isExactActive }: any = {}) {
  if (props.active !== undefined) {
    return props.active
  }

  if (!to.value) {
    return false
  }

  if (props.exactQuery === 'partial') {
    if (!isPartiallyEqual(linkRoute.query, route.query)) return false
  } else if (props.exactQuery === true) {
    if (!isEqual(linkRoute.query, route.query)) return false
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

function resolveLinkClass({ route, isActive, isExactActive }: any = {}) {
  const active = isLinkActive({ route, isActive, isExactActive })

  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass]
  }

  return ui.value({ class: props.class, active, disabled: props.disabled })
}
</script>

<template>
  <NuxtLink v-if="isInternalLink" v-slot="{ href, navigate, route: linkRoute, isActive, isExactActive, ...rest }" v-bind="nuxtLinkProps" :to="to" custom>
    <Slot v-if="custom">
      <slot
        v-bind="{
          ...$attrs,
          ...(exact && isExactActive ? { 'aria-current': props.ariaCurrentValue } : {}),
          as,
          type,
          disabled,
          href,
          navigate,
          rel: (rest as NuxtLinkDefaultSlotProps).rel,
          target: (rest as NuxtLinkDefaultSlotProps).target,
          isExternal: (rest as NuxtLinkDefaultSlotProps).isExternal,
          active: isLinkActive({ route: linkRoute, isActive, isExactActive })
        }"
      />
    </Slot>
    <ULinkBase
      v-else
      v-bind="{
        ...$attrs,
        ...(exact && isExactActive ? { 'aria-current': props.ariaCurrentValue } : {}),
        as,
        type,
        disabled,
        href,
        navigate,
        rel: (rest as NuxtLinkDefaultSlotProps).rel,
        target: (rest as NuxtLinkDefaultSlotProps).target,
        isExternal: (rest as NuxtLinkDefaultSlotProps).isExternal
      }"
      :class="resolveLinkClass({ route: linkRoute, isActive, isExactActive })"
    >
      <slot :active="isLinkActive({ route: linkRoute, isActive, isExactActive })" />
    </ULinkBase>
  </NuxtLink>

  <Slot v-else-if="custom">
    <slot
      v-bind="{
        ...$attrs,
        as,
        type,
        disabled,
        ...(to ? { href: String(to), target: props.target, rel: externalRel, isExternal: true } : {}),
        active: active ?? false
      }"
    />
  </Slot>
  <ULinkBase
    v-else
    v-bind="{
      ...$attrs,
      as,
      type,
      disabled,
      ...(to ? { href: String(to), target: props.target, rel: externalRel, isExternal: true } : {})
    }"
    :class="resolveLinkClass()"
  >
    <slot :active="active ?? false" />
  </ULinkBase>
</template>
