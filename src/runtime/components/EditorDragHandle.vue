<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { Editor as TiptapEditor } from '@tiptap/core'
import type { DragHandlePluginProps } from '@tiptap/extension-drag-handle'
import theme from '#build/ui/editor-drag-handle'
import type { ButtonProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type EditorDragHandle = ComponentConfig<typeof theme, AppConfig, 'editorDragHandle'>

export interface EditorDragHandleProps extends Omit<DragHandlePluginProps, 'editor' | 'element' | 'pluginKey' | 'onNodeChange'>, Omit<ButtonProps, 'icon' | 'color' | 'variant'> {
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
  editor: TiptapEditor
  ui?: EditorDragHandle['slots'] & ButtonProps['ui']
}

export interface EditorDragHandleSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import DragHandle from '@tiptap/extension-drag-handle-vue-3'
import { useForwardProps } from 'reka-ui'
import { reactiveOmit, reactivePick } from '@vueuse/core'
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

const dragHandleProps = useForwardProps(reactivePick(props, 'onElementDragEnd', 'onElementDragStart', 'computePositionConfig', 'getReferencedVirtualElement'))
const buttonProps = useForwardProps(reactiveOmit(props, 'icon', 'onElementDragEnd', 'onElementDragStart', 'computePositionConfig', 'getReferencedVirtualElement', 'class'))

const appConfig = useAppConfig() as EditorDragHandle['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.editorDragHandle || {}) })())
</script>

<template>
  <DragHandle
    v-bind="dragHandleProps"
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
