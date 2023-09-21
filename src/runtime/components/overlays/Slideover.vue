<template>
  <TransitionRoot as="template" :appear="appear" :show="isOpen">
    <HDialog :class="[ui.wrapper, { 'justify-end': side === 'right' }]" v-bind="attrs" @close="(e) => !preventClose && close(e)">
      <TransitionChild v-if="overlay" as="template" :appear="appear" v-bind="ui.overlay.transition">
        <div :class="[ui.overlay.base, ui.overlay.background]" />
      </TransitionChild>

      <TransitionChild as="template" :appear="appear" v-bind="transitionClass">
        <HDialogPanel :class="[ui.base, ui.width, ui.background, ui.ring, ui.padding]">
          <slot />
        </HDialogPanel>
      </TransitionChild>
    </HDialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { WritableComputedRef, PropType } from 'vue'
import { Dialog as HDialog, DialogPanel as HDialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { slideover } from '#ui/ui.config'

const config = mergeConfig<typeof slideover>(appConfig.ui.strategy, appConfig.ui.slideover, slideover)

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
      type: Boolean as PropType<boolean>,
      default: false
    },
    appear: {
      type: Boolean,
      default: false
    },
    side: {
      type: String as PropType<'left' | 'right'>,
      default: 'right',
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
    preventClose: {
      type: Boolean,
      default: false
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  emits: ['update:modelValue', 'close'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('slideover', props.ui, config, { mergeWrapper: true })

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
      attrs,
      isOpen,
      transitionClass,
      close
    }
  }
})
</script>
