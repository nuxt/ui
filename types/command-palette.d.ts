import type { Ref, ComputedRef } from 'vue'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import type { Avatar } from './avatar'

export interface Command {
  id: string | number
  prefix?: string
  suffix?: string
  icon?: string
  iconClass?: string
  avatar?: Partial<Avatar>
  chip?: string
  disabled?: boolean
  shortcuts?: string[]
}

export interface Group {
  key: string
  active?: string
  inactive?: string
  commands: Command[]
  customQuery?: (query: Ref<string>) => ComputedRef<string>
  options?: Partial<UseFuseOptions<Command>>
}
