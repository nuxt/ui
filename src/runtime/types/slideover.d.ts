import type { Component } from 'vue'
import { slideover } from '../ui.config'
import type { EasingFunction, CubicBezierPoints } from '@vueuse/core'
export type SlideoverInitSize = keyof typeof slideover.resize.width.init
export type ResizeIconSize = keyof typeof slideover.resize.icon.size

interface ResizeOptions {
  enable: boolean;
  /**
   * The initial width of HDialogPanel
   */
  width?: SlideoverInitSize;
  /**
   * see `@vueuse/core` useTransition()
   */
  duration?: number;
  /**
   * see `@vueuse/core` useTransition()
   */
  transition?: EasingFunction | CubicBezierPoints;
  /**
   * Screen aspect ratio:
   * determines the ratio to which the width
   * automatically snaps when adjusting,
   * aligning it to the full screen
   */
  percentage?: number;
  /**
   * Custom icons
   */
  icon?: string | null;
  /**
   * Adjust the size of custom icons
   */
  size?: ResizeIconSize;
}

interface Slideover {
    ui?: any;
    side?: 'right' | 'left';
    transition?: boolean;
    appear?: boolean;
    overlay?: boolean;
    preventClose?: boolean;
    modelValue?: boolean;
    resize?: ResizeOptions;
}

interface SlideoverState {
    component: Component | string;
    props: Slideover;
}

interface Arguments {
  _enable: boolean;
  _width: number;
  _duration: number;
  _transition: EasingFunction | CubicBezierPoints;
  _percentage: number;
  _side: Ref<'left' | 'right'>;
  transitionP: Ref<boolean>;
}
