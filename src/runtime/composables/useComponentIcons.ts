import { computed } from 'vue'
import { useAppConfig } from '#imports'
import type { IconProps } from '#ui/types'

export interface UseComponentIconsProps {
  icon?: IconProps['name']
  leading?: boolean
  leadingIcon?: IconProps['name']
  trailing?: boolean
  trailingIcon?: IconProps['name']
  loading?: boolean
  loadingIcon?: IconProps['name']
}

export function useComponentIcons (props: UseComponentIconsProps) {
  const appConfig = useAppConfig()

  const isLeading = computed(() => (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing && !props.trailingIcon) || !!props.leadingIcon)
  const isTrailing = computed(() => (props.icon && props.trailing) || (props.loading && props.trailing) || !!props.trailingIcon)

  const leadingIconName = computed(() => {
    if (props.loading) {
      return props.loadingIcon || appConfig.ui.icons.loading
    }

    return props.leadingIcon || props.icon
  })
  const trailingIconName = computed(() => {
    if (props.loading && !isLeading.value) {
      return props.loadingIcon || appConfig.ui.icons.loading
    }

    return props.trailingIcon || props.icon
  })

  return {
    isLeading,
    isTrailing,
    leadingIconName,
    trailingIconName
  }
}
