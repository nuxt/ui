<template>
  <div :class="alertClass" v-bind="attrs">
    <div class="flex gap-3" :class="{ 'items-start': (description || $slots.description), 'items-center': !description && !$slots.description }">
      <UIcon v-if="icon" :name="icon" :class="ui.icon.base" />
      <UAvatar v-if="avatar" v-bind="{ size: ui.avatar.size, ...avatar }" :class="ui.avatar.base" />

      <div class="w-0 flex-1">
        <p :class="ui.title">
          <slot name="title" :title="title">
            {{ title }}
          </slot>
        </p>
        <p v-if="description || $slots.description" :class="ui.description">
          <slot name="description" :description="description">
            {{ description }}
          </slot>
        </p>

        <div v-if="(description || $slots.description) && actions.length" class="mt-3 flex items-center gap-2">
          <UButton v-for="(action, index) of actions" :key="index" v-bind="{ ...ui.default.actionButton, ...action }" @click.stop="action.click" />
        </div>
      </div>
      <div class="flex-shrink-0 flex items-center gap-3">
        <div v-if="!description && !$slots.description && actions.length" class="flex items-center gap-2">
          <UButton v-for="(action, index) of actions" :key="index" v-bind="{ ...ui.default.actionButton, ...action }" @click.stop="action.click" />
        </div>

        <UButton v-if="closeButton" aria-label="Close" v-bind="{ ...ui.default.closeButton, ...closeButton }" @click.stop="$emit('close')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import UButton from '../elements/Button.vue'
import type { Avatar } from '../../types/avatar'
import type { Button } from '../../types/button'
import { defuTwMerge } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'
import { omit } from 'lodash-es'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    UIcon,
    UAvatar,
    UButton
  },
  inheritAttrs: false,
  props: {
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
      default: () => appConfig.ui.alert.default.icon
    },
    avatar: {
      type: Object as PropType<Avatar>,
      default: null
    },
    closeButton: {
      type: Object as PropType<Button>,
      default: () => appConfig.ui.alert.default.closeButton
    },
    actions: {
      type: Array as PropType<(Button & { click?: Function })[]>,
      default: () => []
    },
    color: {
      type: String,
      default: () => appConfig.ui.alert.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(appConfig.ui.alert.color)].includes(value)
      }
    },
    variant: {
      type: String,
      default: () => appConfig.ui.alert.default.variant,
      validator (value: string) {
        return [
          ...Object.keys(appConfig.ui.alert.variant),
          ...Object.values(appConfig.ui.alert.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.alert>>,
      default: () => ({})
    }
  },
  emits: ['close'],
  setup (props, { attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.alert>>(() => defuTwMerge({}, props.ui, appConfig.ui.alert))

    const alertClass = computed(() => {
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.rounded,
        ui.value.shadow,
        ui.value.padding,
        variant?.replaceAll('{color}', props.color)
      ), attrs.class as string)
    })

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      alertClass
    }
  }
})
</script>
