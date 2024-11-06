<template>
  <ULink :type="type" :disabled="disabled || loading" :class="buttonClass" v-bind="{ ...linkProps, ...attrs }">
    <slot name="leading" :disabled="disabled" :loading="loading">
      <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="leadingIconClass" aria-hidden="true" />
    </slot>

    <slot>
      <span v-if="label" :class="[truncate ? ui.truncate : '']">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing" :disabled="disabled" :loading="loading">
      <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="trailingIconClass" aria-hidden="true" />
    </slot>
  </ULink>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import ULink from '../elements/Link.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig, nuxtLinkProps, getNuxtLinkProps } from '../../utils'
import { useInjectButtonGroup } from '../../composables/useButtonGroup'
import type { ButtonColor, ButtonSize, ButtonVariant, DeepPartial, Strategy } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { button } from '#ui/ui.config'

const config = mergeConfig<typeof button>(appConfig.ui.strategy, appConfig.ui.button, button)

export default defineComponent({
  components: {
    UIcon,
    ULink
  },
  inheritAttrs: false,
  props: {
    ...nuxtLinkProps,
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
      type: String as PropType<ButtonSize>,
      default: () => config.default.size,
      validator(value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<ButtonColor>,
      default: () => config.default.color,
      validator(value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<ButtonVariant>,
      default: () => config.default.variant,
      validator(value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => config.default.loadingIcon
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
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup(props, { slots }) {
    const { ui, attrs } = useUI('button', toRef(props, 'ui'), config)

    const { size, rounded } = useInjectButtonGroup({ ui, props })

    const isLeading = computed(() => {
      return (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing) || props.leadingIcon
    })

    const isTrailing = computed(() => {
      return (props.icon && props.trailing) || (props.loading && props.trailing) || props.trailingIcon
    })

    const isSquare = computed(() => props.square || (!slots.default && !props.label))

    const buttonClass = computed(() => {
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        ui.value.font,
        rounded.value,
        ui.value.size[size.value],
        ui.value.gap[size.value],
        props.padded && ui.value[isSquare.value ? 'square' : 'padding'][size.value],
        variant?.replaceAll('{color}', props.color),
        props.block ? ui.value.block : ui.value.inline
      ), props.class)
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
      return twJoin(
        ui.value.icon.base,
        ui.value.icon.size[size.value],
        props.loading && ui.value.icon.loading
      )
    })

    const trailingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        ui.value.icon.size[size.value],
        props.loading && !isLeading.value && ui.value.icon.loading
      )
    })

    const linkProps = computed(() => getNuxtLinkProps(props))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      isLeading,
      isTrailing,
      isSquare,
      buttonClass,
      leadingIconName,
      trailingIconName,
      leadingIconClass,
      trailingIconClass,
      linkProps
    }
  }
})
</script>
