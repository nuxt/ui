<template>
  <div :class="wrapperClass">
    <UIcon
      v-for="star of [...Array(max).keys()].slice().reverse()"
      :key="star"
      :name="icon"
      :class="[
        ratingClass,
        (rate >= star + 1 ? ui.active : ui.inactive).replaceAll('{color}', color), 'order-{order}'.replaceAll('{order}', star.toString()),
      ]"
      @click="setRating(star + 1)"
    />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import UIcon from '../elements/Icon.vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { defuTwMerge } from '../../utils'
import { useFormGroup } from '../../composables/useFormGroup'
import { useAppConfig } from '#imports'

// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

export default defineComponent({
  components: {
    UIcon
  },
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      default: () => appConfig.ui.rating.default.icon
    },
    max: {
      type: Number,
      default: 5,
      validate (value: number) {
        return value >= 1 && value < Number.MAX_VALUE
      }
    },
    color: {
      type: String,
      default: () => appConfig.ui.rating.default.color,
      validator (value: string) {
        return appConfig.ui.colors.includes(value)
      }
    },
    size: {
      type: String,
      default: () => appConfig.ui.rating.default.size
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.rating>>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit, attrs }) {
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.rating>>(() => defuTwMerge({}, props.ui, appConfig.ui.rating))

    const { emitFormBlur, formGroup } = useFormGroup()
    const color = computed(() => formGroup?.error?.value ? 'red' : props.color)
    const size = computed(() => formGroup?.size?.value ?? props.size)

    const rate = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
        emitFormBlur()
      }
    })

    const setRating = (rating: number) => {
      if (props.readOnly) return

      if (rate.value == rating) {
        rate.value = 0
        return
      }

      rate.value = rating
    }

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.size[size.value]
      ), attrs.class as string)
    })

    const ratingClass = computed(() => {
      return twJoin(
        ui.value.base.replaceAll('{color}', color.value),
        ui.value.size[props.size],
        props.readOnly ? 'cursor-auto hover:text-gray-300 hover:dark:text-gray-700 peer-hover:text-gray-300 peer-hover:dark:text-gray-700' : 'cursor-pointer'
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      rate,
      setRating,
      wrapperClass,
      ratingClass
    }
  }
})
</script>
