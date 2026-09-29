<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/h1'

type ProseH1 = ComponentConfig<typeof theme, AppConfig, 'h1', 'ui.prose'>

export interface ProseH1Props {
  id?: string
  /**
   * Wrap the heading in an anchor link when an `id` is present.
   * @defaultValue false
   */
  anchor?: boolean
  class?: any
  ui?: ProseH1['slots']
}

export interface ProseH1Slots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseH1Props>()

defineSlots<ProseH1Slots>()

const props = useComponentProps('prose.h1', _props, theme)

const appConfig = useThemeConfig() as ProseH1['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.h1)
// NOTE: the `mdc.headings.anchorLinks` fallback is deprecated, remove in v5 in favor of the `anchor` prop.
const { headings } = useRuntimeConfig().public?.mdc || {}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())

const generate = computed(() => props.id && (props.anchor ?? (typeof headings?.anchorLinks === 'boolean' ? headings.anchorLinks : headings?.anchorLinks?.h1) ?? false))
</script>

<template>
  <h1 :id="props.id" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <a v-if="props.id && generate" :href="`#${props.id}`" :class="ui.link({ class: props.ui?.link })">
      <slot />
    </a>
    <slot v-else />
  </h1>
</template>
