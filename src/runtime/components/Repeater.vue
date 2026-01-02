<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/repeater'
import type { ComponentConfig } from '../types/tv'

type Repeater = ComponentConfig<typeof theme, AppConfig, 'repeater'>

export interface RepeaterProps {
  /**
   * The list of items to display and edit
   */
  modelValue?: any[]
  /**
   * A factory function to generate a new object when adding an item
   */
  newItemTemplate?: () => any
  /**
   * Enable or disable drag-and-drop functionality
   * @default true
   */
  dragEnabled?: boolean
  /**
   * Controls the visibility of the Add button
   * @default true
   */
  addButton?: boolean
  /**
   * Add button text
   * @default 'Add Item'
   */
  addButtonLabel?: string
  /**
   * Controls the visibility of the Delete button for each item
   * @default true
   */
  removeButton?: boolean
  /**
   * Controls the visibility of the Sort (Up/Down) buttons
   * @default true
   */
  sortButtons?: boolean
  /**
   * Icon for moving item up
   */
  sortUpIcon?: string
  /**
   * Icon for moving item down
   */
  sortDownIcon?: string
  /**
   * The maximum number of allowed items
   * @default Infinity
   */
  maxItems?: number
  /**
   * The minimum number of allowed items
   * @default 0
   */
  minItems?: number
  /**
   * Disable the entire component
   */
  disabled?: boolean
  /**
   * Icon names for different sections
   */
  handleIcon?: string
  addIcon?: string
  removeIcon?: string
  /**
   * The visual style variant (derived from the theme configuration)
   */
  variant?: Repeater['variants']['variant']
  /**
   * The size of the component (derived from the theme configuration)
   */
  size?: Repeater['variants']['size']
  /**
   * Class name for the drop placeholder
   * @default ''
   */
  ghostClass?: string
  /**
   * Class name for the cloned element being dragged
   * @default ''
   */
  fallbackClass?: string
  /**
   * Class name for the element while dragging
   * @default ''
   */
  dragClass?: string
  /**
   * Animation speed in milliseconds
   * @default 200
   */
  animation?: number
  /**
   * Custom CSS classes to apply to the component
   */
  class?: any
  /**
   * Override default theme slots
   */
  ui?: Repeater['slots']
}

export interface RepeaterEmits {
  (e: 'update:modelValue', value: any[]): void
  (e: 'item-added', item: any, index: number): void
  (e: 'item-removed', item: any, index: number): void
  (e: 'order-changed', value: any[]): void
  (e: 'drag-start', event: any): void
  (e: 'drag-end', event: any): void
}

export interface RepeaterSlots<T> {
  'default'(props: { item: T, index: number }): any
  'header'(props: { item: T, index: number }): any
  'header-actions'(props: { item: T, index: number }): any
  'footer'(props: { item: T, index: number }): any
  'actions'(props: { item: T, index: number, remove: () => void, moveUp: () => void, moveDown: () => void }): any
  'add-button'(props: { add: () => void, canAdd: boolean, disabled: boolean }): any
  'empty'(props: {}): any
}
</script>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, useId, toRef } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UButton from './Button.vue'

const props = withDefaults(defineProps<RepeaterProps>(), {
  modelValue: () => [],
  newItemTemplate: () => ({}),
  dragEnabled: true,
  addButton: true,
  removeButton: true,
  sortButtons: true,
  sortUpIcon: 'i-heroicons-chevron-up',
  sortDownIcon: 'i-heroicons-chevron-down',
  maxItems: Infinity,
  minItems: 0,
  addButtonLabel: 'Add Item',
  handleIcon: 'i-heroicons-bars-2',
  addIcon: 'i-heroicons-plus',
  removeIcon: 'i-heroicons-trash',
  variant: 'outline',
  size: 'md',
  ghostClass: '',
  fallbackClass: '',
  dragClass: '',
  animation: 200
})

const emits = defineEmits<RepeaterEmits>()
const slots = defineSlots<RepeaterSlots<T>>()

const appConfig = useAppConfig() as Repeater['AppConfig']
const instanceId = useId()
const uniqueHandleClass = `drag-handle-${instanceId}`

const ui = computed(() => {
  const uiConfig = tv({
    extend: tv(theme),
    ...(appConfig.ui?.repeater || {})
  })

  return uiConfig({
    variant: props.variant,
    size: props.size,
    disabled: props.disabled
  })
})

