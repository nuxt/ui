<template>
  <button v-if="!to" v-bind="$attrs" :class="inactiveClass">
    <slot />
  </button>
  <NuxtLink
    v-else
    v-slot="{ route, href, target, rel, navigate, isActive, isExactActive, isExternal }"
    v-bind="$props"
    custom
  >
    <a
      v-bind="$attrs"
      :href="href"
      :rel="rel"
      :target="target"
      :class="resolveLinkClass(route, { isActive, isExactActive })"
      @click="(e) => !isExternal && navigate(e)"
    >
      <slot v-bind="{ isActive: exact ? isExactActive : isActive }" />
    </a>
  </NuxtLink>
</template>

<script lang="ts">
import { isEqual } from 'lodash-es'
import { defineComponent } from 'vue'
import { NuxtLink } from '#components'

export default defineComponent({
  inheritAttrs: false,
  props: {
    ...NuxtLink.props,
    exact: {
      type: Boolean,
      default: false
    },
    exactQuery: {
      type: Boolean,
      default: false
    },
    exactHash: {
      type: Boolean,
      default: false
    },
    inactiveClass: {
      type: String,
      default: undefined
    }
  },
  setup (props) {
    function resolveLinkClass (route, { isActive, isExactActive }: { isActive: boolean, isExactActive: boolean }) {
      if (props.exactQuery && !isEqual(route.query, useRoute().query)) {
        return props.inactiveClass
      }
      if (props.exactHash && route.hash !== useRoute().hash) {
        return props.inactiveClass
      }

      if (props.exact && isExactActive) {
        return props.activeClass
      }

      if (!props.exact && isActive) {
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
