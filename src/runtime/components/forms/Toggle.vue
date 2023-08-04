<template>
  <HSwitch
    v-model="active"
    :name="name"
    :disabled="disabled"
    :class="switchClass"
  >
    <span :class="[active ? ui.container.active : ui.container.inactive, ui.container.base]">
      <span v-if="onIcon" :class="[active ? ui.icon.active : ui.icon.inactive, ui.icon.base]" aria-hidden="true">
        <UIcon :name="onIcon" :class="onIconClass" />
      </span>
      <span v-if="offIcon" :class="[active ? ui.icon.inactive : ui.icon.active, ui.icon.base]" aria-hidden="true">
        <UIcon :name="offIcon" :class="offIconClass" />
      </span>
    </span>
  </HSwitch>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { Switch as HSwitch } from '@headlessui/vue'
import UIcon from '../elements/Icon.vue'
import { classNames } from '../../utils'
import { useFormGroup } from '../../composables/useFormGroup'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    HSwitch,
    UIcon
  },
  props: {
    name: {
      type: String,
      default: null
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    onIcon: {
      type: String,
      default: () => appConfig.ui.toggle.default.onIcon
    },
    offIcon: {
      type: String,
      default: () => appConfig.ui.toggle.default.offIcon
    },
    color: {
      type: String,
      default: () => appConfig.ui.toggle.default.color,
      validator (value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.toggle>>,
      default: () => appConfig.ui.toggle
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.toggle>>(() => defu({}, props.ui, appConfig.ui.toggle))

    const { emitFormChange, formGroup } = useFormGroup()
    const color = computed(() => formGroup?.error?.value ? 'red' : props.color)

    const active = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
        emitFormChange()
      }
    })

    const switchClass = computed(() => {
      return classNames(
        ui.value.base,
        ui.value.rounded,
        ui.value.ring.replaceAll('{color}', color.value),
        (active.value ? ui.value.active : ui.value.inactive).replaceAll('{color}', color.value)
      )
    })

    const onIconClass = computed(() => {
      return classNames(
        ui.value.icon.on.replaceAll('{color}', color.value)
      )
    })

    const offIconClass = computed(() => {
      return classNames(
        ui.value.icon.off.replaceAll('{color}', color.value)
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      active,
      switchClass,
      onIconClass,
      offIconClass
    }
  }
})
</script>
