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
import Vue from 'vue'

const RouterLink = Vue.component('RouterLink')

export default {
  name: 'Link',
  props: {
    // @ts-ignore
    ...RouterLink.options.props,
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
