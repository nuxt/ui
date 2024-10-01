<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/carousel'
import type { AcceptableValue } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { carousel: Partial<typeof theme> } }

const carousel = tv({ extend: tv(theme), ...(appConfig.ui?.carousel || {}) })

type CarouselVariants = VariantProps<typeof carousel>

export interface CarouselProps<T> {
  orientation?: CarouselVariants['orientation']
  items?: T[]
  class?: any
  ui?: Partial<typeof carousel.slots>
}

export type CarouselEmits = {}

type SlotProps<T> = (props: { item: T, index: number }) => any

export interface CarouselSlots<T> {
  default: SlotProps<T>
  content(props?: {}): any
}

</script>

<script setup lang="ts" generic="T extends AcceptableValue">
import { computed } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'

const props = defineProps<CarouselProps<T>>()
defineEmits<CarouselEmits>()
defineSlots<CarouselSlots<T>>()

const ui = computed(() => carousel(props))

const [emblaRef] = emblaCarouselVue()
</script>

<template>
  <div
    ref="emblaRef"
    role="region"
    aria-roledescription="carousel"
    tabindex="0"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
  >
    <div :class="ui.content({ class: props.ui?.content })">
      <slot name="content">
        <div :class="ui.container({ class: props.ui?.container })">
          <div
            v-for="(item, index) in items"
            :key="index"
            role="group"
            aria-roledescription="slide"
            :class="ui.item({ class: props.ui?.item })"
          >
            <slot :item="item" :index="index" />
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
