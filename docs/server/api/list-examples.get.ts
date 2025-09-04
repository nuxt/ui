import { appendHeader, defineEventHandler } from 'h3'
// @ts-expect-error - no types available
import components from '#component-example/nitro'

export default defineEventHandler((event) => {
  appendHeader(event, 'Access-Control-Allow-Origin', '*')

  return Object.entries<{ pascalName: string }>(components).map(([_key, value]) => {
    return value.pascalName
  })
})
