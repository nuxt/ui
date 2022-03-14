<template>
  <component
    :is="$attrs.onSubmit ? 'form': 'div'"
    :class="cardClass"
    v-bind="$attrs"
  >
    <div
      v-if="$slots.header"
      :class="[headerClass, headerBackgroundClass, borderColorClass, !!$slots.default && 'border-b']"
    >
      <slot name="header" />
    </div>
    <div :class="[bodyClass, bodyBackgroundClass]">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      :class="[footerClass, footerBackgroundClass, borderColorClass, (!!$slots.default || (!$slots.default && !!$slots.header)) && 'border-t']"
    >
      <slot name="footer" />
    </div>
  </component>
</template>

<script>
import { computed } from 'vue'
import { classNames } from '../../utils/'
import $ui from '#build/ui'

export default {
  props: {
    padded: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: true
    },
    baseClass: {
      type: String,
      default: () => $ui.card.base
    },
    backgroundClass: {
      type: String,
      default: () => $ui.card.background
    },
    borderColorClass: {
      type: String,
      default: () => $ui.card.border
    },
    shadowClass: {
      type: String,
      default: () => $ui.card.shadow
    },
    ringClass: {
      type: String,
      default: () => $ui.card.ring
    },
    roundedClass: {
      type: String,
      default: () => $ui.card.rounded,
      validator (value) {
        return ['sm', 'md', 'lg', 'xl', '2xl', '3xl'].map(size => `rounded-${size}`).includes(value)
      }
    },
    bodyClass: {
      type: String,
      default: () => $ui.card.body
    },
    bodyBackgroundClass: {
      type: String,
      default: null
    },
    headerClass: {
      type: String,
      default: () => $ui.card.header
    },
    headerBackgroundClass: {
      type: String,
      default: null
    },
    footerClass: {
      type: String,
      default: () => $ui.card.footer
    },
    footerBackgroundClass: {
      type: String,
      default: null
    },
    customClass: {
      type: String,
      default: null
    }
  },
  setup (props) {
    const cardClass = computed(() => {
      return classNames(
        props.baseClass,
        props.padded && props.rounded && props.roundedClass,
        !props.padded && props.rounded && `sm:${props.roundedClass}`,
        props.ringClass,
        props.shadowClass,
        props.backgroundClass,
        props.customClass
      )
    })

    return {
      cardClass
    }
  }
}
</script>
