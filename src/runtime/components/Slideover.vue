<script lang="ts">
import type { DialogRootProps, DialogRootEmits, DialogContentProps, DialogContentEmits } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/slideover'
import type { ButtonProps, IconProps, LinkPropsKeys } from '../types'
import type { EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Slideover = ComponentConfig<typeof theme, AppConfig, 'slideover'>

export interface SlideoverProps extends DialogRootProps {
  title?: string
  description?: string
  /** The content of the slideover. */
  content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DialogContentEmits>>
  /**
   * Render an overlay behind the slideover.
   * @defaultValue true
   */
  overlay?: boolean
  /**
   * Animate the slideover when opening or closing.
   * @defaultValue true
   */
  transition?: boolean
  /**
   * The side of the slideover.
   * @defaultValue 'right'
   */
  side?: Slideover['variants']['side']
  /**
   * Whether to inset the slideover from the edges.
   * @defaultValue false
   */
  inset?: boolean
  /**
   * Render the slideover in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * Display a close button to dismiss the slideover.
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @defaultValue true
   */
  close?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: IconProps['name']
  /**
   * When `false`, the slideover will not close when clicking outside or pressing escape.
   * @defaultValue true
   */
  dismissible?: boolean
  class?: any
  ui?: Slideover['slots']
}

export interface SlideoverEmits extends DialogRootEmits {
  'after:leave': []
  'after:enter': []
  'close:prevent': []
}

export interface SlideoverSlots {
  default?(props: { open: boolean }): VNode[]
  content?(props: { close: () => void }): VNode[]
  header?(props: { close: () => void }): VNode[]
  title?(props?: {}): VNode[]
  description?(props?: {}): VNode[]
  actions?(props?: {}): VNode[]
  close?(props: { ui: Slideover['ui'] }): VNode[]
  body?(props: { close: () => void }): VNode[]
  footer?(props: { close: () => void }): VNode[]
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose, VisuallyHidden } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { FieldGroupReset } from '../composables/useFieldGroup'
import { useLocale } from '../composables/useLocale'
import { usePortal } from '../composables/usePortal'
import { pointerDownOutside } from '../utils/overlay'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<SlideoverProps>(), {
  close: true,
  portal: true,
  overlay: true,
  transition: true,
  modal: true,
  dismissible: true,
  side: 'right'
})
const emits = defineEmits<SlideoverEmits>()
const slots = defineSlots<SlideoverSlots>()

const props = useComponentProps('slideover', _props)

const { t } = useLocale()
const appConfig = useAppConfig() as Slideover['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'open', 'defaultOpen', 'modal'), emits)
const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => props.content)
const contentEvents = computed(() => {
  if (!props.dismissible) {
    const events = ['interactOutside', 'escapeKeyDown']

    return events.reduce((acc, curr) => {
      acc[curr] = (e: Event) => {
        e.preventDefault()
        emits('close:prevent')
      }
      return acc
    }, {} as Record<typeof events[number], (e: Event) => void>)
  }

  return {
    pointerDownOutside
  }
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.slideover || {}) })({
  transition: props.transition,
  side: props.side,
  inset: props.inset
}))
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DialogRoot v-slot="{ open, close }" v-bind="rootProps">
    <DialogTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot :open="open" />
    </DialogTrigger>

    <DialogPortal v-bind="portalProps">
      <FieldGroupReset>
        <DialogOverlay v-if="props.overlay" data-slot="overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

        <DialogContent
          :data-side="props.side"
          data-slot="content"
          :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })"
          v-bind="contentProps"
          @after-enter="emits('after:enter')"
          @after-leave="emits('after:leave')"
          v-on="contentEvents"
        >
          <VisuallyHidden v-if="(!props.title && !slots.title) || (!props.description && !slots.description) || !!slots.content">
            <DialogTitle v-if="!props.title && !slots.title" />
            <DialogTitle v-else-if="!!slots.content">
              <slot name="title">
                {{ props.title }}
              </slot>
            </DialogTitle>

            <DialogDescription v-if="!props.description && !slots.description" />
            <DialogDescription v-else-if="!!slots.content">
              <slot name="description">
                {{ props.description }}
              </slot>
            </DialogDescription>
          </VisuallyHidden>

          <slot name="content" :close="close">
            <div v-if="!!slots.header || (props.title || !!slots.title) || (props.description || !!slots.description) || (props.close || !!slots.close)" data-slot="header" :class="ui.header({ class: props.ui?.header })">
              <slot name="header" :close="close">
                <div v-if="props.title || !!slots.title || props.description || !!slots.description" data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
                  <DialogTitle v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
                    <slot name="title">
                      {{ props.title }}
                    </slot>
                  </DialogTitle>

                  <DialogDescription v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
                    <slot name="description">
                      {{ props.description }}
                    </slot>
                  </DialogDescription>
                </div>

                <slot name="actions" />

                <DialogClose v-if="props.close || !!slots.close" as-child>
                  <slot name="close" :ui="ui">
                    <UButton
                      v-if="props.close"
                      :icon="props.closeIcon || appConfig.ui.icons.close"
                      color="neutral"
                      variant="ghost"
                      :aria-label="t('slideover.close')"
                      v-bind="(typeof props.close === 'object' ? props.close : {})"
                      data-slot="close"
                      :class="ui.close({ class: props.ui?.close })"
                    />
                  </slot>
                </DialogClose>
              </slot>
            </div>

            <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
              <slot name="body" :close="close" />
            </div>

            <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
              <slot name="footer" :close="close" />
            </div>
          </slot>
        </DialogContent>
      </FieldGroupReset>
    </DialogPortal>
  </DialogRoot>
</template>
