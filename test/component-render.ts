import path from 'node:path'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { it, expect } from 'vitest'

type MountSuspendedOptions<T> = Parameters<typeof mountSuspended<T>>[1]

async function componentRender<T>(nameOrHtml: string, options: MountSuspendedOptions<T>, component: T) {
  let html: string
  const name = component && typeof component === 'object' && '__file' in component && typeof component.__file === 'string'
    ? path.parse(component.__file).name
    : undefined
  if (options === undefined) {
    const app = {
      template: nameOrHtml,
      components: { [`U${name}`]: component }
    }
    const result = await mountSuspended(app)
    html = result.html()
  } else {
    const cResult = await mountSuspended<T>(component, options)
    html = cResult.html()
  }
  return html
}

type ExtractRestArgs<T, Cases> = Cases extends ReadonlyArray<infer Case>
  ? Case extends [string, MountSuspendedOptions<T>, ...infer Rest]
    ? Rest extends [] ? never
      : unknown[] extends Rest ? never
        : Rest
    : never
  : never

type RenderEachRest<T, Cases> = [ExtractRestArgs<T, Cases>] extends [never] ? [] : ExtractRestArgs<T, Cases>

type RenderEachFn<T, A extends any[]> = (nameOrHtml: string, options: MountSuspendedOptions<T>, ...args: A) => void | Promise<void>

function renderEach<T, const C extends ReadonlyArray<[string, MountSuspendedOptions<T>, ...any[]]>>(
  component: T,
  cases: C,
  fnOrTestName?: string | RenderEachFn<T, RenderEachRest<T, C>>,
  fn?: RenderEachFn<T, RenderEachRest<T, C>>
) {
  const testName = typeof fnOrTestName === 'string' ? fnOrTestName : 'renders %s correctly'
  const callback = typeof fnOrTestName === 'function' ? fnOrTestName : fn

  return it.each(cases as ReadonlyArray<[string, MountSuspendedOptions<T>, ...any[]]>)(testName, async (nameOrHtml: string, options: MountSuspendedOptions<T>, ...args: RenderEachRest<T, C>) => {
    if (callback) {
      await callback(nameOrHtml, options, ...args)
    } else {
      const html = await componentRender<T>(nameOrHtml, options, component)
      expect(html).toMatchSnapshot()
    }
  })
}

export { componentRender as default, componentRender, renderEach }
