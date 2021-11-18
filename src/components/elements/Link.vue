<template>
  <NuxtLink v-slot="{ href, navigate }" v-bind="$props" custom>
    <a
      v-bind="$attrs"
      :href="href"
      :class="isActive ? activeClass : inactiveClass"
      @click="navigate"
    >
      <slot v-bind="{ isActive }" />
    </a>
  </NuxtLink>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'Link',
  props: {
    ...RouterLink.props,
    inactiveClass: {
      type: String,
      default: ''
    },
    exact: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive () {
      if (!this.exact) {
        return !!this.$route.path.startsWith(this.to)
      } else {
        return this.$route.path === this.to || this.$route.path === `${this.to}/`
      }
    }
  }
}
</script>
