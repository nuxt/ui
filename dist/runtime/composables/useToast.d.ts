import type { Ref, InjectionKey } from 'vue';
import type { ToastProps, ToastEmits } from '../types';
import type { EmitsToProps } from '../types/utils';
export declare const toastMaxInjectionKey: InjectionKey<Ref<number | undefined>>;
export interface Toast extends Omit<ToastProps, 'defaultOpen'>, EmitsToProps<ToastEmits> {
    id: string | number;
    onClick?: (toast: Toast) => void;
    /** @internal */
    _duplicate?: number;
    /** @internal */
    _updated?: boolean;
}
export declare function useToast(): {
    toasts: any;
    add: (toast: Partial<Toast>) => Toast;
    update: (id: string | number, toast: Omit<Partial<Toast>, "id">) => void;
    remove: (id: string | number) => void;
    clear: () => void;
};
