import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import type { RouteLocationRaw } from 'vue-router'

export interface Command {
  prefix?: string
  suffix?: string
  label: string
  icon?: string
  iconClass?: string
  avatar?: string
  chip?: string
  disabled?: boolean
  prevent?: boolean
  click?: Function
  to?: RouteLocationRaw
  shortcuts?: string[]
}

export interface Group {
  key: string
  label: string
  commands: Command[]
  options?: Partial<UseFuseOptions<Command>>
}
