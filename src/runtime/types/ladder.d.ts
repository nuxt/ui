import { RouteParams } from 'vue-router'
import { ladder } from '../ui.config'
import colors from '#ui-colors'

export type LadderSize = keyof typeof ladder.icon.size
export type LadderStepColor = 'gray' | typeof colors[number]

export interface LadderStep {
  label: string,
  to?: RouteParams | string,
  click?: Function | boolean,
  icon?: string,
  disabled?: boolean
}

export interface LadderStepWrapper {
  step: LadderStep,
  isActive: boolean,
}
