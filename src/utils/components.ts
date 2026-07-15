import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, join, normalize, resolve } from 'pathe'
import { globSync } from 'tinyglobby'
import { pascalCase } from 'scule'
import { resolvePathSync } from 'mlly'

/**
 * Build a dependency graph of components by scanning their source files
 */
async function buildComponentDependencyGraph(componentDir: string, componentPattern: RegExp): Promise<Map<string, Set<string>>> {
  const dependencyGraph = new Map<string, Set<string>>()

  const componentFiles = globSync(['**/*.vue'], {
    cwd: componentDir,
    absolute: true
  })

  for (const componentFile of componentFiles) {
    try {
      const content = await readFile(componentFile, 'utf-8')
      const componentName = pascalCase(componentFile.split('/').pop()!.replace('.vue', ''))
      const dependencies = new Set<string>()

      const matches = content.matchAll(componentPattern)
      for (const match of matches) {
        const depName = match[1] || match[2]
        if (depName && depName !== componentName) {
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
      const entry = normalize(resolvePathSync(pkg, { url: join(root, '_index.mjs') }))
      // Slice at the last `node_modules/<pkg>/` so pnpm's `.pnpm` layout resolves
      // to the package directory, not its entry file.
      const marker = `node_modules/${pkg}`
      const index = entry.lastIndexOf(`${marker}/`)
      dirs.add(index === -1 ? dirname(entry) : entry.slice(0, index + marker.length))
    } catch {
      // Not resolvable from the root: nothing to scan.
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

  // Pattern to match:
  // - <UButton in templates
  // - UButton in script (imports, usage)
  // - <LazyUButton (lazy components)
  // - LazyUButton in script
  const componentPattern = new RegExp(`<(?:Lazy)?${prefix}([A-Z][a-zA-Z]+)|\\b(?:Lazy)?${prefix}([A-Z][a-zA-Z]+)\\b`, 'g')

  // Scan all source files for component usage across all layers
  for (const dir of dirs) {
    const appFiles = globSync(['**/*.{vue,ts,js,tsx,jsx}'], {
      cwd: dir,
      // `**/` prefixes so nested dirs are skipped too: the Vue integration
      // scans the whole Vite root, not just Nuxt layer `app/` directories.
      ignore: ['**/node_modules/**', '**/.nuxt/**', '**/dist/**']
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
  const dependencyGraph = await buildComponentDependencyGraph(componentDir, componentPattern)

  // Resolve all dependencies for detected components
  const allComponents = new Set<string>()
  for (const component of detectedComponents) {
    const resolved = resolveComponentDependencies(component, dependencyGraph)
    for (const resolvedComponent of resolved) {
      allComponents.add(resolvedComponent)
    }
  }

  return allComponents
}
