import { defineComponent, h } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CodeTree from '../../../src/runtime/components/prose/CodeTree.vue'
import Pre from '../../../src/runtime/components/prose/Pre.vue'

const Wrapper = defineComponent({
  props: {
    files: { type: Array<string>, required: true },
    codeTreeProps: { type: Object, default: () => ({}) }
  },
  setup(props) {
    return () => h(CodeTree, props.codeTreeProps, {
      default: () => props.files.map(filename =>
        h(Pre, { filename }, () => `content of ${filename}`))
    })
  }
})

describe('CodeTree', () => {
  it('does not warn about invoking the slot outside of the render function', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await mountSuspended(Wrapper, {
      props: {
        files: ['app/app.vue', 'app/pages/index.vue'],
        codeTreeProps: { defaultValue: 'app/app.vue' }
      }
    })

    expect(warn.mock.calls.flat().join('\n')).not.toMatch(/invoked outside of the render function/)
    warn.mockRestore()
  })

  it('does not warn about invoking the slot outside of the render function with `expandAll`', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await mountSuspended(Wrapper, {
      props: {
        files: ['app/app.vue', 'app/pages/index.vue'],
        codeTreeProps: { expandAll: true }
      }
    })

    expect(warn.mock.calls.flat().join('\n')).not.toMatch(/invoked outside of the render function/)
    warn.mockRestore()
  })

  it('renders slotted files as tree items and selects the default file', async () => {
    const wrapper = await mountSuspended(Wrapper, {
      props: {
        files: ['app/app.vue', 'app/pages/index.vue'],
        codeTreeProps: { defaultValue: 'app/pages/index.vue' }
      }
    })

    expect(wrapper.text()).toContain('app.vue')
    expect(wrapper.text()).toContain('index.vue')
    expect(wrapper.text()).toContain('content of app/pages/index.vue')
    expect(wrapper.text()).not.toContain('content of app/app.vue')
  })

  it('updates the tree when the slotted files change', async () => {
    const wrapper = await mountSuspended(Wrapper, {
      props: { files: ['app.vue'] }
    })

    expect(wrapper.text()).toContain('app.vue')
    expect(wrapper.text()).not.toContain('index.vue')

    await wrapper.setProps({ files: ['app.vue', 'index.vue'] })

    expect(wrapper.text()).toContain('index.vue')
  })

  it('expands nested directories by default when `expandAll` is set', async () => {
    const wrapper = await mountSuspended(Wrapper, {
      props: {
        files: ['app/app.vue', 'app/pages/index.vue'],
        codeTreeProps: { expandAll: true }
      }
    })

    expect(wrapper.find('ul[role="group"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('index.vue')
  })

  it('keeps the previously selected file content when a directory is clicked', async () => {
    const wrapper = await mountSuspended(Wrapper, {
      props: {
        files: ['app/app.vue', 'app/pages/index.vue'],
        codeTreeProps: { defaultValue: 'app/app.vue' }
      }
    })

    expect(wrapper.text()).toContain('content of app/app.vue')

    const folderButton = wrapper.findAll('button').find(btn => btn.text().trim() === 'app')
    await folderButton!.trigger('click')

    expect(wrapper.text()).toContain('content of app/app.vue')
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Wrapper, {
      props: {
        files: ['app/app.vue', 'app/pages/index.vue'],
        codeTreeProps: { defaultValue: 'app/app.vue' }
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
