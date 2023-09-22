<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <slot name="prev" :on-click="onClickPrev">
      <UButton
        v-if="prevButton"
        :size="size"
        :disabled="!canGoPrev"
        :class="[ui.base, ui.rounded]"
        v-bind="{ ...ui.default.prevButton, ...prevButton }"
        :ui="{ rounded: '' }"
        aria-label="Prev"
        @click="onClickPrev"
      />
    </slot>

    <UButton
      v-for="(page, index) of displayedPages"
      :key="`${page}-${index}`"
      :size="size"
      :label="`${page}`"
      v-bind="page === currentPage ? { ...ui.default.activeButton, ...activeButton } : { ...ui.default.inactiveButton, ...inactiveButton }"
      :class="[{ 'pointer-events-none': typeof page === 'string', 'z-[1]': page === currentPage }, ui.base, ui.rounded]"
      :ui="{ rounded: '' }"
      @click="() => onClickPage(page)"
    />

    <slot name="next" :on-click="onClickNext">
      <UButton
        v-if="nextButton"
        :size="size"
        :disabled="!canGoNext"
        :class="[ui.base, ui.rounded]"
        v-bind="{ ...ui.default.nextButton, ...nextButton }"
        :ui="{ rounded: '' }"
        aria-label="Next"
        @click="onClickNext"
      />
    </slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import UButton from '../elements/Button.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Button, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { pagination, button } from '#ui/ui.config'

const config = mergeConfig<typeof pagination>(appConfig.ui.strategy, appConfig.ui.pagination, pagination)

const buttonConfig = mergeConfig<typeof button>(appConfig.ui.strategy, appConfig.ui.button, button)

export default defineComponent({
  components: {
    UButton
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    pageCount: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      default: 7,
      validate (value) {
        return value >= 7 && value < Number.MAX_VALUE
      }
    },
    size: {
      type: String as PropType<keyof typeof buttonConfig.size>,
      default: () => config.default.size,
      validator (value: string) {
        return Object.keys(buttonConfig.size).includes(value)
      }
    },
    activeButton: {
      type: Object as PropType<Button>,
      default: () => config.default.activeButton as Button
    },
    inactiveButton: {
      type: Object as PropType<Button>,
      default: () => config.default.inactiveButton as Button
    },
    prevButton: {
      type: Object as PropType<Button>,
      default: () => config.default.prevButton as Button
    },
    nextButton: {
      type: Object as PropType<Button>,
      default: () => config.default.nextButton as Button
    },
    divider: {
      type: String,
      default: '…'
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('pagination', props.ui, config, { mergeWrapper: true })

    const currentPage = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const pages = computed(() => Array.from({ length: Math.ceil(props.total / props.pageCount) }, (_, i) => i + 1))

    const displayedPages = computed(() => {
      const totalItems = props.total
      const current = currentPage.value
      const perPage = props.pageCount
      const lastPage = Math.ceil(totalItems / perPage)

      const maxDisplayedPages = Math.min(props.max, perPage)
      const halfDisplayedPages = Math.floor(maxDisplayedPages / 2)
      const startDisplayedPage = Math.max(2, current - halfDisplayedPages)
      const endDisplayedPage = Math.min(startDisplayedPage + maxDisplayedPages - 2, Math.ceil(totalItems / perPage))

      const items = []

      if (totalItems <= maxDisplayedPages) {
        for (let i = 1; i <= totalItems; i++) {
          items.push(i)
        }
        return items
      }

      items.push(1)

      if (current > halfDisplayedPages + 1) {
        items.push(props.divider)
      }

      for (let i = startDisplayedPage; i < endDisplayedPage; i++) {
        items.push(i)
      }

      if (current < lastPage - halfDisplayedPages) {
        items.push(props.divider)
      }

      items.push(lastPage)

      return items
    })

    const canGoPrev = computed(() => currentPage.value > 1)
    const canGoNext = computed(() => currentPage.value < pages.value.length)

    function onClickPage (page: number | string) {
      if (typeof page === 'string') {
        return
      }

      currentPage.value = page
    }

    function onClickPrev () {
      if (!canGoPrev.value) {
        return
      }

      currentPage.value--
    }

    function onClickNext () {
      if (!canGoNext.value) {
        return
      }

      currentPage.value++
    }

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      currentPage,
      pages,
      displayedPages,
      canGoPrev,
      canGoNext,
      onClickPrev,
      onClickNext,
      onClickPage
    }
  }
})
</script>
