<script lang="ts">
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
  default(props?: {}): any
  prompt(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, Slot } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<ChatPaletteProps>()
const slots = defineSlots<ChatPaletteSlots>()

const appConfig = useAppConfig() as ChatPalette['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatPalette || {}) })())
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
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
