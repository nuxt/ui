import fs from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  hooks: {
    'rollup:done': async (ctx) => {
      // copy env.d.ts to dist
      await fs.copyFile(resolve('src/env.d.ts'), join(ctx.options.outDir, 'env.d.ts'))
    }
  }
})
