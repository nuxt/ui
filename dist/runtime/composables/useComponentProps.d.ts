import type { ComputedRef } from 'vue';
import type { ClassValue } from 'tailwind-variants';
import type * as ComponentTypes from '../types';
import type * as ui from '#build/ui';
type ThemeSlotOverrides<T> = T extends {
    slots: infer S extends Record<string, any>;
} ? {
    [K in keyof S]?: ClassValue;
} : {
    [K in keyof T]?: T[K] extends any[] ? ClassValue : T[K] extends Record<string, any> ? ThemeSlotOverrides<T[K]> : ClassValue;
};
/**
 * Flat slot-class override shape: `{ button: { base: '...' }, modal: {...} }`.
 * Powers the `:ui` prop on `<UTheme>`, which remains the recommended way to
 * scope class overrides without touching component prop defaults.
 */
export type ThemeUI = {
    [K in keyof typeof ui]?: ThemeSlotOverrides<(typeof ui)[K]>;
};
/**
 * Strict per-component defaults shape used by `<UTheme :props>`. Authored as
 * a flat interface with literal keys (rather than a mapped type) so editors —
 * Volar in particular — surface key completions inside template inline
 * objects (`:props="{ button: { … } }"`). Volar reliably iterates interface
 * members but not mapped-type members in this position.
 *
 * Keys mirror the theme registry exposed by `#build/ui` (see
 * `src/templates.ts`): every themable component gets one camelCase entry
 * whose value is a `Partial` of that component's `<PascalCase>Props`.
 */
