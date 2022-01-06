<template>
  <span :class="badgeClass">
    <slot>{{ label }}</slot>
  </span>
</template>

<script>
import { classNames } from '../../utils'
import $ui from '#build/ui'

export default {
  props: {
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return Object.keys($ui.badge.size).includes(value)
      }
    },
    variant: {
      type: String,
      default: 'primary',
      validator (value) {
        return Object.keys($ui.badge.variant).includes(value)
      }
    },
    baseClass: {
      type: String,
      default: () => $ui.badge.base
    },
    rounded: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    }
  },
  setup (props) {
    const badgeClass = computed(() => {
      return classNames(
        props.baseClass,
        $ui.badge.size[props.size],
        $ui.badge.variant[props.variant],
        props.rounded ? 'rounded-full' : 'rounded-md'
      )
    })

    return {
      badgeClass
    }
  }
}
</script>
