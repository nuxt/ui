<template>
  <div
    :class="{ 'sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:u-border-gray-200': inline }"
  >
    <slot name="label">
      <div :class="{ 'flex content-center justify-between': !inline }">
        <label
          v-if="label"
          :for="name"
          class="block text-sm font-medium leading-5 u-text-gray-700"
          :class="{'sm:mt-px sm:pt-2': inline }"
        >
          {{ label }}
          <span v-if="required" class="text-red-400">*</span>
        </label>
        <span
          v-if="$slots.hint || hint"
          class="text-sm leading-5 u-text-gray-500"
          :class="{ 'mt-1 max-w-2xl': inline }"
        ><slot name="hint">{{ hint }}</slot></span>
      </div>
    </slot>
    <div
      :class="{ 'mt-1': label && !inline, 'mt-1 sm:mt-0': label && inline, 'sm:col-span-2': inline }"
    >
      <slot />
      <p v-if="help" class="mt-2 text-sm u-text-gray-500">
        {{ help }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    help: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: null
    },
    inline: {
      type: Boolean,
      default: false
    }
  }
}
</script>
