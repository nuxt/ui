import type { Avatar } from './avatar'
import type { Button } from './button'

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
  color?: string
  ui?: any
}
