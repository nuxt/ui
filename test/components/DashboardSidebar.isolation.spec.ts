import { defineComponent } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

vi.mock('../../src/runtime/components/Slideover.vue', () => ({
  default: {
    name: 'Slideover',
    inheritAttrs: false,
    props: ['open'],
    template: '<div v-if="open" data-testid="slideover" /><slot />'
  }
}))

vi.mock('../../src/runtime/components/Modal.vue', () => ({
  default: {
    name: 'Modal',
    inheritAttrs: false,
    props: ['open'],
    template: '<div v-if="open" data-testid="modal" /><slot />'
  }
}))

vi.mock('../../src/runtime/components/Drawer.vue', () => ({
  default: {
    name: 'Drawer',
    inheritAttrs: false,
    props: ['open'],
    template: '<div v-if="open" data-testid="drawer" /><slot />'
  }
}))

const DashboardGroup = (await import('../../src/runtime/components/DashboardGroup.vue')).default
const DashboardSidebar = (await import('../../src/runtime/components/DashboardSidebar.vue')).default
const DashboardSidebarToggle = (await import('../../src/runtime/components/DashboardSidebarToggle.vue')).default
const DashboardSidebarCollapse = (await import('../../src/runtime/components/DashboardSidebarCollapse.vue')).default

const DualDashboard = defineComponent({
  components: {
    UDashboardGroup: DashboardGroup as any,
    UDashboardSidebar: DashboardSidebar as any,
    UDashboardSidebarToggle: DashboardSidebarToggle as any,
    UDashboardSidebarCollapse: DashboardSidebarCollapse as any
  },
  data: () => ({
    navOpen: false,
    chatOpen: false,
    navCollapsed: false,
    chatCollapsed: false
  }),
  template: `<UDashboardGroup>
  <UDashboardSidebar id="nav" v-model:open="navOpen" v-model:collapsed="navCollapsed" collapsible />
  <UDashboardSidebar id="chat" side="right" v-model:open="chatOpen" v-model:collapsed="chatCollapsed" collapsible>
    <template #header>
      <UDashboardSidebarCollapse class="chat-collapse" />
    </template>
  </UDashboardSidebar>
  <UDashboardSidebarToggle class="broadcast-toggle" />
  <UDashboardSidebarToggle class="nav-toggle" target="nav" />
  <UDashboardSidebarToggle class="chat-toggle" target="chat" />
</UDashboardGroup>`
})

describe('DashboardSidebar isolation', () => {
  it('toggles every sidebar when target is omitted', async () => {
    const wrapper = await mountSuspended(DualDashboard)

    await wrapper.find('.broadcast-toggle').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.navOpen).toBe(true)
    expect(wrapper.vm.chatOpen).toBe(true)
  })

  it('toggles only the matching sidebar when target is set', async () => {
    const wrapper = await mountSuspended(DualDashboard)

    await wrapper.find('.nav-toggle').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.navOpen).toBe(true)
    expect(wrapper.vm.chatOpen).toBe(false)
  })

  it('toggles the right sidebar by id without opening the left', async () => {
    const wrapper = await mountSuspended(DualDashboard)

    await wrapper.find('.chat-toggle').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.navOpen).toBe(false)
    expect(wrapper.vm.chatOpen).toBe(true)
  })

  it('collapses only the parent sidebar when nested without target', async () => {
    const wrapper = await mountSuspended(DualDashboard)

    await wrapper.find('.chat-collapse').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.navCollapsed).toBe(false)
    expect(wrapper.vm.chatCollapsed).toBe(true)
  })
})
