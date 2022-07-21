import type { Ref, ComputedRef } from 'vue'
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
  shortcuts?: string[]
}

export interface Group {
  key: string
  label: string
  active?: string
  inactive?: string
  commands: Command[]
  customQuery?: (query: Ref<string>) => ComputedRef<string>
  options?: Partial<UseFuseOptions<Command>>
}
