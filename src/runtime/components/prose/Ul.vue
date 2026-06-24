<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/ul'

type ProseUl = ComponentConfig<typeof theme, AppConfig, 'ul', 'ui.prose'>

export interface ProseUlProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseUlSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseUlProps>()

defineSlots<ProseUlSlots>()

const props = useComponentProps('prose.ul', _props)

const appConfig = useAppConfig() as ProseUl['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.ul || {}) }))
</script>

<template>
  <ul :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </ul>
</template>
