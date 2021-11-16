<template>
  <div class="relative flex" :class="{ 'items-start': label, 'items-center': !label }">
    <div class="flex items-center h-5">
      <input
        :id="name"
        :checked="isChecked"
        :name="name"
        :required="required"
        :value="value"
        :disabled="disabled"
        type="checkbox"
        :class="inputClass"
        @focus="focused = true"
        @blur="focused = false"
        @change="onChange"
      />
    </div>
    <div v-if="label" class="ml-3 text-sm">
      <label :for="name" class="font-medium text-tw-gray-700">
        {{ label }}
        <span v-if="required" class="text-red-400">*</span>
      </label>
      <p v-if="help" class="text-tw-gray-500">{{ help }}</p>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    checked: {
      type: [Array, Boolean],
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
      default: 'h-4 w-4 text-primary-600 focus:ring-primary-500 border-tw-gray-300 bg-white dark:bg-gray-800 dark:checked:bg-primary-600 dark:checked:border-primary-600 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed rounded'
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
    isChecked () {
      return Array.isArray(this.checked) ? this.checked.includes(this.value) : this.checked
    },
    inputClass () {
      return [
        this.baseClass,
        this.customClass
      ].join(' ')
    }
  },
  methods: {
    onChange () {
      // We check if we have validation error and clean it as the user as typed a new value
      if (this.newValidation) { this.newValidation = null }

      if (!Array.isArray(this.checked)) { return this.$emit('change', !this.checked) }

      if (this.checked.includes(this.value)) { this.$emit('change', this.checked.filter(c => c !== this.value)) } else { this.$emit('change', this.checked.concat(this.value)) }
    }
  }
}
</script>
