<template>
  <div :class="ui.wrapper">
    <div ref="carouselRef" :class="ui.carousel">
      <div v-for="(item, index) in items" :key="index" :class="ui.item">
        <slot name="item" :item="item">
          <pre>{{ item }}</pre>
        </slot>
      </div>
    </div>
    <template v-if="showArrows">
      <slot name="prev" :on-click="onClickPrev" :is-disabled="isFirst">
        <UButton
          v-if="prevButton"
          :disabled="isFirst"
          v-bind="{ ...ui.prevButton, ...prevButton }"
          aria-label="Prev"
          @click="onClickPrev"
        />
      </slot>
      <slot name="next" :on-click="onClickNext" :is-disabled="isLast">
        <UButton
          v-if="nextButton"
          :disabled="isLast"
          v-bind="{ ...ui.nextButton, ...nextButton }"
          aria-label="Next"
          @click="onClickNext"
        />
      </slot>
    </template>
    <div v-if="showIndicators" :class="ui.indicatorWrapper">
      <template v-for="indicator in indicatorsCount" :key="indicator">
        <slot name="indicator" :on-click="onSelectItem" :is-current="indicator === currentSlide" :indicator="indicator">
          <button
            type="button"
            :class="[
              { [ui.indicatorActive]: indicator === currentSlide },
              { [ui.indicator]: indicator !== currentSlide },
            ]"
            :aria-label="`set slide ${indicator}`"
            @click="onSelectItem(indicator)"
          />
        </slot>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, toRef, toRefs, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { mergeConfig } from '../../utils'
import UButton from '../elements/Button.vue'
import type { Strategy, Button } from '../../types'
import { useUI } from '../../composables/useUI'
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
      type: Array as PropType<{}[]>,
      default: () => []
    },
    showArrows: {
      type: Boolean,
      default: false
    },
    showIndicators: {
      type: Boolean,
      default: false
    },
    prevButton: {
      type: Object as PropType<Button>,
      default: () => config.prevButton as Button
    },
    nextButton: {
      type: Object as PropType<Button>,
      default: () => config.nextButton as Button
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {

    const { ui } = useUI('carousel', toRef(props, 'ui'), config)

    const carouselRef = ref<HTMLElement>()

    const { x, arrivedState } = useScroll(carouselRef, {
      behavior: 'smooth'
    })

    const { left: isFirst, right: isLast } = toRefs(arrivedState)

    const itemWidth = ref(1)

    useResizeObserver(carouselRef, (entries) => {
      const [entry] = entries
      itemWidth.value = entry?.target?.firstElementChild?.clientWidth || 0
    })

    const currentSlide = computed(() => {
      return Math.round(x.value / itemWidth.value) + 1
    })

    const { width: carouselWidth } = useElementSize(carouselRef)

    const indicatorsCount = computed(() => {
      return props.items.length - Math.round(carouselWidth.value / itemWidth.value) + 1
    })

    function onClickNext () {
      x.value += itemWidth.value
    }

    function onClickPrev () {
      x.value -= itemWidth.value
    }

    function onSelectItem (slideNumber: number) {
      x.value = (slideNumber - 1) * itemWidth.value
    }

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      onClickNext,
      onClickPrev,
      onSelectItem,
      isFirst,
      isLast,
      carouselRef,
      indicatorsCount,
      currentSlide
    }
  }
})
</script>
