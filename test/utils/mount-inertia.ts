import type { SetupContext } from 'vue'
import { defu } from 'defu'
import { createHead } from '@unhead/vue/client'
import { mount } from '@vue/test-utils'

const head = createHead()

/**
 * `mountSuspended` for the `vue-inertia` project: same contract as
 * `test/utils/mount.ts` but without `vue-router`, which an Inertia app does not
 * install.
 */
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
      plugins: [head]
    }
  }))

  await wrapper.vm.$nextTick()

  // @ts-expect-error - setupState does not exist in type
  wrapper.setupState = setupState

  return wrapper
}
