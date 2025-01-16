<template>
  <component
    :is="as"
    v-if="!to"
    :type="type"
    :disabled="disabled"
    v-bind="$attrs"
    :class="active ? activeClass : inactiveClass"
  >
    <slot v-bind="{ isActive: active }" />
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
      :class="active !== undefined ? (active ? activeClass : inactiveClass) : resolveLinkClass(route, $route, { isActive, isExactActive })"
      :tabindex="disabled ? -1 : undefined"
      @click="(e) => (!isExternal && !disabled) && navigate(e)"
    >
      <slot v-bind="{ isActive: active !== undefined ? active : (exact ? isExactActive : isActive) }" />
    </a>
  </NuxtLink>
</template>

<script lang="ts">
import { isEqual, diff } from 'ohash'
import { type PropType, defineComponent } from 'vue'
import { nuxtLinkProps } from '../../utils'

export default defineComponent({
  inheritAttrs: false,
  props: {
    ...nuxtLinkProps,
    as: {
      type: String,
      default: 'button'
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: null
    },
    active: {
      type: Boolean,
      default: undefined
    },
    exact: {
      type: Boolean,
      default: false
    },
    exactQuery: {
      type: [Boolean, String] as PropType<boolean | 'partial'>,
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
  setup(props) {
    function isPartiallyEqual(item1, item2) {
      const diffedKeys = diff(item1, item2).reduce((filtered, q) => {
        if (q.type === 'added') {
          filtered.push(q.key)
        }
        return filtered
      }, [])
      return isEqual(item1, item2, { excludeKeys: key => diffedKeys.includes(key) })
    }

    function resolveLinkClass(route, $route, { isActive, isExactActive }: { isActive: boolean, isExactActive: boolean }) {
      if (props.exactQuery === 'partial') {
        if (!isPartiallyEqual(route.query, $route.query)) return props.inactiveClass
      } else if (props.exactQuery === true) {
        if (!isEqual(route.query, $route.query)) return props.inactiveClass
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
