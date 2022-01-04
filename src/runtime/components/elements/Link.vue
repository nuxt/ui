<template>
  <button v-if="isButton" v-bind="$attrs" :class="isActive ? activeClass : inactiveClass">
    <slot v-bind="{ isActive }" />
  </button>
  <a v-else-if="isExternalLink" v-bind="$attrs" :class="isActive ? activeClass : inactiveClass" :href="to" :target="target">
    <slot v-bind="{ isActive }" />
  </a>
  <router-link
    v-else
    v-slot="{ href, navigate }"
    v-bind="$props"
    custom
  >
    <a
      v-bind="$attrs"
      :href="href"
      :class="isActive ? activeClass : inactiveClass"
      @click="navigate"
    >
      <slot v-bind="{ isActive }" />
    </a>
  </router-link>
</template>

<script>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRoute } from '#imports'

export default {
  name: 'Link',
  inheritAttrs: false,
  props: {
    ...RouterLink.props,
    to: {
      type: [String, Object],
      default: null
    },
    inactiveClass: {
      type: String,
      default: ''
    },
    exact: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      default: null
    }
  },
  setup (props) {
    const route = useRoute()
    const isActive = computed(() => {
      if (!props.to) {
        return false
      }

      if (props.exact) {
        return [props.to, `${props.to}/`].includes(route.path)
      } else {
        return !!route.path.startsWith(props.to)
      }
    })
    const isExternalLink = computed(() => {
      return typeof props.to === 'string' && props.to.startsWith('http')
    })
    const isButton = computed(() => {
      return !props.to
    })

    return {
      isActive,
      isButton,
      isExternalLink
    }
  }
}
</script>
