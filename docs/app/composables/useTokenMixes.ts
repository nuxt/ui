import { MIX_TARGETS, normalizeExtras } from '../utils/theme/engine/extras'

/**
 * Opacity sliders for the recipe roles a section owns, `--ui-primary-bg-soft`
 * as the primary at 10%. A reset restores the active preset's value, or the
 * recipe when the preset sets none.
 */
export function useTokenMixes(section: typeof MIX_TARGETS[number]['section']) {
  const { mixes, setMixes } = useTheme()
  const { baselineDoc } = useThemeStudio()

  const baseline = computed(() => normalizeExtras(baselineDoc.value).mixes ?? {})

  const rows = MIX_TARGETS.filter(target => target.section === section).map((target) => {
    const model = computed({
      get: () => mixes.value[target.token] ?? target.default,
      set: (value: number) => setMixes({ ...mixes.value, [target.token]: value })
    })
    const dirty = computed(() => mixes.value[target.token] !== baseline.value[target.token])
    function reset() {
      const next = { ...mixes.value }
      const value = baseline.value[target.token]
      if (value !== undefined) next[target.token] = value
      else Reflect.deleteProperty(next, target.token)
      setMixes(next)
    }
    return { ...target, model, dirty, reset }
  })

  const dirty = computed(() => rows.some(row => row.dirty.value))

  function reset() {
    rows.forEach(row => row.reset())
  }

  return { rows, dirty, reset }
}
