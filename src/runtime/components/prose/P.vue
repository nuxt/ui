<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/p'

type ProseP = ComponentConfig<typeof theme, AppConfig, 'p', 'ui.prose'>

export interface ProsePProps {
  class?: any
  ui?: ProseP['slots']
}

export interface ProsePSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProsePProps>()

defineSlots<ProsePSlots>()

const props = useComponentProps('prose.p', _props, theme)

const appConfig = useAppConfig() as ProseP['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.p)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <p :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </p>
</template>
