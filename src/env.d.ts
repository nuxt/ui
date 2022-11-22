import type { DefaultPreset } from './runtime/presets/default'

declare module '#build/ui' {
  declare const preset: DefaultPreset
  export default preset
}
