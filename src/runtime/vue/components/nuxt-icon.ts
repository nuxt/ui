import { Icon } from '@iconify/vue'
import { defineComponent, h } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props, { attrs }) {
    // TODO: size?
    return () => h(Icon, { ...attrs, icon: props.name.replace(/^i-/, '') })
  }
})
