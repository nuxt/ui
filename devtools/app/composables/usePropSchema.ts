import type { PropertyMeta } from 'vue-component-meta'
import BooleanInput, { booleanInputSchema } from '../components/inputs/BooleanInput.vue'
import StringInput, { stringInputSchema } from '../components/inputs/StringInput.vue'
import NumberInput, { numberInputSchema } from '../components/inputs/NumberInput.vue'
import StringEnumInput, { stringEnumInputSchema } from '../components/inputs/StringEnumInput.vue'
import ObjectInput, { objectInputSchema } from '../components/inputs/ObjectInput.vue'
import ArrayInput, { arrayInputSchema } from '../components/inputs/ArrayInput.vue'

// List of available inputs.
const availableInputs = [
  { id: 'string', schema: stringInputSchema, component: StringInput },
  { id: 'number', schema: numberInputSchema, component: NumberInput },
  { id: 'boolean', schema: booleanInputSchema, component: BooleanInput },
  { id: 'stringEnum', schema: stringEnumInputSchema, component: StringEnumInput },
  { id: 'object', schema: objectInputSchema, component: ObjectInput },
  { id: 'array', schema: arrayInputSchema, component: ArrayInput }
]

export function usePropSchema() {
  function resolveInputSchema(schema: PropertyMeta['schema']): { schema: PropertyMeta['schema'], input: any } | undefined {
    // Return the first input in the list of available inputs that matches the schema.
    for (const input of availableInputs) {
      const result = input.schema.safeParse(schema)
      if (result.success) {
        // Returns the output from zod to get the transformed output.
        // It only includes attributes defined in the zod schema.
        return { schema: result.data as PropertyMeta['schema'], input }
      }
    }

    if (typeof schema === 'string') return

    // If the schema is a complex enum or array return the first nested schema that matches an input.
    if (schema.kind === 'enum' && schema.schema) {
      const enumSchemas = typeof schema.schema === 'object' ? Object.values(schema.schema) : schema.schema
      for (const enumSchema of enumSchemas) {
        const result = resolveInputSchema(enumSchema)
        if (result) return result
      }
    }
  }

  return { resolveInputSchema }
}
