<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/h2'
import type { ComponentConfig } from '../../types/tv'

type ProseH2 = ComponentConfig<typeof theme, AppConfig, 'h2', 'ui.prose'>

export interface ProseH2Props {
  id?: string
  class?: any
  ui?: ProseH2['slots']
}

export interface ProseH2Slots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRuntimeConfig, useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'
import UIcon from '../Icon.vue'

const props = defineProps<ProseH2Props>()
defineSlots<ProseH2Slots>()

const appConfig = useAppConfig() as ProseH2['AppConfig']
const uiProp = useComponentUI('prose.h2', props)
const { headings } = useRuntimeConfig().public?.mdc || {}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.h2 || {}) })())

const generate = computed(() => props.id && typeof headings?.anchorLinks === 'object' && headings.anchorLinks.h2)
</script>

<template>
  <h2 :id="id" :class="ui.base({ class: [uiProp?.base, props.class] })">
    <a v-if="id && generate" :href="`#${id}`" :class="ui.link({ class: uiProp?.link })">
      <span :class="ui.leading({ class: uiProp?.leading })">
        <UIcon :name="appConfig.ui.icons.hash" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
      </span>

      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
