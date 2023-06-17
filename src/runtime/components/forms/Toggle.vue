<template>
  <Switch
    v-model="active"
    :name="name"
    :disabled="disabled"
    :class="[active ? ui.active : ui.inactive, ui.base]"
  >
    <span :class="[active ? ui.container.active : ui.container.inactive, ui.container.base]">
      <span v-if="onIcon" :class="[active ? ui.icon.active : ui.icon.inactive, ui.icon.base]" aria-hidden="true">
        <UIcon :name="onIcon" :class="ui.icon.on" />
      </span>
      <span v-if="offIcon" :class="[active ? ui.icon.inactive : ui.icon.active, ui.icon.base]" aria-hidden="true">
        <UIcon :name="offIcon" :class="ui.icon.off" />
      </span>
    </span>
  </Switch>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { Switch } from '@headlessui/vue'
import UIcon from '../elements/Icon.vue'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Switch,
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

    const active = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      active
    }
  }
})
</script>
