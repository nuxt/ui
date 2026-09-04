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
  // exposed since Nuxt 4.5, which stopped prefetching `custom` links itself
  prefetch?: (nuxtApp?: any) => Promise<void>
  prefetched?: boolean
  shouldPrefetch?: (mode: 'visibility' | 'interaction') => boolean
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import { isEqual } from 'ohash/utils'
import { useForwardProps, Slot } from 'reka-ui'
import { defu } from 'defu'
import { hasProtocol } from 'ufo'
import { reactiveOmit } from '@vueuse/core'
import { useRoute, useAppConfig, useNuxtApp } from '#imports'
import { mergeClasses } from '../utils'
import { tv } from '../utils/tv'
import { isPartiallyEqual } from '../utils/link'
import { requestIdleCallback, cancelIdleCallback, observeIntersection } from '../utils/prefetch'
import ULinkBase from './LinkBase.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'button',
  type: 'button',
  ariaCurrentValue: 'page',
  active: undefined,
  locale: undefined
})
defineSlots<LinkSlots>()

const route = useRoute()
const appConfig = useAppConfig() as Link['AppConfig']
const nuxtApp = useNuxtApp()

const nuxtLinkProps = useForwardProps(reactiveOmit(props, 'as', 'type', 'disabled', 'active', 'exact', 'exactQuery', 'exactHash', 'activeClass', 'inactiveClass', 'to', 'href', 'raw', 'custom', 'locale', 'class'))

const ui = computed(() => tv({
  extend: theme,
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

  const localizedPath = localePath(path, typeof props.locale === 'string' ? props.locale : undefined)

  return localizedPath || path
})

const isInternalLink = computed(() => {
  if (!to.value) return false
  if (props.external) return false
  if (typeof to.value !== 'string') return true
  if (hasProtocol(to.value, { acceptRelative: true })) return false
  if (props.target && props.target !== '_self') return false
  return true
})

// NuxtLink strips `rel` from its slot props when rendered with `custom`, so
// the prop is applied here for every branch instead of read from the slot.
const rel = computed(() => {
  // If noRel is explicitly set, return null
  if (props.noRel) {
    return null
  }

  // If rel is explicitly set, use it
  if (props.rel !== undefined) {
    return props.rel || null
  }

  // Default to "noopener noreferrer" for external links or links with target
  if (!isInternalLink.value || (props.target && props.target !== '_self')) {
    return 'noopener noreferrer'
  }

  return null
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

function resolveLinkClass({ route, isActive, isExactActive, prefetched }: any = {}) {
  const active = isLinkActive({ route, isActive, isExactActive })
  const prefetchedClass = prefetched ? props.prefetchedClass : undefined

  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass, prefetchedClass]
  }

  return ui.value({ class: prefetchedClass ? [props.class, prefetchedClass] : props.class, active, disabled: props.disabled })
}

// Since Nuxt 4.5, NuxtLink no longer prefetches `custom` links itself and
// exposes `prefetch` / `shouldPrefetch` to the slot instead. Both triggers are
// wired here on the rendered element, whether it is our own `ULinkBase` or the
// element a custom slot renders. Older Nuxt versions pass neither and keep
// observing on their own.
const instance = getCurrentInstance()

let prefetchApi: Pick<NuxtLinkDefaultSlotProps, 'prefetch' | 'shouldPrefetch'> | undefined

// Called with the app explicitly: NuxtLink's `prefetch` takes an optional
// `nuxtApp` and would otherwise receive the event.
function onPrefetch() {
  prefetchApi?.prefetch?.(nuxtApp)
}

function getPrefetchListeners({ prefetch, shouldPrefetch }: NuxtLinkDefaultSlotProps) {
  if (!prefetch || !shouldPrefetch) {
    return undefined
  }

  prefetchApi = { prefetch, shouldPrefetch }

  return shouldPrefetch('interaction') ? { onPointerenter: onPrefetch, onFocus: onPrefetch } : undefined
}

let idleId: ReturnType<typeof requestIdleCallback>
let unobserve: (() => void) | null = null

onMounted(() => {
  if (!prefetchApi?.shouldPrefetch?.('visibility')) {
    return
  }

  // Our root is the custom NuxtLink's fragment anchor, so the rendered element
  // is its next sibling. This is the element NuxtLink itself observed for
  // custom links before 4.5.
  const root = instance?.proxy?.$el as Element | CharacterData | null
  const el = root instanceof Element ? root : root?.nextElementSibling
  if (!el) {
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
  <NuxtLink v-if="isInternalLink" v-slot="{ href, navigate, route: linkRoute, isActive, isExactActive, ...rest }" v-bind="nuxtLinkProps" :to="to" custom>
    <Slot v-if="custom">
      <slot
        v-bind="{
          ...$attrs,
          ...(exact && isExactActive ? { 'aria-current': props.ariaCurrentValue } : {}),
          ...((rest as NuxtLinkDefaultSlotProps).prefetched && prefetchedClass ? { class: prefetchedClass } : {}),
          ...getPrefetchListeners(rest as NuxtLinkDefaultSlotProps),
          as,
          type,
          disabled,
          href,
          navigate,
          rel,
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
        rel,
        target: (rest as NuxtLinkDefaultSlotProps).target,
        isExternal: (rest as NuxtLinkDefaultSlotProps).isExternal,
        ...getPrefetchListeners(rest as NuxtLinkDefaultSlotProps)
      }"
      :class="resolveLinkClass({ route: linkRoute, isActive, isExactActive, prefetched: (rest as NuxtLinkDefaultSlotProps).prefetched })"
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
        ...(to ? { href: String(to), target: props.target, rel, isExternal: true } : {}),
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
      ...(to ? { href: String(to), target: props.target, rel, isExternal: true } : {})
    }"
    :class="resolveLinkClass()"
  >
    <slot :active="active ?? false" />
  </ULinkBase>
</template>
