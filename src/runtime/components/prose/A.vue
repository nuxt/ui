<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../../theme/prose/a'
import type { ComponentConfig } from '../../types/tv'

type ProseA = ComponentConfig<typeof theme, AppConfig, 'a', 'ui.prose'>

export interface ProseAProps {
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined
  class?: any
  ui?: ProseA['slots']
}

export interface ProseASlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'
import ULink from '../Link.vue'

const _props = defineProps<ProseAProps>()

defineSlots<ProseASlots>()

const props = useComponentProps('prose.a', _props, theme)

const appConfig = useAppConfig() as ProseA['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.a)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <ULink :href="props.href" :target="props.target" :class="ui.base({ class: [props.ui?.base, props.class] })" raw>
    <slot />
  </ULink>
</template>
