<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/callout'
import type { IconProps, LinkProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ProseCallout = ComponentConfig<typeof theme, AppConfig, 'callout', 'ui.prose'>

export interface ProseCalloutProps {
  to?: LinkProps['to']
  target?: LinkProps['target']
  icon?: IconProps['name']
  /**
   * @defaultValue 'neutral'
   */
  color?: ProseCallout['variants']['color']
  class?: any
  ui?: ProseCallout['slots']
}

export interface ProseCalloutSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'
import ULink from '../Link.vue'
import UIcon from '../Icon.vue'

defineOptions({ inheritAttrs: false })

const _props = defineProps<ProseCalloutProps>()

defineSlots<ProseCalloutSlots>()

const props = useComponentProps('prose.callout', _props)

const appConfig = useAppConfig() as ProseCallout['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.callout || {}) })({
  color: props.color,
  to: !!props.to
}))

// eslint-disable-next-line vue/no-dupe-keys
const target = computed(() => props.target || (!!props.to && typeof props.to === 'string' && props.to.startsWith('http') ? '_blank' : undefined))
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <ULink
      v-if="props.to"
      v-bind="{ to: props.to, target, ...$attrs }"
      class="focus:outline-none"
      raw
    >
      <span class="absolute inset-0" aria-hidden="true" />
    </ULink>

    <UIcon v-if="props.icon" :name="props.icon" :class="ui.icon({ class: props.ui?.icon })" />
    <UIcon v-if="!!props.to && target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.externalIcon({ class: props.ui?.externalIcon })" />

    <slot mdc-unwrap="p" />
  </div>
</template>
