import { computed, toValue, useAttrs } from 'vue'
import type { Ref } from 'vue'
import { useAppConfig } from '#imports'
import { mergeConfig, omit, get } from '../utils'
import { Strategy } from '../types'

export const useUI = <T>(key, $ui: Ref<Partial<T & { strategy: Strategy }> | undefined>, $config?: Ref<T> | T, $wrapperClass?: Ref<string>) => {
  const $attrs = useAttrs()
  const appConfig = useAppConfig()

  const ui = computed(() => {
    const _ui = toValue($ui)
    const _config = toValue($config)
    const _wrapperClass = toValue($wrapperClass)
    return mergeConfig<T>(
      _ui?.strategy || (appConfig.ui?.strategy as Strategy),
      _wrapperClass ? { wrapper: _wrapperClass } : {},
      _ui || {},
      process.dev ? get(appConfig.ui, key, {}) : {},
      _config || {}
    )
  })

  const attrs = computed(() => omit($attrs, ['class']))

  return {
    ui,
    attrs
  }
}
