import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/blog-post';
import type { BadgeProps, LinkProps, UserProps } from '../types';
import type { ImgHTMLAttributes } from '../types/html';
import type { ComponentConfig } from '../types/tv';
type BlogPost = ComponentConfig<typeof theme, AppConfig, 'blogPost'>;
export interface BlogPostProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'article'
     */
    as?: any;
    title?: string;
    description?: string;
    /** The date of the blog post. Can be a string or a Date object. */
    date?: string | Date;
    /**
     * Display a badge on the blog post.
     * Can be a string or an object.
     * `{ color: 'neutral', variant: 'subtle' }`{lang="ts-type"}
     */
    badge?: string | BadgeProps;
    /** The authors of the blog post. */
    authors?: UserProps[];
    /** The image of the blog post. Can be a string or an object. */
    image?: string | (Partial<ImgHTMLAttributes> & {
        [key: string]: any;
    });
    /**
     * The orientation of the blog post.
     * @defaultValue 'vertical'
     */
    orientation?: BlogPost['variants']['orientation'];
    /**
     * @defaultValue 'outline'
     */
    variant?: BlogPost['variants']['variant'];
    to?: LinkProps['to'];
    target?: LinkProps['target'];
    onClick?: (event: MouseEvent) => void | Promise<void>;
    class?: any;
    ui?: BlogPost['slots'];
}
export interface BlogPostSlots {
    date?(props?: {}): VNode[];
    badge?(props?: {}): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    authors?(props: {
        ui: BlogPost['ui'];
    }): VNode[];
    header?(props: {
        ui: BlogPost['ui'];
    }): VNode[];
    body?(props?: {}): VNode[];
    footer?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<BlogPostProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BlogPostProps> & Readonly<{}>, {
    orientation: BlogPost["variants"]["orientation"];
    as: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, BlogPostSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
