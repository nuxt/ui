<template>
  <Switch
    v-model="active"
    :class="[active ? activeClass : inactiveClass, baseClass]"
  >
    <span :class="[active ? containerActiveClass : containerInactiveClass, containerBaseClass]">
      <span v-if="iconOn" :class="[active ? iconActiveClass : iconInactiveClass, iconBaseClass]" aria-hidden="true">
        <Icon :name="iconOn" :class="iconOnClass" />
      </span>
      <span v-if="iconOff" :class="[active ? iconInactiveClass : iconActiveClass, iconBaseClass]" aria-hidden="true">
        <Icon :name="iconOff" :class="iconOffClass" />
      </span>
    </span>
  </Switch>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Switch } from '@headlessui/vue'
import Icon from '../elements/Icon.vue'
import { $theme } from '#theme'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  iconOn: {
    type: String,
    default: null
  },
  iconOff: {
    type: String,
    default: null
  },
  baseClass: {
    type: String,
    default () { return $theme('ui.toggle.base').value }
  },
  activeClass: {
    type: String,
    default () { return $theme('ui.toggle.active').value }
  },
  inactiveClass: {
    type: String,
    default () { return $theme('ui.toggle.inactive').value }
  },
  containerBaseClass: {
    type: String,
    default () { return $theme('ui.toggle.container.base').value }
  },
  containerActiveClass: {
    type: String,
    default () { return $theme('ui.toggle.container.active').value }
  },
  containerInactiveClass: {
    type: String,
    default () { return $theme('ui.toggle.container.inactive').value }
  },
  iconBaseClass: {
    type: String,
    default () { return $theme('ui.toggle.icon.base').value }
  },
  iconActiveClass: {
    type: String,
    default () { return $theme('ui.toggle.icon.active').value }
  },
  iconInactiveClass: {
    type: String,
    default () { return $theme('ui.toggle.icon.inactive').value }
  },
  iconOnClass: {
    type: String,
    default () { return $theme('ui.toggle.icon.on').value }
  },
  iconOffClass: {
    type: String,
    default () { return $theme('ui.toggle.icon.off').value }
  }
})

const emit = defineEmits(['update:modelValue'])

const active = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
</script>

<script lang="ts">
export default { name: 'UToggle' }
</script>
