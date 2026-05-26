<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/em'

type ProseEm = ComponentConfig<typeof theme, AppConfig, 'em', 'ui.prose'>

export interface ProseEmProps {
  class?: string
  ui?: { base?: any }
}

export interface ProseEmSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseEmProps>()

defineSlots<ProseEmSlots>()

const props = useComponentProps('prose.em', _props)

const appConfig = useAppConfig() as ProseEm['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.em || {}) }))
</script>

<template>
  <em :class="ui({ class: [props.ui?.base, props.class] })"><slot /></em>
</template>
