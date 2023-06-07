import type { Avatar } from './avatar'
import type { Button } from './button'
import appConfig from '#build/app.config'

export interface NotificationAction extends Partial<Button> {
  click: Function
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  icon?: string;
  rounded?:
    | 'none'
    | 'sm'
    | 'md'
    | 'rounded'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | 'full';
  avatar?: Partial<Avatar>;
  closeButton?: Partial<Button>;
  timeout: number;
  actions?: NotificationAction[];
  click?: Function;
  callback?: Function;
  color?: string;
  ui?: Partial<typeof appConfig.ui.notification>;
}
