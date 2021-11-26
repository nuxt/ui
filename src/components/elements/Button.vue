<template>
  <component
    :is="buttonIs"
    ref="button"
    :class="buttonClass"
    :aria-label="ariaLabel"
    v-bind="buttonProps"
  >
    <Icon v-if="isLeading" :name="iconName" :class="iconClass" aria-hidden="true" />
    <slot><span :class="truncate ? 'text-left break-all line-clamp-1' : ''">{{ label }}</span></slot>
    <Icon v-if="isTrailing" :name="iconName" :class="iconClass" aria-hidden="true" />
  </component>
</template>

<script>
import { ref, computed } from 'vue'
import Icon from '../elements/Icon'
import { classNames } from '../../utils'
import $ui from '#build/ui'

export default {
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
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return Object.keys($ui.button.size).includes(value)
      }
    },
    variant: {
      type: String,
      default: 'primary',
      validator (value) {
        return Object.keys($ui.button.variant).includes(value)
      }
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => $ui.button.icon.loading
    },
    trailing: {
      type: Boolean,
      default: false
    },
    leading: {
      type: Boolean,
      default: false
    },
    href: {
      type: String,
      default: null
    },
    to: {
      type: [String, Object],
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
    rounded: {
      type: Boolean,
      default: false
    },
    baseClass: {
      type: String,
      default: () => $ui.button.base
    },
    iconBaseClass: {
      type: String,
      default: () => $ui.button.icon.base
    },
    customClass: {
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
    }
  },
  setup (props, { slots }) {
    const button = ref(null)

    const buttonIs = computed(() => {
      if (props.href) {
        return 'a'
      } else if (props.to) {
        return 'NuxtLink'
      }

      return 'button'
    })

    const buttonProps = computed(() => {
      switch (buttonIs.value) {
        case 'a': return { href: props.href, target: props.target }
        case 'NuxtLink': return { to: props.to }
        default: return { disabled: props.disabled || props.loading, type: props.type }
      }
    })

    const isLeading = computed(() => {
      return (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing)
    })

    const isTrailing = computed(() => {
      return (props.icon && props.trailing) || (props.loading && props.trailing)
    })

    const isSquare = computed(() => props.square || (!slots.default && !props.label))

    const buttonClass = computed(() => {
      return classNames(
        props.baseClass,
        $ui.button.size[props.size],
        $ui.button[isSquare.value ? 'square' : 'spacing'][props.size],
        $ui.button.variant[props.variant],
        props.block ? 'w-full flex justify-center items-center' : 'inline-flex items-center',
        props.rounded ? 'rounded-full' : 'rounded-md',
        props.customClass
      )
    })

    const iconName = computed(() => {
      if (props.loading) {
        return props.loadingIcon
      }

      return props.icon
    })

    const iconClass = computed(() => {
      return classNames(
        props.iconBaseClass,
        $ui.input.icon.size[props.size],
        isLeading.value && (!!slots.default || !!props.label?.length) && $ui.button.icon.leading.spacing[props.size],
        isTrailing.value && (!!slots.default || !!props.label?.length) && $ui.button.icon.trailing.spacing[props.size],
        props.loading && 'animate-spin'
      )
    })

    return {
      button,
      buttonIs,
      buttonProps,
      buttonClass,
      isLeading,
      isTrailing,
      iconName,
      iconClass
    }
  }
}
</script>
