import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import Fuse from 'fuse.js'

export interface Command {
  disabled?: boolean
  icon?: string
  iconColor?: string
  iconClass?: string
  avatar?: string
  label: string
  group?: string
}

export interface Group {
  key: string
  label: string
  commands: Command[]
  options: Partial<UseFuseOptions<Command>>
}

export interface ComputedGroup extends Omit<Group, 'options' | 'commands'> {
  commands: Fuse.FuseResult<Command>[]
}