export interface ThemeDefaults {
    accordion?: Partial<ComponentTypes.AccordionProps>;
    alert?: Partial<ComponentTypes.AlertProps>;
    authForm?: Partial<ComponentTypes.AuthFormProps>;
    avatar?: Partial<ComponentTypes.AvatarProps>;
    avatarGroup?: Partial<ComponentTypes.AvatarGroupProps>;
    badge?: Partial<ComponentTypes.BadgeProps>;
    banner?: Partial<ComponentTypes.BannerProps>;
    blogPost?: Partial<ComponentTypes.BlogPostProps>;
    blogPosts?: Partial<ComponentTypes.BlogPostsProps>;
    breadcrumb?: Partial<ComponentTypes.BreadcrumbProps>;
    button?: Partial<ComponentTypes.ButtonProps>;
    calendar?: Partial<ComponentTypes.CalendarProps>;
    card?: Partial<ComponentTypes.CardProps>;
    carousel?: Partial<ComponentTypes.CarouselProps>;
    changelogVersion?: Partial<ComponentTypes.ChangelogVersionProps>;
    changelogVersions?: Partial<ComponentTypes.ChangelogVersionsProps>;
    chatMessage?: Partial<ComponentTypes.ChatMessageProps>;
    chatMessages?: Partial<ComponentTypes.ChatMessagesProps>;
    chatPalette?: Partial<ComponentTypes.ChatPaletteProps>;
    chatPrompt?: Partial<ComponentTypes.ChatPromptProps>;
    chatPromptSubmit?: Partial<ComponentTypes.ChatPromptSubmitProps>;
    chatReasoning?: Partial<ComponentTypes.ChatReasoningProps>;
    chatShimmer?: Partial<ComponentTypes.ChatShimmerProps>;
    chatTool?: Partial<ComponentTypes.ChatToolProps>;
    checkbox?: Partial<ComponentTypes.CheckboxProps>;
    checkboxGroup?: Partial<ComponentTypes.CheckboxGroupProps>;
    chip?: Partial<ComponentTypes.ChipProps>;
    collapsible?: Partial<ComponentTypes.CollapsibleProps>;
    colorPicker?: Partial<ComponentTypes.ColorPickerProps>;
    commandPalette?: Partial<ComponentTypes.CommandPaletteProps>;
    container?: Partial<ComponentTypes.ContainerProps>;
    contentNavigation?: Partial<ComponentTypes.ContentNavigationProps>;
    contentSearch?: Partial<ComponentTypes.ContentSearchProps>;
    contentSearchButton?: Partial<ComponentTypes.ContentSearchButtonProps>;
    contentSurround?: Partial<ComponentTypes.ContentSurroundProps>;
    contentToc?: Partial<ComponentTypes.ContentTocProps>;
    contextMenu?: Partial<ComponentTypes.ContextMenuProps>;
    dashboardGroup?: Partial<ComponentTypes.DashboardGroupProps>;
    dashboardNavbar?: Partial<ComponentTypes.DashboardNavbarProps>;
    dashboardPanel?: Partial<ComponentTypes.DashboardPanelProps>;
    dashboardResizeHandle?: Partial<ComponentTypes.DashboardResizeHandleProps>;
    dashboardSearch?: Partial<ComponentTypes.DashboardSearchProps>;
    dashboardSearchButton?: Partial<ComponentTypes.DashboardSearchButtonProps>;
    dashboardSidebar?: Partial<ComponentTypes.DashboardSidebarProps>;
    dashboardSidebarCollapse?: Partial<ComponentTypes.DashboardSidebarCollapseProps>;
    dashboardSidebarToggle?: Partial<ComponentTypes.DashboardSidebarToggleProps>;
    dashboardToolbar?: Partial<ComponentTypes.DashboardToolbarProps>;
    drawer?: Partial<ComponentTypes.DrawerProps>;
    dropdownMenu?: Partial<ComponentTypes.DropdownMenuProps>;
    editor?: Partial<ComponentTypes.EditorProps>;
    editorDragHandle?: Partial<ComponentTypes.EditorDragHandleProps>;
    editorToolbar?: Partial<ComponentTypes.EditorToolbarProps>;
    empty?: Partial<ComponentTypes.EmptyProps>;
    error?: Partial<ComponentTypes.ErrorProps>;
    fieldGroup?: Partial<ComponentTypes.FieldGroupProps>;
    fileUpload?: Partial<ComponentTypes.FileUploadProps>;
    footer?: Partial<ComponentTypes.FooterProps>;
    footerColumns?: Partial<ComponentTypes.FooterColumnsProps>;
    form?: Partial<ComponentTypes.FormProps<any, any, any>>;
    formField?: Partial<ComponentTypes.FormFieldProps>;
    header?: Partial<ComponentTypes.HeaderProps>;
    input?: Partial<ComponentTypes.InputProps>;
    inputDate?: Partial<ComponentTypes.InputDateProps>;
    inputMenu?: Partial<ComponentTypes.InputMenuProps>;
    inputNumber?: Partial<ComponentTypes.InputNumberProps>;
    inputTags?: Partial<ComponentTypes.InputTagsProps>;
    inputTime?: Partial<ComponentTypes.InputTimeProps>;
    kbd?: Partial<ComponentTypes.KbdProps>;
    listbox?: Partial<ComponentTypes.ListboxProps>;
    main?: Partial<ComponentTypes.MainProps>;
    marquee?: Partial<ComponentTypes.MarqueeProps>;
    modal?: Partial<ComponentTypes.ModalProps>;
    navigationMenu?: Partial<ComponentTypes.NavigationMenuProps>;
    page?: Partial<ComponentTypes.PageProps>;
    pageAnchors?: Partial<ComponentTypes.PageAnchorsProps>;
    pageAside?: Partial<ComponentTypes.PageAsideProps>;
    pageBody?: Partial<ComponentTypes.PageBodyProps>;
    pageCTA?: Partial<ComponentTypes.PageCTAProps>;
    pageCard?: Partial<ComponentTypes.PageCardProps>;
    pageColumns?: Partial<ComponentTypes.PageColumnsProps>;
    pageFeature?: Partial<ComponentTypes.PageFeatureProps>;
    pageGrid?: Partial<ComponentTypes.PageGridProps>;
    pageHeader?: Partial<ComponentTypes.PageHeaderProps>;
    pageHero?: Partial<ComponentTypes.PageHeroProps>;
    pageLinks?: Partial<ComponentTypes.PageLinksProps>;
    pageList?: Partial<ComponentTypes.PageListProps>;
    pageLogos?: Partial<ComponentTypes.PageLogosProps>;
    pageSection?: Partial<ComponentTypes.PageSectionProps>;
    pagination?: Partial<ComponentTypes.PaginationProps>;
    pinInput?: Partial<ComponentTypes.PinInputProps>;
    popover?: Partial<ComponentTypes.PopoverProps>;
    pricingPlan?: Partial<ComponentTypes.PricingPlanProps>;
    pricingPlans?: Partial<ComponentTypes.PricingPlansProps>;
    pricingTable?: Partial<ComponentTypes.PricingTableProps>;
    progress?: Partial<ComponentTypes.ProgressProps>;
    radioGroup?: Partial<ComponentTypes.RadioGroupProps>;
    scrollArea?: Partial<ComponentTypes.ScrollAreaProps>;
    select?: Partial<ComponentTypes.SelectProps>;
    selectMenu?: Partial<ComponentTypes.SelectMenuProps>;
    separator?: Partial<ComponentTypes.SeparatorProps>;
    sidebar?: Partial<ComponentTypes.SidebarProps>;
    skeleton?: Partial<ComponentTypes.SkeletonProps>;
    slideover?: Partial<ComponentTypes.SlideoverProps>;
    slider?: Partial<ComponentTypes.SliderProps>;
    stepper?: Partial<ComponentTypes.StepperProps>;
    switch?: Partial<ComponentTypes.SwitchProps>;
    table?: Partial<ComponentTypes.TableProps>;
    tabs?: Partial<ComponentTypes.TabsProps>;
    textarea?: Partial<ComponentTypes.TextareaProps>;
    timeline?: Partial<ComponentTypes.TimelineProps>;
    toast?: Partial<ComponentTypes.ToastProps>;
    toaster?: Partial<ComponentTypes.ToasterProps>;
    tooltip?: Partial<ComponentTypes.TooltipProps>;
    tree?: Partial<ComponentTypes.TreeProps>;
    user?: Partial<ComponentTypes.UserProps>;
}
/**
 * Loose internal shape stored on the injected `ThemeContext`. Allows the
 * `prose` namespace (lifted by `normalizeUi`) and any unknown keys to flow
 * through without polluting the user-facing `ThemeDefaults` type.
 */
export type ThemeContextDefaults = ThemeDefaults & {
    [name: string]: Record<string, any> | undefined;
};
export type ThemeContext = {
    defaults: ComputedRef<ThemeContextDefaults>;
};
declare const provideThemeContext: (contextValue: ThemeContext) => ThemeContext;
/**
 * Module-level fallback so components can call `useComponentProps` outside any
 * `<UTheme>` wrapper without crashing.
 */
export declare const defaultThemeContext: ThemeContext;
export declare function injectThemeContext(fallback?: ThemeContext): ThemeContext;
export { provideThemeContext };
/**
 * Resolve a component's props with the priority chain:
 *   explicit prop > nearest UTheme > withDefaults
 *     > app.config.ui.<name>.defaultVariants
 *
 * The returned proxy transparently reads from `props`, falling through to the
 * injected `ThemeContext` and `app.config.ui.<name>.defaultVariants` for
 * defaults. The component's tv() `defaultVariants` are intentionally left out
 * of the proxy fallback — they continue to drive `tv()`-internal class
 * resolution (the original semantics) without leaking into prop reads. The
 * `ui` prop is deep-merged (explicit slot classes override theme slot classes)
 * instead of being replaced.
 */
export declare function useComponentProps<T extends object>(name: string, props: T): T;
