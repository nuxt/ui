<template>
  <Transition appear v-bind="ui.transition">
    <div :class="wrapperClass" v-bind="attrs" @mouseover="onMouseover" @mouseleave="onMouseleave">
      <div :class="[ui.container, ui.rounded, ui.ring]">
        <div :class="ui.padding">
          <div class="flex gap-3" :class="{ 'items-start': description || $slots.description, 'items-center': !description && !$slots.description }">
            <UIcon v-if="icon" :name="icon" :class="iconClass" />
            <UAvatar v-if="avatar" v-bind="{ size: ui.avatar.size, ...avatar }" :class="ui.avatar.base" />

            <div class="w-0 flex-1">
              <p :class="ui.title">
                <slot name="title" :title="title">
                  {{ title }}
                </slot>
              </p>
              <p v-if="(description || $slots.description)" :class="ui.description">
                <slot name="description" :description="description">
                  {{ description }}
                </slot>
              </p>

              <div v-if="(description || $slots.description) && actions.length" class="mt-3 flex items-center gap-2">
                <UButton v-for="(action, index) of actions" :key="index" v-bind="{ ...ui.default.actionButton, ...action }" @click.stop="onAction(action)" />
              </div>
            </div>
            <div class="flex-shrink-0 flex items-center gap-3">
              <div v-if="!description && !$slots.description && actions.length" class="flex items-center gap-2">
                <UButton v-for="(action, index) of actions" :key="index" v-bind="{ ...ui.default.actionButton, ...action }" @click.stop="onAction(action)" />
              </div>

              <UButton v-if="closeButton" aria-label="Close" v-bind="{ ...ui.default.closeButton, ...closeButton }" @click.stop="onClose" />
            </div>
          </div>
        </div>
        <div v-if="timeout" :class="progressClass" :style="progressStyle" />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { omit } from 'lodash-es'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import UButton from '../elements/Button.vue'
import { useTimer } from '../../composables/useTimer'
import type { NotificationAction } from '../../types/notification'
import type { Avatar } from '../../types/avatar'
import type { Button } from '../../types/button'
import { defuTwMerge } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

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
      required: true
    },
    description: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: () => appConfig.ui.notification.default.icon
    },
    avatar: {
      type: Object as PropType<Avatar>,
      default: null
    },
    closeButton: {
      type: Object as PropType<Button>,
      default: () => appConfig.ui.notification.default.closeButton
    },
    timeout: {
      type: Number,
      default: 5000
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
      type: String,
      default: () => appConfig.ui.notification.default.color,
      validator (value: string) {
        return ['gray', ...appConfig.ui.colors].includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.notification>>,
      default: () => ({})
    }
  },
  emits: ['close'],
  setup (props, { attrs, emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.notification>>(() => defuTwMerge({}, props.ui, appConfig.ui.notification))

    let timer: any = null
    const remaining = ref(props.timeout)

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.background,
        ui.value.rounded,
        ui.value.shadow
      ), attrs.class as string)
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

    function onMouseover () {
      if (timer) {
        timer.pause()
      }
    }

    function onMouseleave () {
      if (timer) {
        timer.resume()
      }
    }

    function onClose () {
      if (timer) {
        timer.stop()
      }

      if (props.callback) {
        props.callback()
      }

      emit('close')
    }

    function onAction (action: NotificationAction) {
      if (timer) {
        timer.stop()
      }

      if (action.click) {
        action.click()
      }

      emit('close')
    }

    onMounted(() => {
      if (!props.timeout) {
        return
      }

      timer = useTimer(() => {
        onClose()
      }, props.timeout)

      watchEffect(() => {
        remaining.value = timer.remaining.value
      })
    })

    onUnmounted(() => {
      if (timer) {
        timer.stop()
      }
    })

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      wrapperClass,
      progressClass,
      progressStyle,
      iconClass,
      onMouseover,
      onMouseleave,
      onClose,
      onAction
    }
  }
})
</script>
