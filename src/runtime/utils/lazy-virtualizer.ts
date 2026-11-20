import { defineAsyncComponent } from 'vue'

export const loadVirtualizers = () => import('./reka-virtualizers')

export const ListboxVirtualizer = defineAsyncComponent({ loader: () => loadVirtualizers().then(m => m.Listbox), suspensible: false })
export const ComboboxVirtualizer = defineAsyncComponent({ loader: () => loadVirtualizers().then(m => m.Combobox), suspensible: false })
