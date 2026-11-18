import { defineComponent, getCurrentInstance, h, nextTick, onMounted } from 'vue'
import type { Component } from 'vue'
import { ComboboxVirtualizer, injectListboxRootContext, ListboxVirtualizer } from 'reka-ui'

function highlightOnMount<T extends Component>(virtualizer: T): T {
  return defineComponent({
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const rootContext = injectListboxRootContext()

      if (getCurrentInstance()?.parent?.isMounted) {
        onMounted(() => nextTick(() => rootContext.virtualFocusHook.trigger({ scroll: false })))
      }

      return () => h(virtualizer, attrs, slots)
    }
  }) as T
}

export const Listbox = highlightOnMount(ListboxVirtualizer)
export const Combobox = highlightOnMount(ComboboxVirtualizer)
