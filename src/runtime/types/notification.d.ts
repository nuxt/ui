import type { Avatar } from './avatar'
import type { Button } from './button'
import appConfig from '#build/app.config'

export interface NotificationAction extends Partial<Button> {
  click: Function
}

export interface Notification {
  id: string
  title: string
  description: string
  icon?: string
  avatar?: Partial<Avatar>
  close?: Partial<Button>
  timeout: number
  actions?: NotificationAction[]
  click?: Function
  callback?: Function
  progressColor?: string
  progressVariant?: string
  ui?: Partial<typeof appConfig.ui.notification>
}
