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
}
