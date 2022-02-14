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

<script setup>
import { computed } from 'vue'
import { Switch } from '@headlessui/vue'
import Icon from '../elements/Icon'
import $ui from '#build/ui'

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
    default: () => $ui.toggle.base
  },
  activeClass: {
    type: String,
    default: () => $ui.toggle.active
  },
  inactiveClass: {
    type: String,
    default: () => $ui.toggle.inactive
  },
  containerBaseClass: {
    type: String,
    default: () => $ui.toggle.container.base
  },
  containerActiveClass: {
    type: String,
    default: () => $ui.toggle.container.active
  },
  containerInactiveClass: {
    type: String,
    default: () => $ui.toggle.container.inactive
  },
  iconBaseClass: {
    type: String,
    default: () => $ui.toggle.icon.base
  },
  iconActiveClass: {
    type: String,
    default: () => $ui.toggle.icon.active
  },
  iconInactiveClass: {
    type: String,
    default: () => $ui.toggle.icon.inactive
  },
  iconOnClass: {
    type: String,
    default: () => $ui.toggle.icon.on
  },
  iconOffClass: {
    type: String,
    default: () => $ui.toggle.icon.off
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
