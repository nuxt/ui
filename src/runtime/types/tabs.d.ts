import type { Button } from './button'

export interface TabItem extends Button {
  slot?: string
  disabled?: boolean
  content?: string
}
