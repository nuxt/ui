<template>
  <label :for="`${name}-${value}`" class="relative flex cursor-pointer">
    <input
      :id="`${name}-${value}`"
      :checked="checked"
      :name="name"
      :required="required"
      :value="value"
      :disabled="disabled"
      type="radio"
      :class="inputClass"
      @focus="focused = true"
      @blur="focused = false"
      @change="onChange"
    >
    <div v-if="label" class="flex flex-col ml-3">
      <span class="block text-sm font-medium text-tw-gray-900">
        {{ label }}
        <span v-if="required" class="text-red-400">*</span>
      </span>
      <span v-if="help" class="block text-sm text-tw-gray-500">{{ help }}</span>
    </div>
  </label>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number, Boolean, Object],
      default: null
    },
    name: {
      type: String,
      default: null
    },
    checked: {
      type: Boolean,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    help: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    baseClass: {
      type: String,
      default: 'h-4 w-4 mt-0.5 text-primary-600 checked:border-primary-600 border-tw-gray-300 bg-tw-white dark:checked:bg-primary-600 focus:ring-offset-white dark:focus:ring-offset-gray-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
    },
    customClass: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      focused: false
    }
  },
  computed: {
    inputClass () {
      return [
        this.baseClass,
        this.customClass
      ].join(' ')
    }
  },
  methods: {
    onChange () {
      this.$emit('change', this.value)
    }
  }
}
</script>
