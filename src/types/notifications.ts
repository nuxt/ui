export interface Notification {
  id: string
  title: string
  description: string
  type: string
  icon?: string
  timeout: number
  undo?: Function
  callback?: Function
}
