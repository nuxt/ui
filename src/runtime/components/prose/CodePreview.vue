<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/code-preview'

type ProseCodePreview = ComponentConfig<typeof theme, AppConfig, 'codePreview', 'ui.prose'>

export interface ProseCodePreviewProps {
  class?: any
  ui?: ProseCodePreview['slots']
}

export interface ProseCodePreviewSlots {
  default(props?: {}): any
  code(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseCodePreviewProps>()
const slots = defineSlots<ProseCodePreviewSlots>()

const appConfig = useAppConfig() as ProseCodePreview['AppConfig']
const uiProp = useComponentUI('prose.codePreview', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.codePreview || {}) })({ code: !!slots.code }))
</script>

<template>
  <div :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div :class="ui.preview({ class: [uiProp?.preview] })">
      <slot />
    </div>

    <div v-if="!!slots.code" :class="ui.code({ class: [uiProp?.code] })">
      <slot name="code" />
    </div>
  </div>
</template>
