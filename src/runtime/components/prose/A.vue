<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/a'
import type { ComponentConfig } from '../../types/tv'

type ProseA = ComponentConfig<typeof theme, AppConfig, 'a', 'ui.prose'>

export interface ProseAProps {
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined
  class?: any
  ui?: { base?: any }
}

export interface ProseASlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'
import ULink from '../Link.vue'

const props = defineProps<ProseAProps>()
defineSlots<ProseASlots>()

const appConfig = useAppConfig() as ProseA['AppConfig']
const uiProp = useComponentUI('prose.a', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.a || {}) }))
</script>

<template>
  <ULink :href="href" :target="target" :class="ui({ class: [uiProp?.base, props.class] })" raw>
    <slot />
  </ULink>
</template>
