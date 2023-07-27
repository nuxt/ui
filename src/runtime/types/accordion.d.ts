import type { Button } from './button'

export interface AccordionItem extends Button {
  slot?: string
  disabled?: boolean
  content?: string
  defaultOpen?: boolean
  closeOthers?: boolean
}
