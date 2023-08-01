<template>
  <OnRender @render="onRender" />
  <ULinkCustom :type="type" :disabled="disabled || loading" :class="buttonClass">
    <slot name="leading" :disabled="disabled" :loading="loading">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="leadingIconClass" aria-hidden="true" />
    </slot>

    <slot>
      <span v-if="label" :class="[truncate ? 'text-left break-all line-clamp-1' : '']">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing" :disabled="disabled" :loading="loading">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="trailingIconClass" aria-hidden="true" />
    </slot>
  </ULinkCustom>
</template>

<script lang="ts">
import { computed, defineComponent, useSlots } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import UIcon from '../elements/Icon.vue'
import ULinkCustom from '../elements/LinkCustom.vue'
import { classNames } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'
import { ButtonGroupInjectionKey } from '../../composables/symbols'
import { ButtonGroupContext } from '../../types'

// const appConfig = useAppConfig()

// TODO: maybe move to utils component
// eslint-disable-next-line vue/one-component-per-file
const OnRender =  defineComponent({
  emits: ['render'],
  setup (_, { emit }) {
    return () => {
      emit('render')
      return null
    }
  }
})

// eslint-disable-next-line vue/one-component-per-file
export default defineComponent({
  components: {
    UIcon,
    ULinkCustom,
    OnRender
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
        return [
          ...Object.keys(appConfig.ui.button.variant),
          ...Object.values(appConfig.ui.button.color).flatMap(value => Object.keys(value))
        ].includes(value)
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

    const slots = useSlots()

    const buttonGroupInject = reactive<ButtonGroupContext>({})
    const buttonGroup = inject(ButtonGroupInjectionKey)

    const ui = computed<Partial<typeof appConfig.ui.button>>(() => defu({}, buttonGroupInject.ui, props.ui, appConfig.ui.button ))
    const size = computed(() => buttonGroupInject.size || props.size)

    function onRender () {
      buttonGroup?.onRender(buttonGroupInject)
    }

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
        ui.value.size[size.value],
        ui.value.gap[size.value],
        props.padded && ui.value[isSquare.value ? 'square' : 'padding'][size.value],
        variant?.replaceAll('{color}', props.color),
        props.block ? 'w-full flex justify-center items-center' : 'inline-flex items-center',
        buttonGroupInject.class
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
        ui.value.icon.size[size.value],
        props.loading && 'animate-spin'
      )
    })

    const trailingIconClass = computed(() => {
      return classNames(
        ui.value.icon.base,
        ui.value.icon.size[size.value],
        props.loading && !isLeading.value && 'animate-spin'
      )
    })

    return {
      onRender,
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
