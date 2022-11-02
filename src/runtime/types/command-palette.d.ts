import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import type { FuseSortFunctionMatch, FuseSortFunctionMatchList } from 'fuse.js'
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
  group?: string
  score?: number
  matches?: (FuseSortFunctionMatch | FuseSortFunctionMatchList)[]
  [key: string]: any
}

export interface Group {
  key: string
  active?: string
  inactive?: string
  commands: Command[]
  options?: Partial<UseFuseOptions<Command>>
  [key: string]: any
}
