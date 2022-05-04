<template>
  <button v-if="isButton" v-bind="$attrs" :class="inactiveClass">
    <slot />
  </button>
  <a v-else-if="isExternalLink" v-bind="$attrs" :href="to" :target="target" :class="inactiveClass">
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
      <slot v-bind="{ isActive: exact ? isExactActive : isActive }" />
    </a>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
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
})

const isExternalLink = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})
const isButton = computed(() => {
  return !props.to
})

function resolveLinkClass ({ isActive, isExactActive }: { isActive: boolean, isExactActive: boolean }) {
  if (props.exact) {
    return isExactActive ? props.activeClass : props.inactiveClass
  } else {
    return isActive ? props.activeClass : props.inactiveClass
  }
}
</script>

<script lang="ts">
export default {
  name: 'Link',
  inheritAttrs: false
}
</script>
