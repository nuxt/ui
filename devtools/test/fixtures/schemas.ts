export const stringSchema = 'string' as const

export const optionalStringSchema = {
  kind: 'enum',
  type: 'string | undefined',
  schema: {
    0: 'undefined',
    1: 'string'
  }
}

export const numberSchema = 'number' as const
export const optionalNumberSchema = {
  kind: 'enum',
  type: 'number | undefined',
  schema: {
    0: 'undefined',
    1: 'number'
  }
}

export const booleanSchema = 'boolean' as const
export const optionalBooleanSchema = {
  kind: 'enum',
  type: 'boolean | undefined',
  schema: {
    0: 'undefined',
    1: 'boolean'
  }
}

export const objectSchema = {
  kind: 'object',
  type: 'AccordionItem',
  schema: {
    label: {
      name: 'label',
      global: false,
      description: '',
      tags: [],
      required: false,
      type: 'string | undefined',
      schema: {
        kind: 'enum',
        type: 'string | undefined',
        schema: {
          0: 'undefined',
          1: 'string'
        }
      }
    }
  }
}

export const arraySchema = {
  kind: 'array',
  type: 'AccordionItem[]',
  schema: [
    {
      kind: 'object',
      type: 'AccordionItem',
      schema: {
        label: {
          name: 'label',
          global: false,
          description: '',
          tags: [],
          required: false,
          type: 'string | undefined',
          schema: {
            kind: 'enum',
            type: 'string | undefined',
            schema: {
              0: 'undefined',
              1: 'string'
            }
          }
        }
      }
    }
  ]
}

export const arrayOptionalSchema = {
  kind: 'enum',
  type: 'AccordionItem[] | undefined',
  schema: {
    0: 'undefined',
    1: {
      kind: 'array',
      type: 'AccordionItem[]',
      schema: [
        {
          kind: 'object',
          type: 'AccordionItem',
          schema: {
            label: {
              name: 'label',
              global: false,
              description: '',
              tags: [],
              required: false,
              type: 'string | undefined',
              schema: {
                kind: 'enum',
                type: 'string | undefined',
                schema: {
                  0: 'undefined',
                  1: 'string'
                }
              }
            }
          }
        }
      ]
    }
  }
}

export const stringEnumSchema = {
  kind: 'enum',
  type: '"true" | "false" | "page" | "step" | "location" | "date" | "time" | undefined',
  schema: {
    0: 'undefined',
    1: '"true"',
    2: '"false"',
    3: '"page"',
    4: '"step"',
    5: '"location"',
    6: '"date"',
    7: '"time"'
  }
}
