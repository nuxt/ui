import type { Avatar } from './avatar'
import type { Button } from './button'
import type colors from '#ui-colors'

export type NotificationColor = 'gray' | typeof colors[number]

export interface NotificationAction extends Button {
  click?: (...args: any[]) => void
}

export interface Notification {
  id: string
  title: string
  description?: string
  icon?: string
  avatar?: Avatar
  closeButton?: Button
  timeout: number
  actions?: NotificationAction[]
  click?: (...args: any[]) => void
  callback?: (...args: any[]) => void
  color?: NotificationColor
  ui?: any
}
