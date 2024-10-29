import type { Button } from './button'

export interface AccordionItem extends Button {
  slot?: string
  disabled?: boolean
  content?: string | string[] | object | object[]
  defaultOpen?: boolean
  closeOthers?: boolean
}
