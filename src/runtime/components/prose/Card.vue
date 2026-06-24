<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/card'
import type { IconProps, LinkProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ProseCard = ComponentConfig<typeof theme, AppConfig, 'card', 'ui.prose'>

export interface ProseCardProps {
  to?: LinkProps['to']
  target?: LinkProps['target']
  icon?: IconProps['name']
  title?: string
  description?: string
  /**
   * @defaultValue 'primary'
   */
  color?: ProseCard['variants']['color']
  class?: any
  ui?: ProseCard['slots']
}

export interface ProseCardSlots {
  default(props?: {}): VNode[]
  title(props?: {}): VNode[]
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

const _props = defineProps<ProseCardProps>()
const slots = defineSlots<ProseCardSlots>()

const props = useComponentProps('prose.card', _props)

const appConfig = useAppConfig() as ProseCard['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.card || {}) })({
  color: props.color,
  to: !!props.to,
  title: !!props.title
}))

// eslint-disable-next-line vue/no-dupe-keys
const target = computed(() => props.target || (!!props.to && typeof props.to === 'string' && props.to.startsWith('http') ? '_blank' : undefined))

const ariaLabel = computed(() => (props.title || 'Card link').trim())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <ULink
      v-if="props.to"
      :aria-label="ariaLabel"
      v-bind="{ to: props.to, target, ...$attrs }"
      class="focus:outline-none"
      raw
    >
      <span class="absolute inset-0" aria-hidden="true" />
    </ULink>

    <UIcon v-if="props.icon" :name="props.icon" :class="ui.icon({ class: props.ui?.icon })" />
    <UIcon v-if="!!props.to && target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.externalIcon({ class: props.ui?.externalIcon })" />

    <p v-if="props.title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
      <slot name="title" mdc-unwrap="p">
        {{ props.title }}
      </slot>
    </p>

    <div v-if="!!slots.default" :class="ui.description({ class: props.ui?.description })">
      <slot>
        {{ props.description }}
      </slot>
    </div>
  </div>
</template>
