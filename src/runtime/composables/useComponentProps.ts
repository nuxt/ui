import type { ComputedRef, VNode } from 'vue'
import type { ClassValue } from 'tailwind-variants'
import { computed, getCurrentInstance } from 'vue'
import defu from 'defu'
import { createContext } from 'reka-ui'
import { useAppConfig } from '#imports'
import type * as ComponentTypes from '../types'
import type * as ui from '#build/ui'
import { get } from '../utils'

type ThemeSlotOverrides<T> = T extends { slots: infer S extends Record<string, any> }
  ? { [K in keyof S]?: ClassValue }
  : { [K in keyof T]?: T[K] extends any[] ? ClassValue : T[K] extends Record<string, any> ? ThemeSlotOverrides<T[K]> : ClassValue }

/**
 * Flat slot-class override shape: `{ button: { base: '...' }, modal: {...} }`.
 * Powers the `:ui` prop on `<UTheme>`, which remains the recommended way to
 * scope class overrides without touching component prop defaults.
 */
export type ThemeUI = {
  [K in keyof typeof ui]?: ThemeSlotOverrides<(typeof ui)[K]>
}

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
  accordion?: Partial<ComponentTypes.AccordionProps>
  alert?: Partial<ComponentTypes.AlertProps>
  authForm?: Partial<ComponentTypes.AuthFormProps>
  avatar?: Partial<ComponentTypes.AvatarProps>
  avatarGroup?: Partial<ComponentTypes.AvatarGroupProps>
  badge?: Partial<ComponentTypes.BadgeProps>
  banner?: Partial<ComponentTypes.BannerProps>
  blogPost?: Partial<ComponentTypes.BlogPostProps>
  blogPosts?: Partial<ComponentTypes.BlogPostsProps>
  breadcrumb?: Partial<ComponentTypes.BreadcrumbProps>
  button?: Partial<ComponentTypes.ButtonProps>
  calendar?: Partial<ComponentTypes.CalendarProps>
  card?: Partial<ComponentTypes.CardProps>
  carousel?: Partial<ComponentTypes.CarouselProps>
  changelogVersion?: Partial<ComponentTypes.ChangelogVersionProps>
  changelogVersions?: Partial<ComponentTypes.ChangelogVersionsProps>
  chatMessage?: Partial<ComponentTypes.ChatMessageProps>
  chatMessages?: Partial<ComponentTypes.ChatMessagesProps>
  chatPalette?: Partial<ComponentTypes.ChatPaletteProps>
  chatPrompt?: Partial<ComponentTypes.ChatPromptProps>
  chatPromptSubmit?: Partial<ComponentTypes.ChatPromptSubmitProps>
  chatReasoning?: Partial<ComponentTypes.ChatReasoningProps>
  chatShimmer?: Partial<ComponentTypes.ChatShimmerProps>
  chatTool?: Partial<ComponentTypes.ChatToolProps>
  checkbox?: Partial<ComponentTypes.CheckboxProps>
  checkboxGroup?: Partial<ComponentTypes.CheckboxGroupProps>
  chip?: Partial<ComponentTypes.ChipProps>
  collapsible?: Partial<ComponentTypes.CollapsibleProps>
  colorPicker?: Partial<ComponentTypes.ColorPickerProps>
  commandPalette?: Partial<ComponentTypes.CommandPaletteProps>
  container?: Partial<ComponentTypes.ContainerProps>
  contentNavigation?: Partial<ComponentTypes.ContentNavigationProps>
  contentSearch?: Partial<ComponentTypes.ContentSearchProps>
  contentSearchButton?: Partial<ComponentTypes.ContentSearchButtonProps>
  contentSurround?: Partial<ComponentTypes.ContentSurroundProps>
  contentToc?: Partial<ComponentTypes.ContentTocProps>
  contextMenu?: Partial<ComponentTypes.ContextMenuProps>
  dashboardGroup?: Partial<ComponentTypes.DashboardGroupProps>
  dashboardNavbar?: Partial<ComponentTypes.DashboardNavbarProps>
  dashboardPanel?: Partial<ComponentTypes.DashboardPanelProps>
  dashboardResizeHandle?: Partial<ComponentTypes.DashboardResizeHandleProps>
  dashboardSearch?: Partial<ComponentTypes.DashboardSearchProps>
  dashboardSearchButton?: Partial<ComponentTypes.DashboardSearchButtonProps>
  dashboardSidebar?: Partial<ComponentTypes.DashboardSidebarProps>
  dashboardSidebarCollapse?: Partial<ComponentTypes.DashboardSidebarCollapseProps>
  dashboardSidebarToggle?: Partial<ComponentTypes.DashboardSidebarToggleProps>
  dashboardToolbar?: Partial<ComponentTypes.DashboardToolbarProps>
  drawer?: Partial<ComponentTypes.DrawerProps>
  dropdownMenu?: Partial<ComponentTypes.DropdownMenuProps>
  editor?: Partial<ComponentTypes.EditorProps>
  editorDragHandle?: Partial<ComponentTypes.EditorDragHandleProps>
  editorToolbar?: Partial<ComponentTypes.EditorToolbarProps>
  empty?: Partial<ComponentTypes.EmptyProps>
  error?: Partial<ComponentTypes.ErrorProps>
  fieldGroup?: Partial<ComponentTypes.FieldGroupProps>
  fileUpload?: Partial<ComponentTypes.FileUploadProps>
  footer?: Partial<ComponentTypes.FooterProps>
  footerColumns?: Partial<ComponentTypes.FooterColumnsProps>
  // TODO: `FormProps` carries three generics for state, schema, and fields —
  // none of which are themable defaults. Loosened to `any` so this entry stays
  // assignable from any concrete `Form` instance.
  form?: Partial<ComponentTypes.FormProps<any, any, any>>
  formField?: Partial<ComponentTypes.FormFieldProps>
  header?: Partial<ComponentTypes.HeaderProps>
  input?: Partial<ComponentTypes.InputProps>
  inputDate?: Partial<ComponentTypes.InputDateProps>
  inputMenu?: Partial<ComponentTypes.InputMenuProps>
  inputNumber?: Partial<ComponentTypes.InputNumberProps>
  inputTags?: Partial<ComponentTypes.InputTagsProps>
  inputTime?: Partial<ComponentTypes.InputTimeProps>
  kbd?: Partial<ComponentTypes.KbdProps>
  listbox?: Partial<ComponentTypes.ListboxProps>
  main?: Partial<ComponentTypes.MainProps>
  marquee?: Partial<ComponentTypes.MarqueeProps>
  modal?: Partial<ComponentTypes.ModalProps>
  navigationMenu?: Partial<ComponentTypes.NavigationMenuProps>
  page?: Partial<ComponentTypes.PageProps>
  pageAnchors?: Partial<ComponentTypes.PageAnchorsProps>
  pageAside?: Partial<ComponentTypes.PageAsideProps>
  pageBody?: Partial<ComponentTypes.PageBodyProps>
  pageCTA?: Partial<ComponentTypes.PageCTAProps>
  pageCard?: Partial<ComponentTypes.PageCardProps>
  pageColumns?: Partial<ComponentTypes.PageColumnsProps>
  pageFeature?: Partial<ComponentTypes.PageFeatureProps>
  pageGrid?: Partial<ComponentTypes.PageGridProps>
  pageHeader?: Partial<ComponentTypes.PageHeaderProps>
  pageHero?: Partial<ComponentTypes.PageHeroProps>
  pageLinks?: Partial<ComponentTypes.PageLinksProps>
  pageList?: Partial<ComponentTypes.PageListProps>
  pageLogos?: Partial<ComponentTypes.PageLogosProps>
  pageSection?: Partial<ComponentTypes.PageSectionProps>
  pagination?: Partial<ComponentTypes.PaginationProps>
  pinInput?: Partial<ComponentTypes.PinInputProps>
  popover?: Partial<ComponentTypes.PopoverProps>
  pricingPlan?: Partial<ComponentTypes.PricingPlanProps>
  pricingPlans?: Partial<ComponentTypes.PricingPlansProps>
  pricingTable?: Partial<ComponentTypes.PricingTableProps>
  progress?: Partial<ComponentTypes.ProgressProps>
  radioGroup?: Partial<ComponentTypes.RadioGroupProps>
  scrollArea?: Partial<ComponentTypes.ScrollAreaProps>
  select?: Partial<ComponentTypes.SelectProps>
  selectMenu?: Partial<ComponentTypes.SelectMenuProps>
  separator?: Partial<ComponentTypes.SeparatorProps>
  sidebar?: Partial<ComponentTypes.SidebarProps>
  skeleton?: Partial<ComponentTypes.SkeletonProps>
  slideover?: Partial<ComponentTypes.SlideoverProps>
  slider?: Partial<ComponentTypes.SliderProps>
  stepper?: Partial<ComponentTypes.StepperProps>
  switch?: Partial<ComponentTypes.SwitchProps>
  table?: Partial<ComponentTypes.TableProps>
  tabs?: Partial<ComponentTypes.TabsProps>
  textarea?: Partial<ComponentTypes.TextareaProps>
  timeline?: Partial<ComponentTypes.TimelineProps>
  toast?: Partial<ComponentTypes.ToastProps>
  toaster?: Partial<ComponentTypes.ToasterProps>
  tooltip?: Partial<ComponentTypes.TooltipProps>
  tree?: Partial<ComponentTypes.TreeProps>
  user?: Partial<ComponentTypes.UserProps>
}

