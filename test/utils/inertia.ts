import type { SetupContext } from 'vue'
import { defineComponent, h, reactive } from 'vue'

/**
 * Stand-in for `@inertiajs/vue3` in the `vue-inertia` test project.
 *
 * `@inertiajs/vue3` is an optional peer dependency, so it is not installed in
 * this repository. The stub mirrors the surface the Inertia overrides consume:
 * `usePage()` and `Link`.
 */
export const page = reactive({ url: '/' })

export function setPageUrl(url: string) {
  page.url = url
}

export function usePage() {
  return page
}

export const Link = defineComponent({
  name: 'InertiaLink',
  props: {
    href: { type: String, default: '' }
  },
  setup(props, { slots, attrs }: SetupContext) {
    return () => h('a', { ...attrs, href: props.href }, slots.default?.())
  }
})
