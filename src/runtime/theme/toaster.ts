import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    viewport: 'fixed flex flex-col w-[calc(100%-2rem)] sm:w-96 z-100 data-[expanded=true]:h-(--height) focus:outline-none',
    base: 'pointer-events-auto absolute inset-x-0 z-(--index) transform-(--transform) motion-reduce:starting:opacity-0 min-h-[calc(var(--height)*1px)] max-h-[calc(var(--height)*1px)] data-[collapsed=true]:data-[front=false]:min-h-(--front-height) data-[collapsed=true]:data-[front=false]:max-h-(--front-height) data-[collapsed=true]:data-[front=false]:*:opacity-0 data-[visible=false]:opacity-0 data-[visible=false]:pointer-events-none *:transition-opacity *:duration-400 *:ease-[ease] data-[state=closed]:animate-[toast-closed_200ms_var(--ease-out)] data-[state=closed]:data-[collapsed=true]:data-[front=false]:animate-[toast-collapsed-closed_200ms_var(--ease-out)] motion-safe:data-[state=open]:data-[pulsing=odd]:animate-[toast-pulse-a_200ms_var(--ease-out)] motion-safe:data-[state=open]:data-[pulsing=even]:animate-[toast-pulse-b_200ms_var(--ease-out)] data-[swipe=move]:transition-none transition-[transform,translate,min-height,max-height,opacity] duration-400 ease-[ease] data-[collapsed=false]:duration-200 data-[collapsed=false]:ease-out data-[collapsed=false]:*:duration-200 data-[collapsed=false]:*:ease-out motion-reduce:transition-opacity'
  },
  variants: {
    position: {
      'top-left': {
        viewport: 'left-4 top-4',
        base: 'top-0 starting:transform-[translateY(-100%)]'
      },
      'top-center': {
        viewport: 'left-1/2 transform -translate-x-1/2 top-4',
        base: 'top-0 starting:transform-[translateY(-100%)]'
      },
      'top-right': {
        viewport: 'right-4 top-4',
        base: 'top-0 starting:transform-[translateY(-100%)]'
      },
      'bottom-left': {
        viewport: 'left-4 bottom-4',
        base: 'bottom-0 starting:transform-[translateY(100%)]'
      },
      'bottom-center': {
        viewport: 'left-1/2 transform -translate-x-1/2 bottom-4',
        base: 'bottom-0 starting:transform-[translateY(100%)]'
      },
      'bottom-right': {
        viewport: 'right-4 bottom-4',
        base: 'bottom-0 starting:transform-[translateY(100%)]'
      }
    },
    swipeDirection: {
      up: { base: 'data-[swipe=end]:animate-[toast-slide-up_200ms_var(--ease-out)] data-[swipe=move]:translate-y-(--reka-toast-swipe-move-y) data-[swipe=end]:translate-y-(--reka-toast-swipe-end-y) data-[swipe=cancel]:translate-y-0' },
      right: { base: 'data-[swipe=end]:animate-[toast-slide-right_200ms_var(--ease-out)] data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x) data-[swipe=end]:translate-x-(--reka-toast-swipe-end-x) data-[swipe=cancel]:translate-x-0' },
      down: { base: 'data-[swipe=end]:animate-[toast-slide-down_200ms_var(--ease-out)] data-[swipe=move]:translate-y-(--reka-toast-swipe-move-y) data-[swipe=end]:translate-y-(--reka-toast-swipe-end-y) data-[swipe=cancel]:translate-y-0' },
      left: { base: 'data-[swipe=end]:animate-[toast-slide-left_200ms_var(--ease-out)] data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x) data-[swipe=end]:translate-x-(--reka-toast-swipe-end-x) data-[swipe=cancel]:translate-x-0' }
    }
  },
  defaultVariants: {
    position: 'bottom-right'
  }
})
