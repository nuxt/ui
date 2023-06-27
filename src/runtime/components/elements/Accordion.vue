<template>
  <div :class="ui.wrapper">
    <HDisclosure v-for="(item, index) in items" v-slot="{ open, close }" :key="index" :default-open="defaultOpen || item.defaultOpen">
      <HDisclosureButton as="template" :disabled="item.disabled">
        <slot :item="item" :index="index" :open="open" :close="close">
          <UButton v-bind="{ ...omit(ui.default, ['openIcon', 'closeIcon']), ...$attrs, ...omit(item, ['slot', 'disabled', 'content', 'defaultOpen']) }" class="w-full">
            <template #trailing>
              <UIcon
                :name="!open ? openIcon : closeIcon ? closeIcon : openIcon"
                class="ms-auto transform"
                :class="[
                  open && !closeIcon ? '-rotate-180' : '',
                  uiButton.icon.size[item.size || uiButton.default.size]
                ]"
              />
            </template>
          </UButton>
        </slot>
      </HDisclosureButton>

      <Transition v-bind="ui.transition">
        <HDisclosurePanel :class="[ui.item.base, ui.item.size, ui.item.color, ui.item.padding]">
          <slot :name="item.slot || 'item'" :item="item" :index="index" :open="open" :close="close">
            {{ item.content }}
          </slot>
        </HDisclosurePanel>
      </Transition>
    </HDisclosure>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import { Disclosure as HDisclosure, DisclosureButton as HDisclosureButton, DisclosurePanel as HDisclosurePanel } from '@headlessui/vue'
import { defu } from 'defu'
import { omit } from 'lodash-es'
import UIcon from '../elements/Icon.vue'
import UButton from '../elements/Button.vue'
import type { Button } from '../../types/button'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

export default defineComponent({
  components: {
    HDisclosure,
    HDisclosureButton,
    HDisclosurePanel,
    UIcon,
    UButton
  },
  inheritAttrs: false,
  props: {
    items: {
      type: Array as PropType<Partial<Button & { slot: string, disabled: boolean, content: string, defaultOpen: boolean }>[]>,
      default: () => []
    },
    defaultOpen: {
      type: Boolean,
      default: false
    },
    openIcon: {
      type: String,
      default: () => appConfig.ui.accordion.default.openIcon
    },
    closeIcon: {
      type: String,
      default: () => appConfig.ui.accordion.default.closeIcon
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.accordion>>,
      default: () => appConfig.ui.accordion
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.accordion>>(() => defu({}, props.ui, appConfig.ui.accordion))

    const uiButton = computed<Partial<typeof appConfig.ui.button>>(() => appConfig.ui.button)

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      uiButton,
      omit
    }
  }
})
</script>
