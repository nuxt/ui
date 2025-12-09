<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-logos'
import type { MarqueeProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type PageLogos = ComponentConfig<typeof theme, AppConfig, 'pageLogos'>

type PageLogosItem = {
  src: string
  alt: string
} | string

export interface PageLogosProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  title?: string
  items?: PageLogosItem[]
  marquee?: boolean | MarqueeProps
  class?: any
  ui?: PageLogos['slots']
}

export interface PageLogosSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UMarquee from './Marquee.vue'
import UAvatar from './Avatar.vue'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate()

const props = withDefaults(defineProps<PageLogosProps>(), {
  marquee: false
})
const slots = defineSlots<PageLogosSlots>()

const appConfig = useAppConfig() as PageLogos['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageLogos || {}) })())
</script>

<template>
  <DefineCreateItemTemplate>
    <slot v-if="!!slots.default" />
    <template v-else-if="items?.length">
      <template v-for="(item, index) in items" :key="index">
        <UAvatar
          v-if="typeof item === 'object'"
          :src="item.src"
          :alt="item.alt"
          data-slot="logo"
          :class="ui.logo({ class: props.ui?.logo })"
        />
        <UIcon
          v-else
          :name="item"
          data-slot="logo"
          :class="ui.logo({ class: props.ui?.logo })"
        />
      </template>
    </template>
  </DefineCreateItemTemplate>

  <Primitive :as="as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <h2 v-if="title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
      {{ title }}
    </h2>

    <UMarquee
      v-if="marquee"
      v-bind="typeof marquee === 'object' ? marquee : {}"
      data-slot="logos"
      :class="ui.logos({ class: props.ui?.logos, marquee: true })"
    >
      <ReuseCreateItemTemplate :items="items" />
    </UMarquee>
    <div v-else data-slot="logos" :class="ui.logos({ class: props.ui?.logos })">
      <ReuseCreateItemTemplate :items="items" />
    </div>
  </Primitive>
</template>
