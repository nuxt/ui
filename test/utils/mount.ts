import type { SetupContext } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { defu } from 'defu'
import { createHead } from '@unhead/vue/client'
import { mount } from '@vue/test-utils'

const head = createHead()
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
})

export async function mountSuspended(...args: Parameters<typeof mount>) {
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
        ClientOnly: { template: '<slot />' }
      },
      plugins: [head, router]
    }
  }))

  await wrapper.vm.$nextTick()

  // @ts-expect-error - setupState does not exist in type
  wrapper.setupState = setupState

  return wrapper
}
