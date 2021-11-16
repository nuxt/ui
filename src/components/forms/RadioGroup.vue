<template>
  <fieldset :id="name">
    <legend v-if="label" class="sr-only">{{ label }}</legend>

    <div :class="wrapperClass">
      <TwRadio
        v-for="(option, index) in options"
        :key="index"
        :checked="option.value === value"
        :disabled="disabled"
        :name="name"
        v-bind="option"
        :class="inputClass"
        @change="onChange"
      />
    </div>
  </fieldset>
</template>

<script>
export default {
  model: {
    event: 'change'
  },
  props: {
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number, Boolean, Object],
      default: null
    },
    options: {
      type: [Array],
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    wrapperClass: {
      type: String,
      default: null
    },
    inputClass: {
      type: String,
      default: null
    }
  },
  methods: {
    onChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>
