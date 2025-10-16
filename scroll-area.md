# ScrollArea Component with Virtualization

## Implementation Approach

Build a simple, flexible ScrollArea component that uses `@tanstack/vue-virtual` directly (not through Reka UI) for virtualizing generic item lists with full layout flexibility.

## Core Component Changes

### 1. Update `src/runtime/components/ScrollArea.vue`

Reference patterns from `Table.vue` (lines 414-421 for direct `useVirtualizer` usage) and `CommandPalette.vue`/`Tree.vue` for the virtualize prop structure.

**Key changes:**

- Add generic type parameter for items: `<T = any>`
- Add props:
  - `items?: T[]` - array of items to render
  - `orientation?: 'vertical' | 'horizontal'` - scroll direction (default: 'vertical')
  - `virtualize?: boolean | { overscan?: number, estimateSize?: number }` - enable virtualization (default: false)
  - `estimateSize?: number` - fallback for item size estimation
- Add default slot with signature: `(props: { item: T, index: number, virtualItem?: VirtualItem }) => any`
- Use `useVirtualizer` from `@tanstack/vue-virtual` when virtualize is enabled
- Implement dual rendering paths:
  - **Non-virtualized**: Simple v-for over items
  - **Virtualized**: Use `virtualizer.getVirtualItems()` with absolute positioning and transforms
- Create a ref for the scroll container element
- Apply proper orientation styling based on prop

**Template structure:**

```vue
<div ref="scrollContainer" class="ui.root">
  <template v-if="virtualize">
    <div :style="{ 
      [orientation === 'horizontal' ? 'width' : 'height']: `${virtualizer.getTotalSize()}px`,
      position: 'relative' 
    }">
      <div v-for="virtualItem in virtualizer.getVirtualItems()" 
           :key="virtualItem.key"
           :style="positioning styles">
        <slot :item="items[virtualItem.index]" :index="virtualItem.index" :virtualItem="virtualItem" />
      </div>
    </div>
  </template>
  <template v-else>
    <slot v-for="(item, index) in items" :item="item" :index="index" />
  </template>
</div>
```

### 2. Update `src/theme/scroll-area.ts`

Add comprehensive theme slots following the pattern in `table.ts`:

```ts
slots: {
  root: 'relative overflow-auto',
  viewport: 'relative', // container for virtualized items
}
variants: {
  orientation: {
    vertical: {
      root: 'overflow-y-auto overflow-x-hidden'
    },
    horizontal: {
      root: 'overflow-x-auto overflow-y-hidden'
    }
  }
}
```

### 3. Update `playgrounds/nuxt/app/pages/components/scroll-area.vue`

Create comprehensive examples:

- Vertical scrolling with cards (virtualized)
- Horizontal scrolling with images (virtualized)
- Grid layout with variable heights
- Non-virtualized simple list
- Large dataset (1000+ items) performance demo

### 4. Update `docs/content/docs/2.components/scroll-area.md`

Add complete documentation:

- Usage section with basic examples
- Examples section with:
  - Basic vertical scroll
  - Horizontal scroll
  - Virtualized large list
  - Custom item rendering
  - Variable height items
- Props documentation
- Performance notes about virtualization

### 5. Update `test/components/ScrollArea.spec.ts`

Add comprehensive tests:

- Props: items, orientation, virtualize, estimateSize, ui, class
- Slots: default slot with item, index, virtualItem props
- Behavior: virtualized vs non-virtualized rendering
- Snapshot tests for different configurations

## Files to Modify

1. `/Users/mikenewbon/git/ui/src/runtime/components/ScrollArea.vue` - Full component implementation
2. `/Users/mikenewbon/git/ui/src/theme/scroll-area.ts` - Theme configuration
3. `/Users/mikenewbon/git/ui/playgrounds/nuxt/app/pages/components/scroll-area.vue` - Examples
4. `/Users/mikenewbon/git/ui/docs/content/docs/2.components/scroll-area.md` - Documentation
5. `/Users/mikenewbon/git/ui/test/components/ScrollArea.spec.ts` - Tests

## Technical Notes

- Use `useVirtualizer` from `@tanstack/vue-virtual` directly (like Table.vue does)
- Support both vertical and horizontal virtualization via orientation prop
- Use `ref` for scroll container and pass to `getScrollElement` callback
- Apply transforms in the appropriate direction based on orientation
- Default overscan: 12, default estimateSize: 100 (reasonable for cards)
- Items are completely generic - no structure enforcement