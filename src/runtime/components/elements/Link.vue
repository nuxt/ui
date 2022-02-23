<template>
  <button v-if="isButton" v-bind="$attrs" :class="inactiveClass">
    <slot />
  </button>
  <a v-else-if="isExternalLink" v-bind="$attrs" :class="inactiveClass" :href="to" :target="target">
    <slot />
  </a>
  <router-link
    v-else
    v-slot="{ href, navigate, isActive, isExactActive }"
    v-bind="$props"
    custom
  >
    <a
      v-bind="$attrs"
      :href="href"
      :class="resolveLinkClass({ isActive, isExactActive })"
      @click="navigate"
    >
      <slot v-bind="{ isActive }" />
    </a>
  </router-link>
</template>

<script>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

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
    const isExternalLink = computed(() => {
      return typeof props.to === 'string' && props.to.startsWith('http')
    })
    const isButton = computed(() => {
      return !props.to
    })

    function resolveLinkClass ({ isActive, isExactActive }) {
      if ((props.exact && isExactActive) || isActive) {
        return props.activeClass
      } else {
        return props.inactiveClass
      }
    }

    return {
      isButton,
      isExternalLink,
      resolveLinkClass
    }
  }
}
</script>
