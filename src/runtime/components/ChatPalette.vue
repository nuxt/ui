<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-palette'
import type { ComponentConfig } from '../types/tv'

type ChatPalette = ComponentConfig<typeof theme, AppConfig, 'chatPalette'>

export interface ChatPaletteProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: ChatPalette['slots']
}

export interface ChatPaletteSlots {
  default?(props?: {}): VNode[]
  prompt?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, Slot } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { tv } from '../utils/tv'

const _props = defineProps<ChatPaletteProps>()
const slots = defineSlots<ChatPaletteSlots>()

const props = useComponentProps('chatPalette', _props)

const appConfig = useAppConfig() as ChatPalette['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatPalette || {}) })())
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div data-slot="content" :class="ui.content({ class: props.ui?.content })">
      <Slot compact>
        <slot />
      </Slot>
    </div>

    <Slot v-if="!!slots.prompt" data-slot="prompt" :class="ui.prompt({ class: props.ui?.prompt })">
      <slot name="prompt" />
    </Slot>
  </Primitive>
</template>
