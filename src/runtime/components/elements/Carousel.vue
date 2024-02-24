<template>
  <div :class="_ui.wrapper" v-bind="attrs">
    <div ref="carouselRef" :class="_ui.container" class="no-scrollbar">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="_ui.item"
      >
        <slot :item="item" :index="index" />
      </div>
    </div>

    <div v-if="arrows" :class="_ui.arrows.wrapper">
      <slot name="prev" :on-click="onClickPrev" :disabled="isFirst">
        <UButton
          v-if="prevButton"
          :disabled="isFirst"
          v-bind="{ ..._ui.default.prevButton, ...prevButton }"
          :class="twMerge(_ui.default.prevButton.class, prevButton?.class)"
          aria-label="Prev"
          @click="onClickPrev"
        />
      </slot>

      <slot name="next" :on-click="onClickNext" :disabled="isLast">
        <UButton
          v-if="nextButton"
          :disabled="isLast"
          v-bind="{ ..._ui.default.nextButton, ...nextButton }"
          :class="twMerge(_ui.default.nextButton.class, nextButton?.class)"
          aria-label="Next"
          @click="onClickNext"
        />
      </slot>
    </div>

    <div v-if="indicators" :class="_ui.indicators.wrapper">
      <template v-for="page in pages" :key="page">
        <slot name="indicator" :on-click="onClick" :active="page === currentPage" :page="page">
          <button
            type="button"
            :class="[
              _ui.indicators.base,
              page === currentPage ? _ui.indicators.active : _ui.indicators.inactive
            ]"
            :aria-label="`set slide ${page}`"
            @click="onClick(page)"
          />
        </slot>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, toRef, toRefs, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge } from 'tailwind-merge'
import { mergeConfig } from '../../utils'
import UButton from '../elements/Button.vue'
import type { Strategy, Button } from '../../types'
import { useUI } from '../../composables/useUI'
import { useCarouselScroll } from '../../composables/useCarouselScroll'
import { useScroll, useResizeObserver, useElementSize } from '@vueuse/core'
// @ts-expect-error
import appConfig from '#build/app.config'
import { carousel } from '#ui/ui.config'

const config = mergeConfig<typeof carousel>(appConfig.ui.strategy, appConfig.ui.carousel, carousel)

export default defineComponent({
  components: {
    UButton
  },
  inheritAttrs: false,
  props: {
    items: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    arrows: {
      type: Boolean,
      default: false
    },
    indicators: {
      type: Boolean,
      default: false
    },
    prevButton: {
      type: Object as PropType<Button & { class?: string }>,
      default: () => config.default.prevButton as Button & { class?: string }
    },
    nextButton: {
      type: Object as PropType<Button & { class?: string }>,
      default: () => config.default.nextButton as Button & { class?: string }
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props, { expose }) {
    const { ui, attrs } = useUI('carousel', toRef(props, 'ui'), config, toRef(props, 'class'))

    const carouselRef = ref<HTMLElement>()
    const itemWidth = ref(0)

    const { x, arrivedState } = useScroll(carouselRef, { behavior: 'smooth' })
    const { width: carouselWidth } = useElementSize(carouselRef)

    const { left: isFirst, right: isLast } = toRefs(arrivedState)

    useCarouselScroll(carouselRef)

    useResizeObserver(carouselRef, (entries) => {
      const [entry] = entries

      itemWidth.value = entry?.target?.firstElementChild?.clientWidth || 0
    })

    const currentPage = computed(() => Math.round(x.value / itemWidth.value) + 1)

    const pages = computed(() => {
      if (!itemWidth.value) {
        return 0
      }

      return props.items.length - Math.round(carouselWidth.value / itemWidth.value) + 1
    })

    function onClickNext () {
      x.value += itemWidth.value
    }

    function onClickPrev () {
      x.value -= itemWidth.value
    }

    function onClick (page: number) {
      x.value = (page - 1) * itemWidth.value
    }

    expose({
      pages,
      page: currentPage,
      prev: onClickPrev,
      next: onClickNext,
      select: onClick
    })

    return {
      _ui: ui,
      attrs,
      isFirst,
      isLast,
      carouselRef,
      pages,
      currentPage,
      onClickNext,
      onClickPrev,
      onClick,
      twMerge
    }
  }
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
