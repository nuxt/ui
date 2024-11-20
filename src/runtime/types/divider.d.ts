import type { divider } from '../ui.config'

export type DividerSize = keyof typeof divider.border.size.horizontal | keyof typeof divider.border.size.vertical