const items = defineModel<T[]>('modelValue', { required: true })
const containerRef = ref<HTMLElement | null>(null)

const canAdd = computed(() => !props.disabled && items.value.length < props.maxItems)
const canRemove = computed(() => !props.disabled && items.value.length > props.minItems)

const actions = {
  add: () => {
    if (!canAdd.value) return
    const newItem = JSON.parse(JSON.stringify(props.newItemTemplate()))
    items.value.push(newItem)
    emits('item-added', newItem, items.value.length - 1)
  },
  remove: (index: number) => {
    if (!canRemove.value) return
    const item = items.value[index]
    items.value.splice(index, 1)
    emits('item-removed', item, index)
  },
  move: (index: number, direction: -1 | 1) => {
    if (props.disabled) return
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= items.value.length) return

    const item = items.value[index]
    items.value.splice(index, 1)
    items.value.splice(newIndex, 0, item!)
    emits('order-changed', items.value)
  }
}

const { stop } = useSortable(containerRef, items, {
  handle: `.${uniqueHandleClass}`,
  disabled: !props.dragEnabled || props.disabled,
  animation: props.animation,
  ghostClass: props.ghostClass,
  fallbackClass: props.fallbackClass,
  dragClass: props.dragClass,
  forceFallback: true,
  fallbackOnBody: true,
  fallbackTolerance: 3,
  onStart: (e: any) => emits('drag-start', e),
  onEnd: (e: any) => {
    emits('drag-end', e)
    emits('order-changed', items.value)
  }
})

defineExpose(actions)
</script>

<template>
  <div data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div ref="containerRef" data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div
        v-for="(item, index) in items"
        :key="(item as any).id ? (item as any).id : item"
        data-slot="item"
        :class="ui.item({ class: props.ui?.item })"
      >
        <div v-if="slots.header || dragEnabled" data-slot="header" :class="ui.header({ class: props.ui?.header })">
          <div :class="ui.headerInner({ class: props.ui?.headerInner })">
            <button
              v-if="dragEnabled && !disabled"
              type="button"
              :class="[uniqueHandleClass, ui.handle({ class: props.ui?.handle })]"
              style="touch-action: none"
            >
              <UIcon :name="handleIcon" :class="ui.handleIcon({ class: props.ui?.handleIcon })" />
            </button>

            <div data-slot="headerContent" :class="ui.headerContent({ class: props.ui?.headerContent })">
              <slot name="header" :item="item" :index="index">
                <span class="text-sm font-medium">Item {{ index + 1 }}</span>
              </slot>
            </div>

            <slot name="header-actions" :item="item" :index="index" />
          </div>
        </div>

        <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
          <slot :item="item" :index="index" />
        </div>

        <div
          v-if="slots.footer || removeButton || sortButtons"
          data-slot="footer"
          :class="ui.footer({ class: props.ui?.footer })"
        >
          <div :class="ui.footerInner({ class: props.ui?.footerInner })">
            <slot name="footer" :item="item" :index="index" />
          </div>

          <div :class="ui.actions({ class: props.ui?.actions })">
            <slot
              name="actions"
              :item="item"
              :index="index"
              :remove="() => actions.remove(index)"
              :move-up="() => actions.move(index, -1)"
              :move-down="() => actions.move(index, 1)"
            >
              <template v-if="sortButtons">
                <UButton
                  :icon="sortUpIcon"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :disabled="index === 0 || disabled"
                  @click="actions.move(index, -1)"
                />
                <UButton
                  :icon="sortDownIcon"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :disabled="index === items.length - 1 || disabled"
                  @click="actions.move(index, 1)"
                />
              </template>

              <UButton
                v-if="removeButton"
                :icon="removeIcon"
                color="error"
                variant="ghost"
                size="xs"
                :disabled="!canRemove || disabled"
                @click="actions.remove(index)"
              />
            </slot>
          </div>
        </div>
      </div>
    </div>

    <div v-if="items.length === 0" data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
      <slot name="empty">
        No items added yet
      </slot>
    </div>

    <div v-if="addButton" data-slot="addButton" :class="ui.addButton({ class: props.ui?.addButton })">
      <slot name="add-button" :add="actions.add" :can-add="canAdd" :disabled="disabled || !canAdd">
        <UButton
          :label="addButtonLabel"
          :icon="addIcon"
          variant="soft"
          color="neutral"
          :disabled="!canAdd || disabled"
          @click="actions.add"
        />
      </slot>
    </div>
  </div>
</template>
