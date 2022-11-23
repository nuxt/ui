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

export interface ToastPlugin {
  addNotification: (notification: Partial<Notification>) => Notification
  removeNotification: (id: string) => void
  success: (options: { title?: string, description?: string }) => void
  error: (options: { title?: string, description?: string }) => void
}
