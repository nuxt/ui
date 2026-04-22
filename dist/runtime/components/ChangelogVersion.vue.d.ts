import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/changelog-version';
import type { BadgeProps, LinkProps, UserProps } from '../types';
import type { ImgHTMLAttributes } from '../types/html';
import type { ComponentConfig } from '../types/tv';
type ChangelogVersion = ComponentConfig<typeof theme, AppConfig, 'changelogVersion'>;
export interface ChangelogVersionProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'article'
     */
    as?: any;
    title?: string;
    description?: string;
    /** The date of the changelog version. Can be a string or a Date object. */
    date?: string | Date;
    /**
     * Display a badge on the changelog version.
     * Can be a string or an object.
     * `{ color: 'neutral', variant: 'solid' }`{lang="ts-type"}
     */
    badge?: string | BadgeProps;
    /** The authors of the changelog version. */
    authors?: UserProps[];
    /** The image of the changelog version. Can be a string or an object. */
    image?: string | (Partial<ImgHTMLAttributes> & {
        [key: string]: any;
    });
    /**
     * Display an indicator dot on the left.
     * @defaultValue true
     */
    indicator?: boolean;
    to?: LinkProps['to'];
    target?: LinkProps['target'];
    onClick?: (event: MouseEvent) => void | Promise<void>;
    class?: any;
    ui?: ChangelogVersion['slots'];
}
export interface ChangelogVersionSlots {
    header?(props?: {}): VNode[];
    badge?(props: {
        ui: ChangelogVersion['ui'];
    }): VNode[];
    date?(props?: {}): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    image?(props: {
        ui: ChangelogVersion['ui'];
    }): VNode[];
    body?(props?: {}): VNode[];
    footer?(props?: {}): VNode[];
    authors?(props?: {}): VNode[];
    actions?(props?: {}): VNode[];
    indicator?(props: {
        ui: ChangelogVersion['ui'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ChangelogVersionProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ChangelogVersionProps> & Readonly<{}>, {
    as: any;
    indicator: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ChangelogVersionSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
