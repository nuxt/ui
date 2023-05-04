<template>
  <component
    :is="buttonIs"
    ref="button"
    :class="buttonClass"
    :aria-label="ariaLabel"
    v-bind="buttonProps"
  >
    <Icon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="leadingIconClass" aria-hidden="true" />
    <slot>
      <span v-if="label" :class="[truncate ? 'text-left break-all line-clamp-1' : '']">
        {{ label }}
      </span>
    </slot>
    <Icon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="trailingIconClass" aria-hidden="true" />
  </component>
</template>

<script lang="ts">
import { ref, computed, defineComponent, useSlots } from 'vue'
import type { PropType } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { defu } from 'defu'
import Icon from '../elements/Icon.vue'
import { classNames } from '../../utils'
import { NuxtLink } from '#components'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    Icon
  },
  props: {
    type: {
      type: String,
      default: 'button'
    },
    block: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    padded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: () => appConfig.ui.button.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.button.size).includes(value)
      }
    },
    color: {
      type: String,
      default: () => appConfig.ui.button.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(appConfig.ui.button.color)].includes(value)
      }
    },
    variant: {
      type: String,
      default: () => appConfig.ui.button.default.variant,
      validator (value: string) {
        return Object.keys(appConfig.ui.button.variant).includes(value)
      }
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => appConfig.ui.button.default.loadingIcon
    },
    leadingIcon: {
      type: String,
      default: null
    },
    trailingIcon: {
      type: String,
      default: null
    },
    trailing: {
      type: Boolean,
      default: false
    },
    leading: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object] as PropType<string | RouteLocationNormalized | RouteLocationRaw>,
      default: null
    },
    target: {
      type: String,
      default: null
    },
    ariaLabel: {
      type: String,
      default: null
    },
    square: {
      type: Boolean,
      default: false
    },
    truncate: {
      type: Boolean,
      default: false
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.button>>,
      default: () => appConfig.ui.button
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.button>>(() => defu({}, props.ui, appConfig.ui.button))

    const slots = useSlots()

    const button = ref(null)

    const buttonIs = computed(() => {
      if (props.to) {
        return NuxtLink
      }

      return 'button'
    })

    const buttonProps = computed(() => {
      if (props.to) {
        return { to: props.to, target: props.target }
      } else {
        return { disabled: props.disabled || props.loading, type: props.type }
      }
    })

    const isLeading = computed(() => {
      return (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing) || props.leadingIcon
    })

    const isTrailing = computed(() => {
      return (props.icon && props.trailing) || (props.loading && props.trailing) || props.trailingIcon
    })

    const isSquare = computed(() => props.square || (!slots.default && !props.label))

    const buttonClass = computed(() => {
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return classNames(
        ui.value.base,
        ui.value.font,
        ui.value.rounded,
        ui.value.size[props.size],
        ui.value.gap[props.size],
        props.padded && ui.value[isSquare.value ? 'square' : 'spacing'][props.size],
        variant?.replaceAll('{color}', props.color),
        props.block ? 'w-full flex justify-center items-center' : 'inline-flex items-center'
      )
    })

    const leadingIconName = computed(() => {
      if (props.loading) {
        return props.loadingIcon
      }

      return props.leadingIcon || props.icon
    })

    const trailingIconName = computed(() => {
      if (props.loading && !isLeading.value) {
        return props.loadingIcon
      }

      return props.trailingIcon || props.icon
    })

    const leadingIconClass = computed(() => {
      return classNames(
        ui.value.icon.base,
        ui.value.icon.size[props.size],
        props.loading && 'animate-spin'
      )
    })

    const trailingIconClass = computed(() => {
      return classNames(
        ui.value.icon.base,
        ui.value.icon.size[props.size],
        props.loading && !isLeading.value && 'animate-spin'
      )
    })

    return {
      button,
      buttonIs,
      buttonProps,
      isLeading,
      isTrailing,
      isSquare,
      buttonClass,
      leadingIconName,
      trailingIconName,
      leadingIconClass,
      trailingIconClass
    }
  }
})
</script>
