import { describe, it, expect } from 'vitest'
import { matchesDashboardSidebarTarget } from '../../src/runtime/utils/dashboard'

describe('matchesDashboardSidebarTarget', () => {
  it('matches every sidebar when target is omitted', () => {
    expect(matchesDashboardSidebarTarget(undefined, 'nav', 'left')).toBe(true)
    expect(matchesDashboardSidebarTarget(undefined, 'chat', 'right')).toBe(true)
  })

  it('matches a sidebar id or side', () => {
    expect(matchesDashboardSidebarTarget('nav', 'nav', 'left')).toBe(true)
    expect(matchesDashboardSidebarTarget('left', 'nav', 'left')).toBe(true)
    expect(matchesDashboardSidebarTarget('chat', 'nav', 'left')).toBe(false)
    expect(matchesDashboardSidebarTarget('right', 'nav', 'left')).toBe(false)
  })
})
