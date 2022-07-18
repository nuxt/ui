import type { UseFuseOptions } from '@vueuse/integrations/useFuse'

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
  shortcuts?: string[]
}

export interface Group {
  key: string
  label: string
  commands: Command[]
  options?: Partial<UseFuseOptions<Command>>
}
