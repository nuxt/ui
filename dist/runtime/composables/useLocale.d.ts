import type { InjectionKey, Ref } from 'vue';
import type { Locale, Messages } from '../types/locale';
export declare const localeContextInjectionKey: InjectionKey<Ref<Locale<unknown> | undefined>>;
export declare const useLocale: (localeOverrides?: Ref<Locale<Messages> | undefined>) => import("../utils/locale").LocaleContext<Messages>;
