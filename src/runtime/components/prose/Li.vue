<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/li'

type ProseLi = ComponentConfig<typeof theme, AppConfig, 'li', 'ui.prose'>

export interface ProseLiProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseLiSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseLiProps>()

defineSlots<ProseLiSlots>()

const props = useComponentProps('prose.li', _props)

const appConfig = useAppConfig() as ProseLi['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.li || {}) }))
</script>

<template>
  <li :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </li>
</template>
