<script lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { InertiaLinkProps } from '@inertiajs/vue3'
import theme from '#build/ui/link'
import type { ComponentConfig } from '../../types/utils'

type Link = ComponentConfig<typeof theme, AppConfig, 'link'>

interface NuxtLinkProps extends Omit<InertiaLinkProps, 'href'> {
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
import { usePage, Link as InertiaLink } from '@inertiajs/vue3'
import { hasProtocol } from 'ufo'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

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

const routerLinkProps = useForwardProps(reactiveOmit(props, 'as', 'type', 'disabled', 'active', 'exact', 'activeClass', 'inactiveClass', 'to', 'raw', 'class'))

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

const isExternal = computed(() => {
  if (props.external) return true
  if (!props.to) return false
  return typeof props.to === 'string' && hasProtocol(props.to, { acceptRelative: true })
})

const linkClass = computed(() => {
  const active = isActive.value

  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass]
  }

  return ui.value({ class: props.class, active, disabled: props.disabled })
})

const page = usePage()
const url = computed(() => props.to ?? props.href ?? '')

const isActive = computed(() => props.active || (!!url.value && (props.exact ? url.value === props.href : page?.url.startsWith(url.value))))
</script>

<template>
  <template v-if="!isExternal && !!url">
    <InertiaLink v-bind="routerLinkProps" :href="url">
      <template v-if="custom">
        <slot
          v-bind="{
            ...$attrs,
            as,
            type,
            disabled,
            href: url,
            active: isActive
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
          href: url,
          active: isActive
        }"
        :class="linkClass"
      >
        <slot :active="isActive" />
      </ULinkBase>
    </InertiaLink>
  </template>

  <template v-else>
    <template v-if="custom">
      <slot
        v-bind="{
          ...$attrs,
          as,
          type,
          disabled,
          href: to,
          target: isExternal ? '_blank' : undefined,
          active: isActive
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
        href: url,
        target: isExternal ? '_blank' : undefined,
        active: isActive
      }"
      :is-external="isExternal"
      :class="linkClass"
    >
      <slot :active="isActive" />
    </ULinkBase>
  </template>
</template>
