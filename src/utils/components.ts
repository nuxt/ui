import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { consola } from 'consola'
import { dirname, join, normalize, resolve } from 'pathe'
import { globSync } from 'tinyglobby'
import { pascalCase } from 'scule'
import { resolvePathSync } from 'mlly'

/**
 * Pattern to match:
 * - <UButton in templates
 * - UButton in script (imports, usage)
 * - <LazyUButton (lazy components)
 * - LazyUButton in script
 */
function createComponentPattern(prefix: string): RegExp {
  return new RegExp(`<(?:Lazy)?${prefix}([A-Z][a-zA-Z]+)|\\b(?:Lazy)?${prefix}([A-Z][a-zA-Z]+)\\b`, 'g')
}

/**
 * Build a dependency graph of components by scanning their source files.
 *
 * Nuxt UI's own components always reference each other with the `U` prefix,
 * regardless of the user-configured prefix, so the graph pattern is fixed. The
 * user prefix only applies to the app scan in `detectUsedComponents`.
 */
async function buildComponentDependencyGraph(componentDir: string): Promise<Map<string, Set<string>>> {
  const dependencyGraph = new Map<string, Set<string>>()
  const componentPattern = createComponentPattern('U')

  const componentFiles = globSync(['**/*.vue'], {
    cwd: componentDir,
    absolute: true,
    // Prose components share file basenames with nine regular components
    // (`prose/Tabs.vue` vs `Tabs.vue`), and the graph is keyed by basename:
    // letting them in overwrites the regular component's dependency set. They
    // don't need nodes anyway, they are never used with the `U` prefix.
    ignore: ['prose/**']
  })

  // The pattern also matches ordinary identifiers (`URL` -> `RL`), so an edge
  // only counts when it points at a real component file.
  const componentNames = new Set(componentFiles.map(file => pascalCase(file.split('/').pop()!.replace('.vue', ''))))

  for (const componentFile of componentFiles) {
    try {
      const content = await readFile(componentFile, 'utf-8')
      const componentName = pascalCase(componentFile.split('/').pop()!.replace('.vue', ''))
      const dependencies = new Set<string>()

      const matches = content.matchAll(componentPattern)
      for (const match of matches) {
        const depName = match[1] || match[2]
        if (depName && depName !== componentName && componentNames.has(depName)) {
          dependencies.add(depName)
        }
      }

      dependencyGraph.set(componentName, dependencies)
    } catch {
      // Ignore files that can't be read
    }
  }

  return dependencyGraph
}

/**
 * Recursively resolve all dependencies for a component
 */
function resolveComponentDependencies(
  component: string,
  dependencyGraph: Map<string, Set<string>>,
  resolved: Set<string> = new Set()
): Set<string> {
  if (resolved.has(component)) {
    return resolved
  }

  resolved.add(component)
  const dependencies = dependencyGraph.get(component)

  if (dependencies) {
    for (const dep of dependencies) {
      resolveComponentDependencies(dep, dependencyGraph, resolved)
    }
  }

  return resolved
}

/**
 * Resolve additional directories component detection should scan besides the root:
 * packages from `scanPackages` (they live in `node_modules`, which the root scan
 * skips) and user component dirs pointing outside the root.
 */
