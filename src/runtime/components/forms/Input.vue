<template>
  <div :class="ui.wrapper">
    <input
      :id="name"
      ref="input"
      :name="name"
      :value="modelValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :spellcheck="spellcheck"
      :class="inputClass"
      @input="onInput(($event.target as any).value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <slot />
    <div v-if="isLeading" :class="ui.input.icon.leading.wrapper">
      <Icon v-if="iconName" :name="iconName" :class="iconClass" />
    </div>
    <div v-if="isTrailing" :class="ui.input.icon.trailing.wrapper">
      <Icon v-if="iconName" :name="iconName" :class="iconClass" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import Icon from '../elements/Icon.vue'
import { classNames } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    Icon
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: null
    },
    spellcheck: {
      type: Boolean,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    trailing: {
      type: Boolean,
      default: false
    },
    leading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: appConfig.ui.input.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.input.size).includes(value)
      }
    },
    appearance: {
      type: String,
      default: appConfig.ui.input.default.appearance,
      validator (value: string) {
        return Object.keys(appConfig.ui.input.appearance).includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.input>>,
      default: () => appConfig.ui.input
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.input>>(() => defu({}, props.ui, appConfig.ui.input))

    const input = ref<HTMLInputElement | null>(null)

    const autoFocus = () => {
      if (props.autofocus) {
        input.value?.focus()
      }
    }

    const onInput = (value: string) => {
      emit('update:modelValue', value)
    }

    onMounted(() => {
      setTimeout(() => {
        autoFocus()
      }, 100)
    })

    const isLeading = computed(() => {
      return (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing)
    })

    const isTrailing = computed(() => {
      return (props.icon && props.trailing) || (props.loading && props.trailing)
    })

    const inputClass = computed(() => {
      return classNames(
        ui.value.base,
        ui.value.size[props.size],
        ui.value.spacing[props.size],
        ui.value.appearance[props.appearance],
        isLeading.value && ui.value.leading.spacing[props.size],
        isTrailing.value && ui.value.trailing.spacing[props.size],
        ui.value.custom
      )
    })

    const iconName = computed(() => {
      if (props.loading) {
        return ui.value.icon.loading
      }

      return props.icon
    })

    const iconClass = computed(() => {
      return classNames(
        ui.value.icon.base,
        ui.value.icon.size[props.size],
        isLeading.value && ui.value.icon.leading.spacing[props.size],
        isTrailing.value && ui.value.icon.trailing.spacing[props.size],
        props.loading && 'animate-spin'
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      isLeading,
      isTrailing,
      inputClass,
      iconName,
      iconClass,
      onInput
    }
  }
})
</script>
