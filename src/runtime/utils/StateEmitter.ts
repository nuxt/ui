import { watch, defineComponent } from 'vue'

export default defineComponent({
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['open', 'close'],
  setup (props, { emit }) {
    watch(() => props.open, (value) => {
      if (value) {
        emit('open')
      } else {
        emit('close')
      }
    })

    return () => {}
  }
})
