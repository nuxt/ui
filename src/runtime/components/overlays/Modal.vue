<template>
  <TransitionRoot :appear="appear" :show="isOpen" as="template">
    <HDialog :class="_ui.wrapper" v-bind="attrs" @close="close">
      <TransitionChild v-if="overlay" as="template" :appear="appear" v-bind="_ui.overlay.transition">
        <div :class="[_ui.overlay.base, _ui.overlay.background]" />
      </TransitionChild>

      <div :class="_ui.inner">
        <div :class="[_ui.container, !fullscreen && _ui.padding]">
          <TransitionChild as="template" :appear="appear" v-bind="transitionClass">
            <HDialogPanel
              :class="[
                _ui.base,
                _ui.background,
                _ui.ring,
                _ui.shadow,
                fullscreen ? _ui.fullscreen : [_ui.width, _ui.height, _ui.rounded, _ui.margin],
              ]"
            >
              <slot />
            </HDialogPanel>
          </TransitionChild>
        </div>
      </div>
    </HDialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { Dialog as HDialog, DialogPanel as HDialogPanel, TransitionRoot, TransitionChild, provideUseId } from '@headlessui/vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { modal } from '#ui/ui.config'
import { useId } from '#imports'

const config = mergeConfig<typeof modal>(appConfig.ui.strategy, appConfig.ui.modal, modal)

export default defineComponent({
  components: {
    HDialog,
    HDialogPanel,
    TransitionRoot,
    TransitionChild
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    appear: {
      type: Boolean,
      default: false
    },
    overlay: {
      type: Boolean,
      default: true
    },
    transition: {
      type: Boolean,
      default: true
    },
    preventClose: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'close', 'close-prevented'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('modal', toRef(props, 'ui'), config, toRef(props, 'class'))

    const isOpen = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const transitionClass = computed(() => {
      if (!props.transition) {
        return {}
      }

      return {
        ...ui.value.transition
      }
    })

    function close (value: boolean) {
      if (props.preventClose) {
        emit('close-prevented')

        return
      }

      isOpen.value = value

      emit('close')
    }

    provideUseId(() => useId())

    return {
      _ui: ui,
      attrs,
      isOpen,
      transitionClass,
      close
    }
  }
})
</script>
