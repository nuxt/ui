import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { defu } from 'defu'
import { h } from 'vue'
import type { SetupContext } from 'vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
})

export function mountSuspended(...args: Parameters<typeof mount>) {
  let setupState = {}
  const comp = args[0] as any
  if (comp.setup) {
    const originalSetup = comp.setup
    comp.setup = function (props: Record<string, any>, ctx: SetupContext) {
      setupState = originalSetup.call(this, props, ctx)
      return setupState
    }
  }
  const wrapper = mount(args[0], defu({}, args[1], {
    global: {
      stubs: {
        NuxtLink: { setup: (props: { to?: string }) => () => props.to ? h('a') : h('button') },
        ClientOnly: { template: '<slot />' }
      },
      plugins: [router]
    }
  }))

  // @ts-expect-error - setupState does not exist in type
  wrapper.setupState = setupState

  return wrapper
}
