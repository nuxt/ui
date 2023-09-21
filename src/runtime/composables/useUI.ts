import { computed, toValue, useAttrs } from 'vue'
import { useAppConfig } from '#imports'
import { mergeConfig, omit, get } from '../utils'
import { Strategy } from '../types'

export const useUI = <T>(key, $ui: Partial<T & { strategy: Strategy }>, $config?: T, { mergeWrapper = false }: { mergeWrapper?: boolean } = {}) => {
  const $attrs = useAttrs()
  const appConfig = useAppConfig()

  const ui = computed(() => mergeConfig<T>(
    $ui?.strategy || (appConfig.ui?.strategy as Strategy),
    mergeWrapper ? { wrapper: $attrs?.class } : {},
    $ui || {},
    process.dev ? get(appConfig, key, {}) : {},
    toValue($config || {})
  ))
  const attrs = computed(() => omit($attrs, ['class']))

  return {
    ui,
    attrs,
    attrsClass: mergeWrapper ? undefined : $attrs?.class as string
  }
}
