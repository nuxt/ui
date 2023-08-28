import colors from '#ui-colors'
import { list } from '../ui.config'

export type ListSeparatorColor = keyof typeof list.color | typeof colors[number]

export type ListOrientation = keyof typeof list.stacking.orientation

export interface ListItem {
  label: string,
  icon?: string,
  leading?: boolean,
  trailing?: boolean,
  leadingIcon?: string
  trailingIcon?: string
}

export interface ListSlots {
  default: undefined,
  separator?: { index: number, isFirst: boolean, isLast: boolean },
}
