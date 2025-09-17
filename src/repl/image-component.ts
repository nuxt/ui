import { defineComponent, h } from 'vue'

// Minimal image component stub for REPL builds
export default defineComponent({
  name: 'UiImageStub',
  props: {
    src: { type: String, default: '' },
    alt: { type: String, default: '' }
  },
  setup(props, { attrs }) {
    return () => h('img', { ...attrs, src: props.src, alt: props.alt })
  }
})
