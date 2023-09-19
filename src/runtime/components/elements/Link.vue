<template>
  <component
    :is="as"
    v-if="!to"
    :disabled="disabled"
    v-bind="$attrs"
    :class="inactiveClass"
  >
    <slot />
  </component>
  <NuxtLink
    v-else
    v-slot="{ route, href, target, rel, navigate, isActive, isExactActive, isExternal }"
    v-bind="$props"
    custom
  >
    <a
      v-bind="$attrs"
      :href="!disabled ? href : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :role="disabled ? 'link' : undefined"
      :rel="rel"
      :target="target"
      :class="resolveLinkClass(route, $route, { isActive, isExactActive })"
      @click="(e) => !isExternal && navigate(e)"
    >
      <slot v-bind="{ isActive: exact ? isExactActive : isActive }" />
    </a>
  </NuxtLink>
</template>

<script lang="ts">
import { isEqual } from 'ohash'
import { defineComponent } from 'vue'
import { NuxtLink } from '#components'

export default defineComponent({
  inheritAttrs: false,
  props: {
    ...NuxtLink.props,
    as: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: null
    },
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
    function resolveLinkClass (route, $route, { isActive, isExactActive }: { isActive: boolean, isExactActive: boolean }) {
      if (props.exactQuery && !isEqual(route.query, $route.query)) {
        return props.inactiveClass
      }
      if (props.exactHash && route.hash !== $route.hash) {
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
