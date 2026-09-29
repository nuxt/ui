<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/code-preview'

type ProseCodePreview = ComponentConfig<typeof theme, AppConfig, 'codePreview', 'ui.prose'>

export interface ProseCodePreviewProps {
  class?: any
  ui?: ProseCodePreview['slots']
}

export interface ProseCodePreviewSlots {
  default(props?: {}): VNode[]
  code(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseCodePreviewProps>()
const slots = defineSlots<ProseCodePreviewSlots>()

const props = useComponentProps('prose.codePreview', _props, theme)

const appConfig = useAppConfig() as ProseCodePreview['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.codePreview)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({ code: !!slots.code }))
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.preview({ class: [props.ui?.preview] })">
      <slot />
    </div>

    <div v-if="!!slots.code" :class="ui.code({ class: [props.ui?.code] })">
      <slot name="code" />
    </div>
  </div>
</template>
