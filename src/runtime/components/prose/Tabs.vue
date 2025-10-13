<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/tabs'
import type { TabsProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ProseTabs = ComponentConfig<typeof theme, AppConfig, 'tabs', 'ui.prose'>

export interface ProseTabsProps {
  /**
   * The default tab to select.
   * @example '1'
   */
  defaultValue?: string
  /**
   * Sync the selected tab with a local storage key.
   */
  sync?: string
  /**
   * The hash to scroll to when the tab is selected.
   */
  hash?: string
  class?: any
  ui?: ProseTabs['slots'] & TabsProps['ui']
}

export interface ProseTabsSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, watch, onMounted, ref, onBeforeUpdate } from 'vue'
import { useState, useAppConfig } from '#imports'
import { transformUI } from '../../utils'
import { tv } from '../../utils/tv'
import UTabs from '../Tabs.vue'

const props = withDefaults(defineProps<ProseTabsProps>(), {
  defaultValue: '0'
})
const slots = defineSlots<ProseTabsSlots>()

const model = defineModel<string>()

const appConfig = useAppConfig() as ProseTabs['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.tabs || {}) }))

const rerenderCount = ref(1)

const items = computed<{
  index: number
  label: string
  icon: string
  component: any
}[]>(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  rerenderCount.value
  return slots.default?.()?.flatMap(transformSlot).filter(Boolean) || []
})

function transformSlot(slot: any, index: number) {
  if (typeof slot.type === 'symbol') {
    return slot.children?.map(transformSlot)
  }

  return {
    index,
    label: slot.props?.label || `${index}`,
    description: slot.props?.description,
    icon: slot.props?.icon,
    component: slot
  }
}

onMounted(() => {
  if (props.sync) {
    const syncKey = `tabs-${props.sync}`
    const syncValue = useState<string>(syncKey, () => localStorage.getItem(syncKey) as string)

    watch(syncValue, () => {
      if (!syncValue.value) return

      model.value = syncValue.value
    }, { immediate: true })

    watch(model, () => {
      if (!model.value) return

      syncValue.value = model.value
      localStorage.setItem(syncKey, model.value)
    })
  }
})

async function onUpdateModelValue() {
  if (props.hash) {
    const hash = props.hash.startsWith('#') ? props.hash : `#${props.hash}`
    setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView()
    }, 200)
  }
}

onBeforeUpdate(() => rerenderCount.value++)
</script>

<template>
  <UTabs
    v-model="model"
    color="primary"
    variant="link"
    :items="items"
    :class="props.class"
    :unmount-on-hide="false"
    :ui="transformUI(ui(), props.ui)"
    @update:model-value="onUpdateModelValue"
  >
    <template #content="{ item }">
      <component :is="item.component" />
    </template>
  </UTabs>
</template>
