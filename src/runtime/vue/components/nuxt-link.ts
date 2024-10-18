import { computed, defineComponent, h, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouterLinkProps } from 'vue-router'

export default defineComponent({
  props: {
    // @ts-expect-error props are not present on the type definition
    ...RouterLink.props,
    to: {
      type: [String, Object],
      default: undefined
    }
  },
  setup(props: RouterLinkProps & { to?: any }, { slots }) {
    const routerProps = Object.assign(reactive({}), props, {
      to: computed(() => props.to || '#')
    })
    const { href, isActive, isExactActive, navigate, route } = RouterLink.useLink(routerProps)

    return () => {
      if (props.custom) {
        return slots.default?.({
          href: props.to ? href.value : undefined,
          isActive: isActive.value,
          isExactActive: isExactActive.value,
          navigate,
          route,
          // NuxtLinkProps
          rel: undefined,
          target: undefined,
          isExternal: false
        })
      }

      return h(RouterLink, props)
    }
  }
})
