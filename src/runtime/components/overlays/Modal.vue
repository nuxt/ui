<template>
  <TransitionRoot :appear="appear" :show="isOpen" as="template">
    <HDialog :class="wrapperClass" v-bind="attrs" @close="(e) => !preventClose && close(e)">
      <TransitionChild v-if="overlay" as="template" :appear="appear" v-bind="ui.overlay.transition">
        <div :class="[ui.overlay.base, ui.overlay.background]" />
      </TransitionChild>

      <div :class="ui.inner">
        <div :class="[ui.container, ui.padding]">
          <TransitionChild as="template" :appear="appear" v-bind="transitionClass">
            <HDialogPanel
              :class="[
                ui.base,
                ui.background,
                ui.ring,
                ui.shadow,
                fullscreen ? 'w-screen' : ui.width,
                fullscreen ? 'h-screen' : ui.height,
                fullscreen ? 'rounded-none' : ui.rounded,
                fullscreen ? 'm-0' : ui.margin
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
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { omit } from '../../utils/lodash'
import { twMerge } from 'tailwind-merge'
import { Dialog as HDialog, DialogPanel as HDialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { defuTwMerge } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

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
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.modal>>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'close'],
  setup (props, { attrs, emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.modal>>(() => defuTwMerge({}, props.ui, appConfig.ui.modal))

    const isOpen = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

    const transitionClass = computed(() => {
      if (!props.transition) {
        return {}
      }

      return {
        ...ui.value.transition
      }
    })

    function close (value: boolean) {
      isOpen.value = value

      emit('close')
    }

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      isOpen,
      wrapperClass,
      transitionClass,
      close
    }
  }
})
</script>
