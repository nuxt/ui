<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/empty'
import type { ComponentConfig } from '../types/tv'
import type { ButtonProps, IconProps } from '../types'

type Empty = ComponentConfig<typeof theme, AppConfig, 'empty'>

export interface EmptyProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'subtle'
   */
  variant?: Empty['variants']['variant']
  /**
   * The icon displayed above the title.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  title?: string
  description?: string
  /**
   * Display a list of Button under the description.
   */
  actions?: ButtonProps[]
  class?: any
  ui?: Empty['slots']
}

export interface EmptySlots {
  top(props?: {}): any
  default(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  actions(props?: {}): any
  bottom(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<EmptyProps>()
const slots = defineSlots<EmptySlots>()

const appConfig = useAppConfig() as Empty['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.empty || {}) })({
  variant: props.variant
}))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="top" />

    <div :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.default || icon" :class="ui.content({ class: props.ui?.content })">
        <slot>
          <UAvatar v-if="icon" :icon="icon" :ui="{ icon: ui.icon({ class: props.ui?.icon }) }" :class="ui.iconWrapper({ class: props.ui?.iconWrapper })" />
        </slot>
      </div>

      <div :class="ui.wrapper({ class: props.ui?.wrapper })">
        <h2 v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>

        <div v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </div>

      <div v-if="actions?.length || !!slots.actions" :class="ui.actions({ class: props.ui?.actions })">
        <slot name="actions">
          <UButton v-for="(action, index) in actions" :key="index" v-bind="action" />
        </slot>
      </div>
    </div>

    <slot name="bottom" />
  </Primitive>
</template>
