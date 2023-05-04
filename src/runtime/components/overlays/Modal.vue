<template>
  <TransitionRoot :appear="appear" :show="isOpen" as="template">
    <Dialog :class="ui.wrapper" @close="close">
      <TransitionChild v-if="overlay" as="template" :appear="appear" v-bind="ui.overlay.transition">
        <div :class="[ui.overlay.base, ui.overlay.background]" />
      </TransitionChild>

      <div :class="ui.inner">
        <div :class="[ui.container, ui.spacing]">
          <TransitionChild as="template" :appear="appear" v-bind="ui.transition">
            <DialogPanel :class="[ui.base, ui.width, ui.height, ui.background, ui.ring, ui.rounded, ui.shadow]">
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild
  },
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
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.modal>>,
      default: () => appConfig.ui.modal
    }
  },
  emits: ['update:modelValue', 'close'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.modal>>(() => defu({}, props.ui, appConfig.ui.modal))

    const isOpen = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    function close (value: boolean) {
      isOpen.value = value
      emit('close')
    }

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      isOpen,
      close
    }
  }
})
</script>
