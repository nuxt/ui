<script lang="ts">
import { isVNode, type VNode } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { ToastRootProps, ToastRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/toast'
import type { AvatarProps, ButtonProps, IconProps } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { toast: Partial<typeof theme> } }

const toast = tv({ extend: tv(theme), ...(appConfig.ui?.toast || {}) })

type ToastVariants = VariantProps<typeof toast>

export interface ToastProps extends Omit<ToastRootProps, 'asChild' | 'forceMount'> {
  title?: string
  description?: string | VNode | (() => VNode)
  icon?: IconProps['name']
  avatar?: AvatarProps
  color?: ToastVariants['color']
  actions?: (ButtonProps & { click?: () => void })[]
  close?: ButtonProps | null
  class?: any
  ui?: Partial<typeof toast.slots>
}

export interface ToastEmits extends ToastRootEmits { }
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { UIcon, UAvatar } from '#components'

const props = defineProps<ToastProps>()
const emits = defineEmits<ToastEmits>()

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultOpen', 'duration', 'open', 'type'), emits)

const multiline = computed(() => !!props.title && !!props.description)

const ui = computed(() => tv({ extend: toast, slots: props.ui })({
  color: props.color
}))

const el = ref()
const height = ref(0)

onMounted(() => {
  if (!el.value) {
    return
  }

  setTimeout(() => {
    height.value = el.value.$el.getBoundingClientRect().height
  }, 0)
})

defineExpose({
  height
})
</script>

<template>
  <ToastRoot ref="el" v-bind="rootProps" :class="ui.root({ class: props.class, multiline })" :style="{ '--height': height }">
    <UAvatar v-if="avatar" size="2xl" v-bind="avatar" :class="ui.avatar()" />
    <UIcon v-else-if="icon" :name="icon" :class="ui.icon()" />

    <div :class="ui.wrapper()">
      <ToastTitle v-if="title" :class="ui.title()">
        {{ title }}
      </ToastTitle>
      <template v-if="description">
        <ToastDescription v-if="isVNode(description)" :as="description" />
        <ToastDescription v-else :class="ui.description()">
          {{ description }}
        </ToastDescription>
      </template>

      <div v-if="multiline && actions?.length" :class="ui.actions({ multiline: true })">
        <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
          <UButton size="xs" color="white" v-bind="action" />
        </ToastAction>
      </div>
    </div>

    <div v-if="(!multiline && actions?.length) || close !== null" :class="ui.actions({ multiline: false })">
      <template v-if="!multiline">
        <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
          <UButton size="xs" color="white" v-bind="action" />
        </ToastAction>
      </template>

      <ToastClose as-child>
        <UButton v-if="close !== null" :icon="appConfig.ui.icons.close" size="sm" color="gray" variant="link" aria-label="Close" v-bind="close" :class="ui.close()" @click.stop />
      </ToastClose>
    </div>

    <div :class="ui.progress()" />
    <div :class="ui.mask()" />
  </ToastRoot>
</template>
