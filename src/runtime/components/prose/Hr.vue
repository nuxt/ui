<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/hr'

type ProseHr = ComponentConfig<typeof theme, AppConfig, 'hr', 'ui.prose'>

export interface ProseHrProps {
  class?: any
  ui?: { base?: any }
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseHrProps>()

const props = useComponentProps('prose.hr', _props)

const appConfig = useAppConfig() as ProseHr['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.hr || {}) }))
</script>

<template>
  <hr :class="ui({ class: [props.ui?.base, props.class] })">
</template>
