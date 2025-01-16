<template>
  <div :class="ui.wrapper">
    <HDisclosure
      v-for="(item, index) in items"
      v-slot="{ open, close }"
      :key="index"
      as="div"
      :class="ui.container"
      :default-open="defaultOpen || item.defaultOpen"
    >
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
        <HDisclosurePanel
          v-if="unmount"
          :class="[ui.item.base, ui.item.size, ui.item.color, ui.item.padding]"
          unmount
        >
          <slot :name="item.slot || 'item'" :item="item" :index="index" :open="open" :close="close">
            {{ item.content }}
          </slot>
        </HDisclosurePanel>
        <template v-else>
          <div v-show="open">
            <HDisclosurePanel
              :class="[ui.item.base, ui.item.size, ui.item.color, ui.item.padding]"
              static
            >
              <slot :name="item.slot || 'item'" :item="item" :index="index" :open="open" :close="close">
                {{ item.content }}
              </slot>
            </HDisclosurePanel>
          </div>
        </template>
      </Transition>
    </HDisclosure>
  </div>
</template>

<script lang="ts">
import { ref, computed, toRef, defineComponent, watch } from 'vue'
import type { PropType } from 'vue'
import { Disclosure as HDisclosure, DisclosureButton as HDisclosureButton, DisclosurePanel as HDisclosurePanel, provideUseId } from '@headlessui/vue'
import UIcon from '../elements/Icon.vue'
import UButton from '../elements/Button.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig, omit } from '../../utils'
import type { AccordionItem, DeepPartial, Strategy } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { accordion, button } from '#ui/ui.config'
import { useId } from '#imports'

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
    unmount: {
      type: Boolean,
      default: false
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
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['open', 'close'],
  setup(props, { emit }) {
    const { ui, attrs } = useUI('accordion', toRef(props, 'ui'), config, toRef(props, 'class'))

    const uiButton = computed<typeof configButton>(() => configButton)

    const buttonRefs = ref<{ open: boolean, close: (e: EventTarget) => {} }[]>([])

    const openedStates = computed(() => buttonRefs.value.map(({ open }) => open))
    watch(openedStates, (newValue, oldValue) => {
      for (const index in newValue) {
        const isOpenBefore = oldValue[index]
        const isOpenAfter = newValue[index]

        if (!isOpenBefore && isOpenAfter) {
          emit('open', index)
        } else if (isOpenBefore && !isOpenAfter) {
          emit('close', index)
        }
      }
    }, { immediate: true })

    function closeOthers(currentIndex: number, e: Event) {
      if (!props.items[currentIndex].closeOthers && props.multiple) {
        return
      }

      buttonRefs.value.forEach((button) => {
        if (button.open) {
          button.close(e.target as EventTarget)
        }
      })
    }

    function onEnter(_el: Element, done: () => void) {
      const el = _el as HTMLElement
      el.style.height = '0'
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight // Trigger a reflow, flushing the CSS changes
      el.style.height = el.scrollHeight + 'px'

      el.addEventListener('transitionend', done, { once: true })
    }

    function onBeforeLeave(_el: Element) {
      const el = _el as HTMLElement
      el.style.height = el.scrollHeight + 'px'
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight // Trigger a reflow, flushing the CSS changes
    }

    function onAfterEnter(_el: Element) {
      const el = _el as HTMLElement
      el.style.height = 'auto'
    }

    function onLeave(_el: Element, done: () => void) {
      const el = _el as HTMLElement
      el.style.height = '0'

      el.addEventListener('transitionend', done, { once: true })
    }

    provideUseId(() => useId())

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      uiButton,
      attrs,
      buttonRefs,
      closeOthers,
      omit: (omit as any),
      onEnter,
      onBeforeLeave,
      onAfterEnter,
      onLeave
    }
  }
})
</script>
