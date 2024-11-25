<template>
  <Transition appear v-bind="ui.transition">
    <div
      :class="wrapperClass"
      role="status"
      v-bind="attrs"
      @mouseover="onMouseover"
      @mouseleave="onMouseleave"
    >
      <div :class="[ui.container, ui.rounded, ui.ring]">
        <div class="flex" :class="[ui.padding, ui.gap, { 'items-start': description || $slots.description, 'items-center': !description && !$slots.description }]">
          <UIcon v-if="icon" :name="icon" :class="iconClass" />
          <UAvatar v-if="avatar" v-bind="{ size: ui.avatar.size, ...avatar }" :class="ui.avatar.base" />

          <div :class="ui.inner">
            <p v-if="(title || $slots.title)" :class="ui.title">
              <slot name="title" :title="title">
                {{ title }}
              </slot>
            </p>
            <div v-if="(description || $slots.description)" :class="twMerge(ui.description, !title && !$slots.title && 'mt-0 leading-5')">
              <slot name="description" :description="description">
                {{ description }}
              </slot>
            </div>

            <div v-if="(description || $slots.description) && actions.length" :class="ui.actions">
              <UButton v-for="(action, index) of actions" :key="index" v-bind="{ ...(ui.default.actionButton || {}), ...action }" @click.stop="onAction(action)" />
            </div>
          </div>
          <div v-if="closeButton || (!description && !$slots.description && actions.length)" :class="twMerge(ui.actions, 'mt-0')">
            <template v-if="!description && !$slots.description && actions.length">
              <UButton v-for="(action, index) of actions" :key="index" v-bind="{ ...(ui.default.actionButton || {}), ...action }" @click.stop="onAction(action)" />
            </template>

            <UButton v-if="closeButton" aria-label="Close" v-bind="{ ...(ui.default.closeButton || {}), ...closeButton }" @click.stop="onClose" />
          </div>
        </div>
        <div v-if="timeout" :class="progressClass" :style="progressStyle" />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { ref, computed, toRef, onMounted, onUnmounted, watch, watchEffect, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import UButton from '../elements/Button.vue'
import { useUI } from '../../composables/useUI'
import { useTimer } from '../../composables/useTimer'
import { mergeConfig } from '../../utils'
import type { Avatar, Button, NotificationColor, NotificationAction, Strategy, DeepPartial } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { notification } from '#ui/ui.config'

const config = mergeConfig<typeof notification>(appConfig.ui.strategy, appConfig.ui.notification, notification)

export default defineComponent({
  components: {
    UIcon,
    UAvatar,
    UButton
  },
  inheritAttrs: false,
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: () => config.default.icon
    },
    avatar: {
      type: Object as PropType<Avatar>,
      default: null
    },
    closeButton: {
      type: Object as PropType<Button>,
      default: () => config.default.closeButton as Button
    },
    timeout: {
      type: Number,
      default: () => config.default.timeout
    },
    actions: {
      type: Array as PropType<NotificationAction[]>,
      default: () => []
    },
    callback: {
      type: Function,
      default: null
    },
    color: {
      type: String as PropType<NotificationColor>,
      default: () => config.default.color,
      validator(value: string) {
        return ['gray', ...appConfig.ui.colors].includes(value)
      }
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    },
    pauseTimeoutOnHover: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { ui, attrs } = useUI('notification', toRef(props, 'ui'), config)

    let timer: null | ReturnType<typeof useTimer> = null
    const remaining = ref(props.timeout)

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.background?.replaceAll('{color}', props.color),
        ui.value.rounded,
        ui.value.shadow,
        ui.value.ring?.replaceAll('{color}', props.color)
      ), props.class)
    })

    const progressClass = computed(() => {
      return twJoin(
        ui.value.progress.base,
        ui.value.progress.background?.replaceAll('{color}', props.color)
      )
    })

    const progressStyle = computed(() => {
      const remainingPercent = remaining.value / props.timeout * 100

      return { width: `${remainingPercent || 0}%` }
    })

    const iconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        ui.value.icon.color?.replaceAll('{color}', props.color)
      )
    })

    function onMouseover() {
      if (props.pauseTimeoutOnHover && timer) {
        timer.pause()
      }
    }

    function onMouseleave() {
      if (props.pauseTimeoutOnHover && timer) {
        timer.resume()
      }
    }

    function onClose() {
      if (timer) {
        timer.stop()
      }

      if (props.callback) {
        props.callback()
      }

      emit('close')
    }

    function onAction(action: NotificationAction) {
      if (timer) {
        timer.stop()
      }

      if (action.click) {
        action.click()
      }

      emit('close')
    }

    function initTimer() {
      if (timer) {
        timer.stop()
      }

      if (!props.timeout) {
        return
      }

      timer = useTimer(() => {
        onClose()
      }, props.timeout)

      watchEffect(() => {
        remaining.value = timer.remaining.value
      })
    }

    watch(() => props.timeout, initTimer)

    onMounted(initTimer)

    onUnmounted(() => {
      if (timer) {
        timer.stop()
      }
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      wrapperClass,
      progressClass,
      progressStyle,
      iconClass,
      onMouseover,
      onMouseleave,
      onClose,
      onAction,
      twMerge
    }
  }
})
</script>
