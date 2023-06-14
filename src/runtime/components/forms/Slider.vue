<template>
  <div :class="ui.wrapper">
    <input
      :id="name"
      ref="input"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      type="range"
      :class="inputClass"
      v-bind="$attrs"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <slot />
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { classNames } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    padded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: () => appConfig.ui.input.default.size,
      validator(value: string) {
        return Object.keys(appConfig.ui.input.size).includes(value)
      }
    },
    color: {
      type: String,
      default: () => appConfig.ui.slider.default.color,
      validator(value: string) {
        return [...appConfig.ui.colors, ...Object.keys(appConfig.ui.input.color)].includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.slider>>,
      default: () => appConfig.ui.slider
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup(props, { emit, slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    console.log(props.ui)
    const ui = computed<Partial<typeof appConfig.ui.slider>>(() => defu({}, props.ui, appConfig.ui.slider))

    const onInput = (event: InputEvent) => {
      emit('update:modelValue', (event.target as any).value)
    }

    console.log(ui.value)

    const inputClass = computed(() => {
      return classNames(
        ui.value.base,
        ui.value.thumb.replaceAll('{color}', props.color),
        "range",
        /*  ui.value.rounded,
          ui.value.placeholder,
          ui.value.size[props.size],
          props.padded ? ui.value.padding[props.size] : 'p-0',*/
      )
    })

    // eslint-disable-next-line vue/no-dupe-keys
    return { ui, onInput, inputClass }
  }
})

</script>

<style scoped>
:root {
  --bc: var(--color-primary-500);
}

.range {
  &-xs {
    @apply h-4;

    &::-webkit-slider-runnable-track {
      @apply h-1;
    }

    &::-moz-range-track {
      @apply h-1;
    }

    &::-webkit-slider-thumb {
      @apply h-4 w-4;
      --filler-offset: 0.4rem;
    }

    &::-moz-range-thumb {
      @apply h-4 w-4;
      --filler-offset: 0.4rem;
    }
  }

  &-sm {
    @apply h-5;

    &::-webkit-slider-runnable-track {
      @apply h-1;
    }

    &::-moz-range-track {
      @apply h-1;
    }

    &::-webkit-slider-thumb {
      @apply h-5 w-5;
      --filler-offset: 0.5rem;
    }

    &::-moz-range-thumb {
      @apply h-5 w-5;
      --filler-offset: 0.5rem;
    }
  }

  &-md {
    @apply h-6;

    &::-webkit-slider-runnable-track {
      @apply h-2;
    }

    &::-moz-range-track {
      @apply h-2;
    }

    &::-webkit-slider-thumb {
      @apply h-6 w-6;
      --filler-offset: 0.6rem;
    }

    &::-moz-range-thumb {
      @apply h-6 w-6;
      --filler-offset: 0.6rem;
    }
  }

  &-lg {
    @apply h-8;

    &::-webkit-slider-runnable-track {
      @apply h-4;
    }

    &::-moz-range-track {
      @apply h-4;
    }

    &::-webkit-slider-thumb {
      @apply h-8 w-8;
      --filler-offset: 1rem;
    }

    &::-moz-range-thumb {
      @apply h-8 w-8;
      --filler-offset: 1rem;
    }
  }
}

.range {
  appearance: none;
  -webkit-appearance: none;
  --range-shdw: var(--bc);

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    @apply h-2 w-full rounded-full bg-gray-200;
  }

  &::-moz-range-track {
    @apply h-2 w-full rounded-full bg-gray-200;
  }

  &::-webkit-slider-thumb {
    color: var(--tw-shadow-color);
    --filler-size: 100rem;
    --filler-offset: 0.6rem;
    box-shadow: 0 0 0 3px var(--tw-shadow-color) inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);
  }

  &::-moz-range-thumb {
    @apply relative h-6 w-6 border-none rounded-full bg-white;
    top: 50%;
    color: var(--tw-shadow-color);
    --filler-size: 100rem;
    --filler-offset: 0.5rem;
    box-shadow: 0 0 0 3px hsl(var(--range-shdw)) inset, var(--focus-shadow, 0 0),
    calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);
  }


}

.range:focus-visible::-webkit-slider-thumb {
  --focus-shadow: 0 0 0 6px white inset, 0 0 0 2rem var(--tw-shadow-color) inset
}

.range:focus-visible::-moz-range-thumb {
  --focus-shadow: 0 0 0 6px var(--tw-shadow-color) inset, 0 0 0 2rem var(--tw-shadow-color) inset
}

</style>
