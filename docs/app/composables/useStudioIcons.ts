import { toReactive } from '@vueuse/core'
import { studioIcons, STUDIO_EXTRA_DEFAULTS, studioExtraOverrides } from '../utils/theme'

/**
 * The studio-chrome glyphs (toolbar controls, Ask-AI, theme picker) for the
 * ACTIVE icon pack, so the studio's own UI skins to the applied theme. Falls
 * back to Lucide for any unrecognized pack name. Returned as a reactive object
 * (not a ref) — like useStudioExtraIcons — so `studioIcons.undo` resolves
 * directly in both script and templates.
 */
export function useStudioIcons() {
  const { icon } = useTheme()
  // The pack is client-only state, so rendering it straight away puts the
  // FIRST client render at odds with the server's lucide — and Vue only warns
  // about a mismatched class, it doesn't patch it. The chrome would then keep
  // the server's glyphs until something else forced a re-render, which is why
  // a persisted pack survived a reload everywhere except here. Resolving after
  // mount agrees with SSR first, so the swap is a real update.
  const mounted = ref(false)
  onMounted(() => (mounted.value = true))
  return toReactive(computed(() => (mounted.value
    ? studioIcons[icon.value as keyof typeof studioIcons] ?? studioIcons.lucide
    : studioIcons.lucide)))
}

/**
 * The extended functional glyphs the preview demos use (dashboard nav, account
 * menus, etc.) resolved for the active pack — each pack's override merged over
 * the Lucide defaults, so an unset pack/key falls back to Lucide. Returned as a
 * reactive object (not a ref) so `extra.home` resolves directly in both script
 * arrays and templates, exactly like `appConfig.ui.icons.*`.
 */
export function useStudioExtraIcons() {
  const { icon } = useTheme()
  return toReactive(computed(() => ({
    ...STUDIO_EXTRA_DEFAULTS,
    ...(studioExtraOverrides[icon.value as keyof typeof studioExtraOverrides] ?? {})
  })))
}
