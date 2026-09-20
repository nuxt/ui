import type { InjectionKey, Ref } from 'vue'
import { inject, provide } from 'vue'
import { createContext } from 'reka-ui'
import type { UseResizableProps } from '../composables/useResizable'

export type DashboardSidebarTarget = 'left' | 'right' | (string & {})

export interface DashboardSidebarHookPayload {
  target?: DashboardSidebarTarget
}

export interface DashboardContext extends Pick<UseResizableProps, 'storage' | 'storageKey' | 'storageOptions' | 'persistent' | 'unit'> {
  sidebarOpen?: Ref<boolean>
  sidebarCollapsed?: Ref<boolean>
  openByTarget?: Record<string, boolean>
  collapsedByTarget?: Record<string, boolean>
  toggleSearch?: () => void
  toggleSidebar?: (target?: DashboardSidebarTarget) => void
  collapseSidebar?: (collapsed: boolean, target?: DashboardSidebarTarget) => void
}

export function matchesDashboardSidebarTarget(target: DashboardSidebarTarget | undefined, ...ids: Array<string | undefined>): boolean {
  return !target || ids.includes(target)
}

export const [useDashboard, provideDashboardContext] = createContext<DashboardContext>('DashboardGroup')

const dashboardSidebarTargetKey: InjectionKey<string> = Symbol('DashboardSidebarTarget')

export function provideDashboardSidebarTarget(target: string) {
  provide(dashboardSidebarTargetKey, target)
}

export function useDashboardSidebarTarget() {
  return inject(dashboardSidebarTargetKey, '')
}
