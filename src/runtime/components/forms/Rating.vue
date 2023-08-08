<template>
  <div :class="ui.wrapper">
    <UIcon
      v-for="star of [...Array(max).keys()].slice().reverse()"
      :key="star"
      :name="icon"
      :class="[
        ratingClass,
        (star + 1 <= modelValue ? ui.active : ui.inactive).replaceAll(
          '{color}',
          color
        ),
        readOnly ? 'cursor-auto hover:text-gray-300 hover:dark:text-gray-700 peer-hover:text-gray-300 peer-hover:dark:text-gray-700' : 'cursor-pointer',
        'order-{order}'.replaceAll('{order}', star.toString()),
      ]"
      @click="setRating(star + 1)"
    />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { defu } from 'defu'
import UIcon from '../elements/Icon.vue'
import { classNames } from '../../utils'
import { useFormEvents } from '../../composables/useFormEvents'
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
      default: () => appConfig.ui.rating.default.max
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
      default: () => appConfig.ui.rating
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.rating>>(() =>
      defu({}, props.ui, appConfig.ui.rating)
    )

    const { emitFormBlur } = useFormEvents()

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

    const ratingClass = computed(() => {
      return classNames(
        ui.value.base.replaceAll('{color}', props.color),
        ui.value.size[props.size]
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      rate,
      setRating,
      ratingClass
    }
  }
})
</script>
