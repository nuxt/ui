<template>
  <div :class="ui.wrapper">
    <HDisclosure v-for="(item, index) in items" v-slot="{ open, close }" :key="index" :default-open="defaultOpen || item.defaultOpen">
      <HDisclosureButton
        :ref="() => buttonRefs[index] = { open, close }"
        as="template"
        :disabled="item.disabled"
        @click="closeOthers(index, $event)"
        @keydown.enter="closeOthers(index, $event)"
        @keydown.space="closeOthers(index, $event)"
      >
        <slot :item="item" :index="index" :open="open" :close="close">
          <UButton v-bind="{ ...omit(ui.default, ['openIcon', 'closeIcon']), ...attrs, ...omit(item, ['slot', 'disabled', 'content', 'defaultOpen']) }">
            <template #trailing>
              <UIcon
                :name="!open ? openIcon : closeIcon ? closeIcon : openIcon"
                :class="[
                  open && !closeIcon ? '-rotate-180' : '',
                  uiButton.icon.size[item.size || uiButton.default.size],
                  ui.item.icon
                ]"
              />
            </template>
          </UButton>
        </slot>
      </HDisclosureButton>

      <Transition
        v-bind="ui.transition"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
      >
        <div v-show="open">
          <HDisclosurePanel :class="[ui.item.base, ui.item.size, ui.item.color, ui.item.padding]" static>
            <slot :name="item.slot || 'item'" :item="item" :index="index" :open="open" :close="close">
              {{ item.content }}
            </slot>
          </HDisclosurePanel>
        </div>
      </Transition>
    </HDisclosure>
  </div>
</template>

<script lang="ts">
import { ref, computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { Disclosure as HDisclosure, DisclosureButton as HDisclosureButton, DisclosurePanel as HDisclosurePanel } from '@headlessui/vue'
import UIcon from '../elements/Icon.vue'
import UButton from '../elements/Button.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig, omit } from '../../utils'
import type { AccordionItem, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { accordion, button } from '#ui/ui.config'

const config = mergeConfig<typeof accordion>(appConfig.ui.strategy, appConfig.ui.accordion, accordion)

const configButton = mergeConfig<typeof button>(appConfig.ui.strategy, appConfig.ui.button, button)

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
      type: Array as PropType<AccordionItem[]>,
      default: () => []
    },
    defaultOpen: {
      type: Boolean,
      default: false
    },
    openIcon: {
      type: String,
      default: () => config.default.openIcon
    },
    closeIcon: {
      type: String,
      default: () => config.default.closeIcon
    },
    multiple: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs } = useUI('accordion', toRef(props, 'ui'), config, toRef(props, 'class'))

    const uiButton = computed<Partial<typeof configButton>>(() => configButton)

    const buttonRefs = ref<{ open: boolean, close: (e: EventTarget) => {} }[]>([])

    function closeOthers (currentIndex: number, e: Event) {
      if (!props.items[currentIndex].closeOthers && props.multiple) {
        return
      }

      buttonRefs.value.forEach((button) => {
        if (button.open) {
          button.close(e.target)
        }
      })
    }

    function onEnter (el: HTMLElement, done) {
      el.style.height = '0'
      el.offsetHeight // Trigger a reflow, flushing the CSS changes
      el.style.height = el.scrollHeight + 'px'

      el.addEventListener('transitionend', done, { once: true })
    }

    function onBeforeLeave (el: HTMLElement) {
      el.style.height = el.scrollHeight + 'px'
      el.offsetHeight // Trigger a reflow, flushing the CSS changes
    }

    function onAfterEnter (el: HTMLElement) {
      el.style.height = 'auto'
    }

    function onLeave (el: HTMLElement, done) {
      el.style.height = '0'

      el.addEventListener('transitionend', done, { once: true })
    }

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      uiButton,
      attrs,
      buttonRefs,
      closeOthers,
      omit,
      onEnter,
      onBeforeLeave,
      onAfterEnter,
      onLeave
    }
  }
})
</script>
