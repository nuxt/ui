// @ts-expect-error - no types available
import components from '#component-example/nitro'

export default defineCachedEventHandler((event) => {
  appendHeader(event, 'Access-Control-Allow-Origin', '*')

  return Object.entries<{ pascalName: string }>(components).map(([_key, value]) => {
    return value.pascalName
  })
}, {
  name: 'mcp-list-examples',
  maxAge: 3600 // 1 hour
})
