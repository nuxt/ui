<template>
  <button v-if="!to" v-bind="$attrs" :class="inactiveClass">
    <slot />
  </button>
  <NuxtLink
    v-else
    v-slot="{ href, target, rel, navigate, exact, isActive, isExactActive, isExternal }"
    v-bind="$props"
    custom
  >
    <a
      v-bind="$attrs"
      :href="href"
      :rel="rel"
      :target="target"
      :class="resolveLinkClass({ isActive, isExactActive })"
      @click="(e) => !isExternal && navigate(e)"
    >
      <slot v-bind="{ isActive: exact ? isExactActive : isActive }" />
    </a>
  </NuxtLink>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NuxtLink } from '#components'

export default defineComponent({
  inheritAttrs: false,
  props: {
    ...NuxtLink.props,
    inactiveClass: {
      type: String,
      default: undefined
    }
  },
  setup (props) {
    function resolveLinkClass ({ isActive, isExactActive }: { isActive: boolean, isExactActive: boolean }) {
      if (isActive || isExactActive) {
        return props.activeClass
      }

      return props.inactiveClass
    }

    return {
      resolveLinkClass
    }
  }
})
</script>
