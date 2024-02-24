<template>
  <div :class="alertClass" v-bind="attrs">
    <div class="flex" :class="[_ui.gap, { 'items-start': (description || $slots.description), 'items-center': !description && !$slots.description }]">
      <UIcon v-if="icon" :name="icon" :class="_ui.icon.base" />
      <UAvatar v-if="avatar" v-bind="{ size: _ui.avatar.size, ...avatar }" :class="_ui.avatar.base" />

      <div :class="_ui.inner">
        <p v-if="(title || $slots.title)" :class="_ui.title">
          <slot name="title" :title="title">
            {{ title }}
          </slot>
        </p>
        <p v-if="description || $slots.description" :class="_ui.description">
          <slot name="description" :description="description">
            {{ description }}
          </slot>
        </p>

        <div v-if="(description || $slots.description) && actions.length" :class="_ui.actions">
          <UButton v-for="(action, index) of actions" :key="index" v-bind="{ ...(_ui.default.actionButton || {}), ...action }" @click.stop="onAction(action)" />
        </div>
      </div>
      <div v-if="closeButton || (!description && !$slots.description && actions.length)" :class="twMerge(_ui.actions, 'mt-0')">
        <template v-if="!description && !$slots.description && actions.length">
          <UButton v-for="(action, index) of actions" :key="index" v-bind="{ ...(_ui.default.actionButton || {}), ...action }" @click.stop="onAction(action)" />
        </template>

        <UButton v-if="closeButton" aria-label="Close" v-bind="{ ...(_ui.default.closeButton || {}), ...closeButton }" @click.stop="$emit('close')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import UButton from '../elements/Button.vue'
import { useUI } from '../../composables/useUI'
import type { Avatar, Button, AlertColor, AlertVariant, AlertAction, Strategy } from '../../types'
import { mergeConfig } from '../../utils'
// @ts-expect-error
import appConfig from '#build/app.config'
import { alert } from '#ui/ui.config'

const config = mergeConfig<typeof alert>(appConfig.ui.strategy, appConfig.ui.alert, alert)

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
      default: () => config.default.closeButton as unknown as Button
    },
    actions: {
      type: Array as PropType<AlertAction[]>,
      default: () => []
    },
    color: {
      type: String as PropType<AlertColor>,
      default: () => config.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<AlertVariant>,
      default: () => config.default.variant,
      validator (value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['close'],
  setup (props) {
    const { ui, attrs } = useUI('alert', toRef(props, 'ui'), config)

    const alertClass = computed(() => {
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.rounded,
        ui.value.shadow,
        ui.value.padding,
        variant?.replaceAll('{color}', props.color)
      ), props.class)
    })

    function onAction (action: AlertAction) {
      if (action.click) {
        action.click()
      }
    }

    return {
      _ui: ui,
      attrs,
      alertClass,
      onAction,
      twMerge
    }
  }
})
</script>
