<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/code'

type ProseCode = ComponentConfig<typeof theme, AppConfig, 'code', 'ui.prose'>

export interface ProseCodeProps {
  lang?: string
  /**
   * @defaultValue 'neutral'
   */
  color?: ProseCode['variants']['color']
  class?: any
  ui?: { base?: any }
}

export interface ProseCodeSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseCodeProps>()

defineSlots<ProseCodeSlots>()

const props = useComponentProps('prose.code', _props)

const appConfig = useAppConfig() as ProseCode['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.code || {}) }))
</script>

<template>
  <code :class="ui({ class: [props.ui?.base, (props.class || '').split(',').join(' ')], color: props.color })">
    <slot />
  </code>
</template>
