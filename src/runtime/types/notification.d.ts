import type { Avatar } from './avatar'
import type { Button } from './button'
import appConfig from '#build/app.config'

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
  ui?: Partial<typeof appConfig.ui.notification>
}
