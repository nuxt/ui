export interface ToastNotificationAction {
  label: string,
  click: Function
}

export interface ToastNotification {
  id: string
  title: string
  description: string
  type: string
  icon?: string
  timeout: number
  actions?: ToastNotificationAction[]
  click?: Function
  callback?: Function
}
