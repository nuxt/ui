<script lang="ts">
import { tv } from 'tailwind-variants'
import type { PaginationRootProps, PaginationRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import type { RouteLocationRaw } from '#vue-router'
import _appConfig from '#build/app.config'
import theme from '#build/ui/pagination'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { ButtonProps } from '../types'

const appConfig = _appConfig as AppConfig & { ui: { pagination: Partial<typeof theme> } }

const pagination = tv({ extend: tv(theme), ...(appConfig.ui?.pagination || {}) })

export interface PaginationProps extends Partial<Pick<PaginationRootProps, 'defaultPage' | 'disabled' | 'itemsPerPage' | 'page' | 'showEdges' | 'siblingCount' | 'total'>> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon to use for the first page control.
   * @defaultValue appConfig.ui.icons.chevronDoubleLeft
   */
  firstIcon?: string
  /**
   * The icon to use for the previous page control.
   * @defaultValue appConfig.ui.icons.chevronLeft
   */
  prevIcon?: string
  /**
   * The icon to use for the next page control.
   * @defaultValue appConfig.ui.icons.chevronRight
   */
  nextIcon?: string
  /**
   * The icon to use for the last page control.
   * @defaultValue appConfig.ui.icons.chevronDoubleRight
   */
  lastIcon?: string
  /**
   * The icon to use for the ellipsis control.
   * @defaultValue appConfig.ui.icons.ellipsis
   */
  ellipsisIcon?: string
  /**
   * The color of the pagination controls.
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * The variant of the pagination controls.
   * @defaultValue 'outline'
   */
  variant?: ButtonProps['variant']
  /**
   * The color of the active pagination control.
   * @defaultValue 'primary'
   */
  activeColor?: ButtonProps['color']
  /**
   * The variant of the active pagination control.
   * @defaultValue 'solid'
   */
  activeVariant?: ButtonProps['variant']
  /**
   * Whether to show the first, previous, next, and last controls.
   * @defaultValue true
   */
  showControls?: boolean
  size?: ButtonProps['size']
  /**
   * A function to render page controls as links.
   * @param page The page number to navigate to.
   */
  to?: (page: number) => RouteLocationRaw
  class?: any
  ui?: Partial<typeof pagination.slots>
}

export interface PaginationEmits extends PaginationRootEmits {}

export interface PaginationSlots {
  first(props?: {}): any
  prev(props?: {}): any
  next(props?: {}): any
  last(props?: {}): any
  ellipsis(props?: {}): any
  item(props: {
    page: number
    pageCount: number
    item: {
      type: 'ellipsis'
    } | {
      type: 'page'
      value: number
    }
    index: number
  }): any
}

extendDevtoolsMeta({ defaultProps: { total: 50 } })
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { PaginationRoot, PaginationList, PaginationListItem, PaginationFirst, PaginationPrev, PaginationEllipsis, PaginationNext, PaginationLast, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import UButton from './Button.vue'

const props = withDefaults(defineProps<PaginationProps>(), {
  size: 'md',
  color: 'neutral',
  variant: 'outline',
  activeColor: 'primary',
  activeVariant: 'solid',
  showControls: true,
  showEdges: false,
  itemsPerPage: 10,
  siblingCount: 2,
  total: 0
})
const emits = defineEmits<PaginationEmits>()
const slots = defineSlots<PaginationSlots>()

const appConfig = useAppConfig()
const { dir } = useLocale()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultPage', 'disabled', 'itemsPerPage', 'page', 'showEdges', 'siblingCount', 'total'), emits)

const firstIcon = computed(() => props.firstIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft))
const prevIcon = computed(() => props.prevIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft))
const nextIcon = computed(() => props.nextIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight))
const lastIcon = computed(() => props.lastIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight))

// eslint-disable-next-line vue/no-dupe-keys
const ui = pagination()
</script>

<template>
  <PaginationRoot v-slot="{ page, pageCount }" v-bind="rootProps" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <PaginationList v-slot="{ items }" :class="ui.list({ class: props.ui?.list })">
      <PaginationFirst v-if="showControls || !!slots.first" as-child>
        <slot name="first">
          <UButton :color="color" :variant="variant" :size="size" :icon="firstIcon" :to="to?.(1)" />
        </slot>
      </PaginationFirst>
      <PaginationPrev v-if="showControls || !!slots.prev" as-child>
        <slot name="prev">
          <UButton :color="color" :variant="variant" :size="size" :icon="prevIcon" :to="page > 1 ? to?.(page - 1) : undefined" />
        </slot>
      </PaginationPrev>

      <template v-for="(item, index) in items">
        <PaginationListItem v-if="item.type === 'page'" :key="index" as-child :value="item.value">
          <slot name="item" v-bind="{ item, index, page, pageCount }">
            <UButton
              :color="page === item.value ? activeColor : color"
              :variant="page === item.value ? activeVariant : variant"
              :size="size"
              :label="String(item.value)"
              :ui="{ label: ui.label() }"
              :to="to?.(item.value)"
              square
            />
          </slot>
        </PaginationListItem>

        <PaginationEllipsis v-else :key="item.type" :index="index" as-child>
          <slot name="ellipsis">
            <UButton :color="color" :variant="variant" :size="size" :icon="ellipsisIcon || appConfig.ui.icons.ellipsis" :class="ui.ellipsis({ class: props.ui?.ellipsis })" />
          </slot>
        </PaginationEllipsis>
      </template>

      <PaginationNext v-if="showControls || !!slots.next" as-child>
        <slot name="next">
          <UButton :color="color" :variant="variant" :size="size" :icon="nextIcon" :to="page < pageCount ? to?.(pageCount) : undefined" />
        </slot>
      </PaginationNext>
      <PaginationLast v-if="showControls || !!slots.last" as-child>
        <slot name="last">
          <UButton :color="color" :variant="variant" :size="size" :icon="lastIcon" :to=" to?.(pageCount)" />
        </slot>
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