export function resolveExtraScanDirs(root: string, scanPackages?: string[], componentDirs?: string | string[]): string[] {
  const dirs = new Set<string>()

  for (const pkg of scanPackages || []) {
    try {
      // `<pkg>/package.json` resolves to the package root in every layout,
      // including pnpm's `.pnpm` store and workspace links (whose entry files
      // resolve to a realpath outside `node_modules`, where an entry-based
      // lookup would land on the build output directory instead).
      dirs.add(dirname(normalize(resolvePathSync(`${pkg}/package.json`, { url: join(root, '_index.mjs') }))))
    } catch {
      try {
        // Fallback for packages whose `exports` don't expose `./package.json`:
        // resolve the entry and slice at the last `node_modules/<pkg>/`.
        const entry = normalize(resolvePathSync(pkg, { url: join(root, '_index.mjs') }))
        const marker = `node_modules/${pkg}`
        const index = entry.lastIndexOf(`${marker}/`)
        dirs.add(index === -1 ? dirname(entry) : entry.slice(0, index + marker.length))
      } catch {
        consola.warn(`Nuxt UI could not resolve \`${pkg}\` from \`scanPackages\`: it will not be scanned for component detection`)
      }
    }
  }

  const rootDir = normalize(root)
  const userDirs = Array.isArray(componentDirs) ? componentDirs : componentDirs ? [componentDirs] : []
  for (const dir of userDirs) {
    // `dirs` entries can be globs: scan from the static prefix.
    const resolved = resolve(root, dir.split(/[*{]/)[0]!)
    // Dirs inside the root are already covered by the root scan.
    if (resolved !== rootDir && !resolved.startsWith(`${rootDir}/`) && existsSync(resolved)) {
      dirs.add(resolved)
    }
  }

  return [...dirs]
}

/**
 * Detect components used in the project by scanning source files
 */
export async function detectUsedComponents(
  dirs: string[],
  prefix: string,
  componentDir: string,
  includeComponents?: string[]
): Promise<Set<string> | undefined> {
  const detectedComponents = new Set<string>()

  // Add manually specified components
  if (includeComponents && includeComponents.length > 0) {
    for (const component of includeComponents) {
      detectedComponents.add(component)
    }
  }

  const componentPattern = createComponentPattern(prefix)

  // Scan all source files for component usage across all layers
  for (const dir of dirs) {
    // `scanPackages` directories ship their code in `dist/` (and as
    // `.mjs`/`.cjs`), so the build-output ignores only apply to project dirs.
    const isPackageDir = normalize(dir).includes('node_modules/')

    const appFiles = globSync(['**/*.{vue,ts,mts,js,mjs,cjs,tsx,jsx}'], {
      cwd: dir,
      // `**/` prefixes so nested dirs are skipped too: the Vue integration
      // scans the whole Vite root, not just Nuxt layer `app/` directories.
      // Declaration files can't render components, and the generated
      // `components.d.ts` declares every component ever rendered, which would
      // keep anything used once detected forever.
      ignore: isPackageDir
        ? ['**/node_modules/**', '**/*.d.ts']
        : ['**/node_modules/**', '**/.nuxt/**', '**/dist/**', '**/*.d.ts']
    })

    for (const file of appFiles) {
      try {
        const filePath = join(dir, file)
        const content = await readFile(filePath, 'utf-8')
        const matches = content.matchAll(componentPattern)

        for (const match of matches) {
          const componentName = match[1] || match[2]
          if (componentName) {
            detectedComponents.add(componentName)
          }
        }
      } catch {
        // Ignore files that can't be read
      }
    }
  }

  if (detectedComponents.size === 0) {
    return undefined
  }

  // Build dependency graph of components
  const dependencyGraph = await buildComponentDependencyGraph(componentDir)

  // The pattern also matches ordinary identifiers (`URL` -> `RL`, `UUID` ->
  // `UID`), and `includeComponents` names arrive unvalidated: filter against
  // the real component files so junk can't defeat the include-everything
  // fallback below (blanking every theme in the Vue integration), and so a
  // typo in `componentDetection: [...]` surfaces instead of silently doing
  // nothing.
  const unknownComponents = includeComponents?.filter(component => !dependencyGraph.has(component))
  if (unknownComponents?.length) {
    consola.warn(`Nuxt UI \`componentDetection\` includes unknown components: ${unknownComponents.join(', ')}`)
  }

  const validComponents = Array.from(detectedComponents).filter(component => dependencyGraph.has(component))
  if (validComponents.length === 0) {
    return undefined
  }

  // Resolve all dependencies for detected components
  const allComponents = new Set<string>()
  for (const component of validComponents) {
    resolveComponentDependencies(component, dependencyGraph, allComponents)
  }

  return allComponents
}
