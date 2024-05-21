<script lang="ts">
import { tv } from 'tailwind-variants'
import type { PaginationRootProps, PaginationRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import type { RouteLocationRaw } from '#vue-router'
import _appConfig from '#build/app.config'
import theme from '#build/ui/pagination'
import type { ButtonProps } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { pagination: Partial<typeof theme> } }

const pagination = tv({ extend: tv(theme), ...(appConfig.ui?.pagination || {}) })

export interface PaginationProps extends Omit<PaginationRootProps, 'asChild'> {
  firstIcon?: string
  prevIcon?: string
  nextIcon?: string
  lastIcon?: string
  ellipsisIcon?: string
  color?: ButtonProps['color']
  variant?: ButtonProps['variant']
  activeColor?: ButtonProps['color']
  activeVariant?: ButtonProps['variant']
  showControls?: boolean
  size?: ButtonProps['size']
  class?: any
  to?: (page: number) => RouteLocationRaw
  ui?: Partial<typeof pagination.slots>
}

export interface PaginationEmits extends PaginationRootEmits {}

export interface PaginationSlots {
  first(): any
  prev(): any
  next(): any
  last(): any
  ellipsis(): any
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
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { PaginationRoot, PaginationList, PaginationListItem, PaginationFirst, PaginationPrev, PaginationEllipsis, PaginationNext, PaginationLast, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'

const props = withDefaults(defineProps<PaginationProps>(), {
  color: 'white',
  activeColor: 'black',
  variant: 'solid',
  activeVariant: 'solid',
  showControls: true
})
const emits = defineEmits<PaginationEmits>()
const slots = defineSlots<PaginationSlots>()

const appConfig = useAppConfig()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultPage', 'disabled', 'itemsPerPage', 'page', 'showEdges', 'siblingCount', 'total'), emits)

const ui = computed(() => tv({ extend: pagination, slots: props.ui })())
</script>

<template>
  <PaginationRoot v-slot="{ page, pageCount }" v-bind="rootProps" :class="ui.root({ class: props.class })">
    <PaginationList v-slot="{ items }" :class="ui.list()">
      <PaginationFirst v-if="showControls || !!slots.first" as-child>
        <slot name="first">
          <UButton :color="color" :variant="variant" :size="size" :icon="firstIcon || appConfig.ui.icons.chevronDoubleLeft" :to="to?.(1)" />
        </slot>
      </PaginationFirst>
      <PaginationPrev v-if="showControls || !!slots.prev" as-child>
        <slot name="prev">
          <UButton :color="color" :variant="variant" :size="size" :icon="prevIcon || appConfig.ui.icons.chevronLeft" :to="page > 1 ? to?.(page - 1) : undefined" />
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
            <UButton :color="color" :variant="variant" :size="size" :icon="ellipsisIcon || appConfig.ui.icons.ellipsis" :class="ui.ellipsis()" />
          </slot>
        </PaginationEllipsis>
      </template>

      <PaginationNext v-if="showControls || !!slots.next" as-child>
        <slot name="next">
          <UButton :color="color" :variant="variant" :size="size" :icon="nextIcon || appConfig.ui.icons.chevronRight" :to="page < pageCount ? to?.(pageCount) : undefined" />
        </slot>
      </PaginationNext>
      <PaginationLast v-if="showControls || !!slots.last" as-child>
        <slot name="last">
          <UButton :color="color" :variant="variant" :size="size" :icon="lastIcon || appConfig.ui.icons.chevronDoubleRight" :to=" to?.(pageCount)" />
        </slot>
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
