<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <slot name="first" :on-click="onClickFirst" :can-go-first="canGoFirstOrPrev">
      <UButton
        v-if="firstButton && showFirst"
        :size="size"
        :to="to?.(1)"
        :disabled="!canGoFirstOrPrev || disabled"
        :class="[ui.base, ui.rounded]"
        v-bind="{ ...(ui.default.firstButton || {}), ...firstButton }"
        :ui="{ rounded: '' }"
        aria-label="First"
        @click="onClickFirst"
      />
    </slot>

    <slot name="prev" :on-click="onClickPrev" :can-go-prev="canGoFirstOrPrev">
      <UButton
        v-if="prevButton"
        :size="size"
        :to="to?.(currentPage - 1)"
        :disabled="!canGoFirstOrPrev || disabled"
        :class="[ui.base, ui.rounded]"
        v-bind="{ ...(ui.default.prevButton || {}), ...prevButton }"
        :ui="{ rounded: '' }"
        aria-label="Prev"
        @click="onClickPrev"
      />
    </slot>

    <UButton
      v-for="(page, index) of displayedPages"
      :key="`${page}-${index}`"
      :to="typeof page === 'number' ? to?.(page) : null"
      :size="size"
      :disabled="disabled"
      :label="`${page}`"
      v-bind="page === currentPage ? { ...(ui.default.activeButton || {}), ...activeButton } : { ...(ui.default.inactiveButton || {}), ...inactiveButton }"
      :class="[{ 'pointer-events-none': typeof page === 'string', 'z-[1]': page === currentPage }, ui.base, ui.rounded]"
      :ui="{ rounded: '' }"
      @click="() => onClickPage(page)"
    />

    <slot name="next" :on-click="onClickNext" :can-go-next="canGoLastOrNext">
      <UButton
        v-if="nextButton"
        :size="size"
        :to="to?.(currentPage + 1)"
        :disabled="!canGoLastOrNext || disabled"
        :class="[ui.base, ui.rounded]"
        v-bind="{ ...(ui.default.nextButton || {}), ...nextButton }"
        :ui="{ rounded: '' }"
        aria-label="Next"
        @click="onClickNext"
      />
    </slot>

    <slot name="last" :on-click="onClickLast" :can-go-last="canGoLastOrNext">
      <UButton
        v-if="lastButton && showLast"
        :size="size"
        :to="to?.(pages.length)"
        :disabled="!canGoLastOrNext || disabled"
        :class="[ui.base, ui.rounded]"
        v-bind="{ ...(ui.default.lastButton || {}), ...lastButton }"
        :ui="{ rounded: '' }"
        aria-label="Last"
        @click="onClickLast"
      />
    </slot>
  </div>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import UButton from '../elements/Button.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Button, ButtonSize, DeepPartial, Strategy } from '../../types/index'
import type { RouteLocationRaw } from '#vue-router'
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
      validate(value) {
        return value >= 5 && value < Number.MAX_VALUE
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: () => config.default.size,
      validator(value: string) {
        return Object.keys(buttonConfig.size).includes(value)
      }
    },
    to: {
      type: Function as PropType<(page: number) => RouteLocationRaw>,
      default: null
    },
    activeButton: {
      type: Object as PropType<Button>,
      default: () => config.default.activeButton as Button
    },
    inactiveButton: {
      type: Object as PropType<Button>,
      default: () => config.default.inactiveButton as Button
    },
    showFirst: {
      type: Boolean,
      default: false
    },
    showLast: {
      type: Boolean,
      default: false
    },
    firstButton: {
      type: Object as PropType<Button>,
      default: () => config.default.firstButton as Button
    },
    lastButton: {
      type: Object as PropType<Button>,
      default: () => config.default.lastButton as Button
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
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { ui, attrs } = useUI('pagination', toRef(props, 'ui'), config, toRef(props, 'class'))

    const currentPage = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })

    const pages = computed(() => Array.from({ length: Math.ceil(props.total / props.pageCount) }, (_, i) => i + 1))

    const displayedPages = computed(() => {
      const totalPages = pages.value.length
      const current = currentPage.value
      const maxDisplayedPages = Math.max(props.max, 5)

      const r = Math.floor((Math.min(maxDisplayedPages, totalPages) - 5) / 2)
      const r1 = current - r
      const r2 = current + r

      const beforeWrapped = r1 - 1 > 1
      const afterWrapped = r2 + 1 < totalPages

      const items: Array<number | string> = []

      if (totalPages <= maxDisplayedPages) {
        for (let i = 1; i <= totalPages; i++) {
          items.push(i)
        }
        return items
      }

      items.push(1)

      if (beforeWrapped) items.push(props.divider)

      if (!afterWrapped) {
        const addedItems = (current + r + 2) - totalPages
        for (let i = current - r - addedItems; i <= current - r - 1; i++) {
          items.push(i)
        }
      }

      for (let i = Math.max(2, r1); i <= Math.min(totalPages, r2); i++) {
        items.push(i)
      }

      if (!beforeWrapped) {
        const addedItems = 1 - (current - r - 2)
        for (let i = current + r + 1; i <= current + r + addedItems; i++) {
          items.push(i)
        }
      }

      if (afterWrapped) items.push(props.divider)

      if (r2 < totalPages) {
        items.push(totalPages)
      }

      // Replace divider by number on start edge case [1, '…', 3, ...]
      if (items.length >= 3 && items[1] === props.divider && items[2] === 3) {
        items[1] = 2
      }

      // Replace divider by number on end edge case [..., 48, '…', 50]
      if (items.length >= 3 && items[items.length - 2] === props.divider && items[items.length - 1] === items.length) {
        items[items.length - 2] = items.length - 1
      }

      return items
    })

    const canGoFirstOrPrev = computed(() => currentPage.value > 1)
    const canGoLastOrNext = computed(() => currentPage.value < pages.value.length)

    function onClickFirst() {
      if (!canGoFirstOrPrev.value) {
        return
      }

      currentPage.value = 1
    }

    function onClickLast() {
      if (!canGoLastOrNext.value) {
        return
      }

      currentPage.value = pages.value.length
    }

    function onClickPage(page: number | string) {
      if (typeof page === 'string') {
        return
      }

      currentPage.value = page
    }

    function onClickPrev() {
      if (!canGoFirstOrPrev.value) {
        return
      }

      currentPage.value--
    }

    function onClickNext() {
      if (!canGoLastOrNext.value) {
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
      canGoLastOrNext,
      canGoFirstOrPrev,
      onClickPrev,
      onClickNext,
      onClickPage,
      onClickFirst,
      onClickLast
    }
  }
})
</script>
