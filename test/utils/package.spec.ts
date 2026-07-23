import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

interface PackageManifest {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies: Record<string, string>
}

const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8')) as PackageManifest

describe('package manifest', () => {
  it('lets applications provide either supported Unhead major', () => {
    expect(packageJson.dependencies).not.toHaveProperty('@unhead/vue')
    expect(packageJson.peerDependencies['@unhead/vue']).toBe('^2.1.15 || ^3.0.0')
    expect(packageJson.devDependencies['@unhead/vue']).toBe('^3.1.8')
  })
})
