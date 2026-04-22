import type { Ref } from 'vue';
import type { UseResizableProps } from '../composables/useResizable';
export interface DashboardContext extends Pick<UseResizableProps, 'storage' | 'storageKey' | 'persistent' | 'unit'> {
    sidebarOpen?: Ref<boolean>;
    sidebarCollapsed?: Ref<boolean>;
    toggleSearch?: () => void;
    toggleSidebar?: () => void;
    collapseSidebar?: (collapsed: boolean) => void;
}
export declare const useDashboard: <T extends DashboardContext | null | undefined = DashboardContext>(fallback?: T | undefined) => T extends null ? DashboardContext | null : DashboardContext, provideDashboardContext: (contextValue: DashboardContext) => DashboardContext;
