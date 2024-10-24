import { computed, toValue, useAttrs } from 'vue'
import type { Ref } from 'vue'
import { mergeConfig, omit, get } from '../utils'
import type { DeepPartial, Strategy } from '../types/index'
import { useAppConfig } from '#imports'

export const useUI = <T>(key, $ui?: Ref<DeepPartial<T> & { strategy?: Strategy } | undefined>, $config?: Ref<T> | T, $wrapperClass?: Ref<string>, withAppConfig: boolean = false) => {
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
      (import.meta.dev || withAppConfig) ? get(appConfig.ui, key, {}) : {},
      _config || {}
    )
  })

  const attrs = computed(() => omit($attrs, ['class']))

  return {
    ui,
    attrs
  }
}
