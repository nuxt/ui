<template>
  <div :class="containerClass">
    <slot />
  </div>
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
    constrained: {
      type: Boolean,
      default: true
    },
    constrainedClass: {
      type: String,
      default: () => $ui.container.constrained
    }
  },
  setup (props) {
    const containerClass = computed(() => {
      return classNames(
        'mx-auto sm:px-6 lg:px-8',
        props.padded && 'px-4',
        props.constrained && props.constrainedClass
      )
    })

    return {
      containerClass
    }
  }
}
</script>
