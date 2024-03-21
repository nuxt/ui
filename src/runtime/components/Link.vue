<script lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import type { PrimitiveProps } from 'radix-vue'
import type { NuxtLinkProps } from '#app'

export interface LinkProps extends NuxtLinkProps, Omit<PrimitiveProps, 'asChild'> {
  type?: ButtonHTMLAttributes['type']
  disabled?: boolean
  active?: boolean
  exact?: boolean
  exactQuery?: boolean
  exactHash?: boolean
  inactiveClass?: string
  custom?: boolean
}
</script>

<script setup lang="ts">
import { isEqual } from 'ohash'
import { useForwardProps } from 'radix-vue'
import { reactiveOmit } from '@vueuse/core'
import { useRoute } from '#imports'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<LinkProps>(), { as: 'button', type: 'button', active: undefined })

const route = useRoute()
const nuxtLinkProps = useForwardProps(reactiveOmit(props, 'as', 'type', 'disabled', 'active', 'exact', 'exactQuery', 'exactHash', 'activeClass', 'inactiveClass'))

function resolveLinkClass (slotProps: any) {
  return isLinkActive(slotProps) ? props.activeClass : props.inactiveClass
}

function isLinkActive (slotProps: any) {
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
