<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/hr'

type ProseHr = ComponentConfig<typeof theme, AppConfig, 'hr', 'ui.prose'>

export interface ProseHrProps {
  class?: any
  ui?: ProseHr['slots']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseHrProps>()

const props = useComponentProps('prose.hr', _props, theme)

const appConfig = useThemeConfig() as ProseHr['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.hr)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <hr :class="ui.base({ class: [props.ui?.base, props.class] })">
</template>
