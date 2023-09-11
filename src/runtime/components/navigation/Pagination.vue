<template>
  <div :class="wrapperClass" v-bind="attrs">
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
import { omit } from 'lodash-es'
import { twMerge } from 'tailwind-merge'
import UButton from '../elements/Button.vue'
import { defuTwMerge } from '../../utils'
import type { Button } from '../../types/button'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

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
      type: String,
      default: () => appConfig.ui.pagination.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.button.size).includes(value)
      }
    },
    activeButton: {
      type: Object as PropType<Button>,
      default: () => appConfig.ui.pagination.default.activeButton
    },
    inactiveButton: {
      type: Object as PropType<Button>,
      default: () => appConfig.ui.pagination.default.inactiveButton
    },
    prevButton: {
      type: Object as PropType<Button>,
      default: () => appConfig.ui.pagination.default.prevButton
    },
    nextButton: {
      type: Object as PropType<Button>,
      default: () => appConfig.ui.pagination.default.nextButton
    },
    divider: {
      type: String,
      default: '…'
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.pagination>>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  setup (props, { attrs, emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.pagination>>(() => defuTwMerge({}, props.ui, appConfig.ui.pagination))

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
      if (!props.max || pages.value.length <= 5) {
        return pages.value
      } else {
        const current = currentPage.value
        const max = pages.value.length
        const r = Math.floor((Math.min(props.max, max) - 5) / 2)
        const r1 = current - r
        const r2 = current + r
        const beforeWrapped = r1 - 1 > 1
        const afterWrapped = r2 + 1 < max
        const items: Array<number | string> = [1]

        if (beforeWrapped) items.push(props.divider)

        if (!afterWrapped) {
          const addedItems = (current + r + 2) - max
          for (let i = current - r - addedItems; i <= current - r - 1; i++) {
            items.push(i)
          }
        }

        for (let i = r1 > 2 ? (r1) : 2; i <= Math.min(max, r2); i++) {
          items.push(i)
        }

        if (!beforeWrapped) {
          const addedItems = 1 - (current - r - 2)
          for (let i = current + r + 1; i <= current + r + addedItems; i++) {
            items.push(i)
          }
        }

        if (afterWrapped) items.push(props.divider)

        if (r2 < max) items.push(max)

        // Replace divider by number on start edge case [1, '…', 3, ...]
        if (items.length >= 3 && items[1] === props.divider && items[2] === 3) {
          items[1] = 2
        }
        // Replace divider by number on end edge case [..., 48, '…', 50]
        if (items.length >= 3 && items[items.length - 2] === props.divider && items[items.length - 1] === items.length) {
          items[items.length - 2] = items.length - 1
        }

        return items
      }
    })

    const canGoPrev = computed(() => currentPage.value > 1)
    const canGoNext = computed(() => currentPage.value < pages.value.length)

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

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
      attrs: omit(attrs, ['class']),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      currentPage,
      pages,
      displayedPages,
      canGoPrev,
      canGoNext,
      wrapperClass,
      onClickPrev,
      onClickNext,
      onClickPage
    }
  }
})
</script>
