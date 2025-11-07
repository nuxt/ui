<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { AutoPlacementOptions, FlipOptions, HideOptions, InlineOptions, Middleware, OffsetOptions, Placement, ShiftOptions, SizeOptions, Strategy } from '@floating-ui/dom'
import type { Editor as TiptapEditor } from '@tiptap/core'
import type { DragHandlePluginProps } from '@tiptap/extension-drag-handle'
import theme from '#build/ui/editor-drag-handle'
import type { ButtonProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type EditorDragHandle = ComponentConfig<typeof theme, AppConfig, 'editorDragHandle'>

type EditorDragHandleOptions = {
  strategy?: Strategy
  placement?: Placement
  offset?: OffsetOptions | boolean
  flip?: FlipOptions | boolean
  shift?: ShiftOptions | boolean
  size?: SizeOptions | boolean
  autoPlacement?: AutoPlacementOptions | boolean
  hide?: HideOptions | boolean
  inline?: InlineOptions | boolean
}

export interface EditorDragHandleProps extends Omit<DragHandlePluginProps, 'editor' | 'element' | 'pluginKey' | 'onNodeChange' | 'computePositionConfig'>, Omit<ButtonProps, 'icon' | 'color' | 'variant'> {
  /**
   * @defaultValue appConfig.ui.icons.drag
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
  /**
   * The options for positioning the drag handle. Those are passed to Floating UI and include options for the placement, offset, flip, shift, size, autoPlacement, hide, and inline middleware.
   * @defaultValue { strategy: 'absolute', placement: 'left-start', offset: 8 }
   * @see https://floating-ui.com/docs/computePosition#options
   */
  options?: EditorDragHandleOptions
  editor: TiptapEditor
  ui?: EditorDragHandle['slots'] & ButtonProps['ui']
}

export interface EditorDragHandleSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { autoPlacement, flip, hide, inline, offset, shift, size } from '@floating-ui/dom'
import DragHandle from '@tiptap/extension-drag-handle-vue-3'
import { useForwardProps } from 'reka-ui'
import { reactiveOmit, reactivePick } from '@vueuse/core'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditorDragHandleProps>(), {
  color: 'neutral',
  variant: 'ghost',
  side: 'left',
  size: 'xs'
})
defineSlots<EditorDragHandleSlots>()

const dragHandleProps = useForwardProps(reactivePick(props, 'onElementDragEnd', 'onElementDragStart', 'getReferencedVirtualElement'))
const buttonProps = useForwardProps(reactiveOmit(props, 'icon', 'options', 'onElementDragEnd', 'onElementDragStart', 'getReferencedVirtualElement', 'class'))

const appConfig = useAppConfig() as EditorDragHandle['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editorDragHandle || {}) })())

const floatingUIOptions = computed(() => defu(props.options, {
  strategy: 'absolute' as Strategy,
  placement: 'left-start' as Placement,
  offset: {
    alignmentAxis: 2,
    mainAxis: 8
  }
} as EditorDragHandleOptions))

const middleware = computed(() => {
  const result: Middleware[] = []

  if (floatingUIOptions.value.flip) {
    result.push(flip(typeof floatingUIOptions.value.flip !== 'boolean' ? floatingUIOptions.value.flip : undefined))
  }

  if (floatingUIOptions.value.shift) {
    result.push(shift(typeof floatingUIOptions.value.shift !== 'boolean' ? floatingUIOptions.value.shift : undefined))
  }

  if (floatingUIOptions.value.offset) {
    result.push(offset(typeof floatingUIOptions.value.offset !== 'boolean' ? floatingUIOptions.value.offset : undefined))
  }

  if (floatingUIOptions.value.size) {
    result.push(size(typeof floatingUIOptions.value.size !== 'boolean' ? floatingUIOptions.value.size : undefined))
  }

  if (floatingUIOptions.value.autoPlacement) {
    result.push(autoPlacement(typeof floatingUIOptions.value.autoPlacement !== 'boolean' ? floatingUIOptions.value.autoPlacement : undefined))
  }

  if (floatingUIOptions.value.hide) {
    result.push(hide(typeof floatingUIOptions.value.hide !== 'boolean' ? floatingUIOptions.value.hide : undefined))
  }

  if (floatingUIOptions.value.inline) {
    result.push(inline(typeof floatingUIOptions.value.inline !== 'boolean' ? floatingUIOptions.value.inline : undefined))
  }

  return result
})

const computePositionConfig = computed<DragHandlePluginProps['computePositionConfig']>(() => ({
  placement: floatingUIOptions.value.placement,
  strategy: floatingUIOptions.value.strategy,
  middleware: middleware.value
}))
</script>

<template>
  <DragHandle
    v-bind="dragHandleProps"
    :compute-position-config="computePositionConfig"
    :editor="editor"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <slot>
      <UButton
        v-bind="{
          ...buttonProps,
          icon: props.icon || appConfig.ui.icons.drag,
          ...$attrs
        }"
        :class="ui.handle({ class: [props.ui?.handle, props.class] })"
      />
    </slot>
  </DragHandle>
</template>
