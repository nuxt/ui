<script lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/link'
import type { NuxtLinkProps } from '#app'

const appConfig = _appConfig as AppConfig & { ui: { link: Partial<typeof theme> } }

const link = tv({ extend: tv(theme), ...(appConfig.ui?.link || {}) })

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
  active?: boolean
  exact?: boolean
  exactQuery?: boolean
  exactHash?: boolean
  inactiveClass?: string
  custom?: boolean
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
const nuxtLinkProps = useForwardProps(reactiveOmit(props, 'as', 'type', 'disabled', 'active', 'exact', 'exactQuery', 'exactHash', 'activeClass', 'inactiveClass'))

const ui = computed(() => tv({
  extend: link,
  variants: {
    active: {
      true: props.activeClass,
      false: props.inactiveClass
    }
  }
}))

function isLinkActive(slotProps: any) {
  if (props.active !== undefined) {
    return props.active
  }

  if (props.exactQuery && !isEqual(slotProps.route.query, route.query)) {
    return false
  }
  if (props.exactHash && slotProps.route.hash !== route.hash) {
    return false
  }

  if (props.exact && slotProps.isExactActive) {
    return true
  }

  if (!props.exact && slotProps.isActive) {
    return true
  }

  return false
}

function resolveLinkClass(slotProps: any) {
  const active = isLinkActive(slotProps)

  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass]
  }

  return ui.value({ class: props.class, active, disabled: props.disabled })
}
</script>

<template>
  <NuxtLink v-slot="slotProps" v-bind="nuxtLinkProps" custom>
    <template v-if="custom">
      <slot v-bind="{ ...$attrs, ...slotProps, as, type, disabled, active: isLinkActive(slotProps) }" />
    </template>
    <ULinkBase v-else v-bind="{ ...$attrs, ...slotProps, as, type, disabled }" :class="resolveLinkClass(slotProps)">
      <slot v-bind="{ ...slotProps, as, type, disabled, active: isLinkActive(slotProps) }" />
    </ULinkBase>
  </NuxtLink>
</template>
