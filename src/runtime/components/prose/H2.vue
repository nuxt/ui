<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/h2'
import type { ComponentConfig } from '../../types/tv'

type ProseH2 = ComponentConfig<typeof theme, AppConfig, 'h2', 'ui.prose'>

export interface ProseH2Props {
  id?: string
  /**
   * Wrap the heading in an anchor link when an `id` is present.
   * `@nuxt/content` and `@nuxtjs/mdc` enable this for H2–H4 by default.
   * @defaultValue false
   */
  anchor?: boolean
  class?: any
  ui?: ProseH2['slots']
}

export interface ProseH2Slots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRuntimeConfig, useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'
import UIcon from '../Icon.vue'

const _props = defineProps<ProseH2Props>()

defineSlots<ProseH2Slots>()

const props = useComponentProps('prose.h2', _props)

const appConfig = useAppConfig() as ProseH2['AppConfig']
// NOTE: the `mdc.headings.anchorLinks` fallback is deprecated, remove in v5 in favor of the `anchor` prop.
const { headings } = useRuntimeConfig().public?.mdc || {}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.prose?.h2 || {}) })())

const generate = computed(() => props.id && (props.anchor ?? (typeof headings?.anchorLinks === 'boolean' ? headings.anchorLinks : headings?.anchorLinks?.h2) ?? false))
</script>

<template>
  <h2 :id="props.id" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <a v-if="props.id && generate" :href="`#${props.id}`" :class="ui.link({ class: props.ui?.link })">
      <span :class="ui.leading({ class: props.ui?.leading })">
        <UIcon :name="appConfig.ui.icons.hash" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      </span>

      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
