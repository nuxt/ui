import type { Avatar } from './avatar'
import type { Button } from './button'
import colors from '#ui-colors'

export type NotificationColor = 'gray' | typeof colors[number]

export interface NotificationAction extends Button {
  click?: Function
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
  click?: Function
  callback?: Function
  color?: NotificationColor
  ui?: any
}