/**
 * Loose internal shape stored on the injected `ThemeContext`. Allows the
 * `prose` namespace (lifted by `normalizeUi`) and any unknown keys to flow
 * through without polluting the user-facing `ThemeDefaults` type.
 */
export type ThemeContextDefaults = ThemeDefaults & {
  [name: string]: Record<string, any> | undefined
}

export type ThemeContext = {
  defaults: ComputedRef<ThemeContextDefaults>
}

const [_injectThemeContext, provideThemeContext] = createContext<ThemeContext>('UTheme', 'RootContext')

/**
 * Module-level fallback so components can call `useComponentProps` outside any
 * `<UTheme>` wrapper without crashing.
 */
export const defaultThemeContext: ThemeContext = {
  defaults: computed(() => ({}))
}

export function injectThemeContext(fallback: ThemeContext = defaultThemeContext): ThemeContext {
  return _injectThemeContext(fallback)
}

export { provideThemeContext }

function camelCase(str: string): string {
  return str.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
}

function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)
}

/**
 * Vuetify-style detection for whether a prop was explicitly passed by the parent,
 * distinguishing "user set it" from "got the `withDefaults` fallback".
 * Checks both camelCase and kebab-case names to cover both template conventions.
 */
function propIsDefined(vnode: VNode | null | undefined, prop: string): boolean {
  if (!vnode || !vnode.props) return false
  return vnode.props[camelCase(prop)] !== undefined
    || vnode.props[kebabCase(prop)] !== undefined
}

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
export function useComponentProps<T extends object>(name: string, props: T): T {
  const vm = getCurrentInstance()
  const { defaults } = injectThemeContext()
  const appConfig = useAppConfig() as { ui?: Record<string, any> }

  return new Proxy(props, {
    get(target, prop, receiver) {
      // Advertise as a Vue reactive proxy so `toRefs`, `reactiveOmit`,
      // `reactivePick`, and similar utilities don't warn when given the proxy.
      // Reads still flow through to the underlying reactive `props` object
      // returned by `defineProps`, so reactivity tracking works normally.
      if (prop === '__v_isReactive') return true
      if (prop === '__v_raw') return target

      const raw = Reflect.get(target, prop, receiver)
      if (typeof prop !== 'string') return raw

      // Support dotted-path names (e.g. `prose.p`, `prose.code`) so prose
      // components can pull from the same nested `ThemeContext.defaults` shape
      // that `normalizeUi` produces in `<UTheme>`.
      const themeEntry = name.includes('.') ? get(defaults.value, name) : defaults.value[name]

      if (prop === 'ui') {
        const themeUi = themeEntry?.ui
        if (!raw && !themeUi) return raw
        return defu(raw ?? {}, themeUi ?? {})
      }

      if (vm && propIsDefined(vm.vnode, prop)) return raw

      const themeValue = themeEntry?.[prop]
      if (themeValue !== undefined) return themeValue

      // Only fall back to `raw` when `withDefaults` set an explicit default for
      // this prop. Otherwise Vue's runtime would auto-cast unset Boolean props
      // to `false` (and other typed props to their normalized fallback), which
      // would override defaults baked into the underlying primitive when those
      // props are forwarded downstream.
      const propDef = (vm?.type as any)?.props?.[prop]
      if (propDef && Object.prototype.hasOwnProperty.call(propDef, 'default')) {
        return raw
      }

      const appConfigEntry = name.includes('.') ? get(appConfig.ui ?? {}, name) : appConfig.ui?.[name]
      return appConfigEntry?.defaultVariants?.[prop]
    },
    // `has`, `ownKeys`, and `getOwnPropertyDescriptor` reflect the underlying
    // `defineProps` schema only — theme defaults are NOT enumerable. As a
    // result, `Object.keys(props)`, `for…in`, and `{ ...props }` see only the
    // declared prop keys, but each value lookup still flows through the proxy.
    // This is the contract our internal `useForwardProps` relies on.
    has: (t, p) => Reflect.has(t, p),
    ownKeys: t => Reflect.ownKeys(t),
    getOwnPropertyDescriptor: (t, p) => Reflect.getOwnPropertyDescriptor(t, p)
  })
}
