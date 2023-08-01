import { ButtonGroupInjectionKey } from '../../composables/symbols'

export default defineComponent({
  setup (_, { slots }) {
    provide(ButtonGroupInjectionKey, null)
    return ()=> slots?.default?.()
  }
})
