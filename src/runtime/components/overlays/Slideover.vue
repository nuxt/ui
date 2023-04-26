<template>
  <TransitionRoot as="template" :appear="appear" :show="isOpen">
    <Dialog :class="[ui.wrapper, { 'justify-end': side === 'right' }]" @close="close">
      <TransitionChild v-if="overlay" as="template" :appear="appear" v-bind="ui.overlay.transition">
        <div :class="[ui.overlay.base, ui.overlay.background]" />
      </TransitionChild>

      <TransitionChild as="template" :appear="appear" v-bind="transitionClass">
        <DialogPanel :class="[ui.base, ui.width, ui.background, ui.ring]">
          <slot />
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { WritableComputedRef, PropType } from 'vue'
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
      type: Boolean as PropType<boolean>,
      default: false
    },
    appear: {
      type: Boolean,
      default: false
    },
    side: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'right'].includes(value)
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
      type: Object as PropType<Partial<typeof appConfig.ui.slideover>>,
      default: () => appConfig.ui.slideover
    }
  },
  emits: ['update:modelValue', 'close'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.slideover>>(() => defu({}, props.ui, appConfig.ui.slideover))

    const isOpen: WritableComputedRef<boolean> = computed({
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
        ...ui.value.transition,
        enterFrom: props.side === 'left' ? '-translate-x-full' : 'translate-x-full',
        enterTo: 'translate-x-0',
        leaveFrom: 'translate-x-0',
        leaveTo: props.side === 'left' ? '-translate-x-full' : 'translate-x-full'
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
      transitionClass,
      close
    }
  }
})
</script>
