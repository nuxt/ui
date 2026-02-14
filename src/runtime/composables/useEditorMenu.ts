import { ref, h, computed, unref, watch } from 'vue'
import type { Ref, ComputedRef, MaybeRef } from 'vue'
import { defu } from 'defu'
import { useFilter } from 'reka-ui'
import { computePosition } from '@floating-ui/dom'
import type { Strategy, Placement } from '@floating-ui/dom'
import type { Editor } from '@tiptap/vue-3'
import { VueRenderer } from '@tiptap/vue-3'
import type { SuggestionProps } from '@tiptap/suggestion'
import Suggestion from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'
import type { FloatingUIOptions } from '../types/editor'
import { buildFloatingUIMiddleware } from '../utils/editor'
import { get, isArrayOfArray } from '../utils'

export interface EditorMenuOptions<T = any> {
  editor: Editor
  /**
   * The trigger character (e.g., '/', '@', ':')
   */
  char: string
  /**
   * Plugin key to identify this menu
   */
  pluginKey: string
  /**
   * The items to display (can be a flat array or grouped)
   */
  items?: MaybeRef<T[] | T[][] | undefined>
  /**
   * Fields to filter items by.
   * @defaultValue ['label']
   */
  filterFields?: string[]
  /**
   * Function to filter items based on query
   */
  filter?: (items: T[], query: string) => T[]
  /**
   * Whether to ignore the default filtering.
   * When `true`, items will not be filtered which is useful for custom filtering (useAsyncData, useFetch, etc.).
   * @defaultValue false
   */
  ignoreFilter?: boolean
  /**
   * Maximum number of items to display
   * @defaultValue 42
   */
  limit?: number
  /**
   * Ref to sync the current search term with
   */
  searchTerm?: Ref<string>
  /**
   * Function to execute when an item is selected
   */
  onSelect: (editor: Editor, range: any, item: T) => void
  /**
   * Function to render each menu item
   */
  renderItem: (item: T, ui: ComputedRef<any>) => any
  /**
   * The options for positioning the menu. Those are passed to Floating UI and include options for the placement, offset, flip, shift, size, autoPlacement, hide, and inline middleware.
   * @defaultValue { strategy: 'absolute', placement: 'bottom-start', offset: 8, shift: { padding: 8 } }
   * @see https://floating-ui.com/docs/computePosition#options
   */
  options?: FloatingUIOptions
  /**
   * The DOM element to append the menu to. Default is the editor's parent element.
   *
   * Sometimes the menu needs to be appended to a different DOM context due to accessibility, clipping, or z-index issues.
   *
   * @type {HTMLElement}
   * @default editor.view.dom.parentElement
   */
  appendTo?: HTMLElement | (() => HTMLElement)
  /**
   * UI styles computed ref
   */
  ui: ComputedRef<any>
}

export function useEditorMenu<T = any>(options: EditorMenuOptions<T>) {
  const filteredItems: Ref<T[]> = ref([])
  const selectedIndex = ref(0)
  const menuState = ref<'closed' | 'open'>('closed')
  const searchTerm = options.searchTerm ?? ref('')
  let renderer: VueRenderer | null = null
  let element: HTMLElement | null = null
  let handleMouseDown: ((e: MouseEvent) => void) | null = null
  let commandFn: ((item: T) => void) | null = null
  let keyDownHandler: ((props: { event: KeyboardEvent }) => boolean) | null = null
  let globalKeyHandler: ((e: KeyboardEvent) => void) | null = null
  let blurHandler: (() => void) | null = null
  let triggerClientRect: (() => DOMRect | null) | null = null
  let handleHover: ((index: number) => void) | null = null
  let scrollHandler: (() => void) | null = null
  let stopItemsWatch: (() => void) | null = null

  const { contains, startsWith } = useFilter({ sensitivity: 'base' })

  // Helper function to cleanup menu immediately (no animation)
  const cleanupMenu = () => {
    if (menuState.value === 'closed') return

    menuState.value = 'closed'

    // Remove event listeners
    if (globalKeyHandler) {
      document.removeEventListener('keydown', globalKeyHandler, true)
      globalKeyHandler = null
    }
    if (blurHandler) {
      options.editor.view.dom.removeEventListener('blur', blurHandler)
      blurHandler = null
    }
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler, true)
      scrollHandler = null
    }

    // Cleanup DOM immediately
    if (element && handleMouseDown) {
      element.removeEventListener('mousedown', handleMouseDown)
      handleMouseDown = null
    }
    if (renderer) {
      renderer.destroy()
      renderer = null
    }
    if (element) {
      element.remove()
      element = null
    }
  }

  const filterFields = options.filterFields ?? ['label']

  // matchType: 0 = exact, 1 = startsWith, 2 = contains (lower = better)
  const defaultFilter = (items: T[], query: string) => {
    if (!query) return items

    const matched: { item: T, fieldIndex: number, matchType: number }[] = []

    for (const item of items) {
      let bestMatchType = 3
      let bestFieldIndex = filterFields.length

      for (let i = 0; i < filterFields.length; i++) {
        const value = get(item as any, filterFields[i]!)
        if (value === undefined || value === null) continue

        const values = Array.isArray(value) ? value.map(String) : [String(value)]

        for (const v of values) {
          const normalized = v.replace(/[\s_-]/g, '')

          let matchType = 3
          if (startsWith(v, query) || startsWith(normalized, query)) {
            matchType = (v.length === query.length || normalized.length === query.length) ? 0 : 1
          } else if (contains(v, query) || contains(normalized, query)) {
            matchType = 2
          }

          if (matchType < bestMatchType || (matchType === bestMatchType && i < bestFieldIndex)) {
            bestMatchType = matchType
            bestFieldIndex = i
          }
        }
      }

      if (bestMatchType < 3) {
        matched.push({ item, fieldIndex: bestFieldIndex, matchType: bestMatchType })
      }
    }

    // Sort: by match specificity first (exact > startsWith > contains), then by field index
    matched.sort((a, b) => {
      if (a.matchType !== b.matchType) return a.matchType - b.matchType
      return a.fieldIndex - b.fieldIndex
    })

    return matched.map(({ item }) => item)
  }

  const filter = options.filter || defaultFilter
  const limit = options.limit ?? 42

  // Create the plugin key instance early (needed by showMenu helper)
  const pluginKeyInstance = typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey

  // Normalize items into groups first
  const groups = computed<T[][]>(() => {
    const items = unref(options.items)

    return items?.length
      ? isArrayOfArray(items)
        ? items as T[][]
        : [items as T[]]
      : []
  })

  // Flatten groups to a single array
  const items = computed(() => groups.value.flatMap(group => group))

  // Filtered groups after applying filter (maintains group structure)
  const filteredGroups = computed<T[][]>(() => {
    if (!filteredItems.value.length) return []

    // When ignoreFilter is true, filteredItems IS the source of truth
    // We wrap it in a single group to avoid object reference mismatches
    // (the external computed may create new object references on each access)
    if (options.ignoreFilter) {
      return [filteredItems.value]
    }

    // Map each group and filter its items to only include those in filteredItems
    // Sort within each group to respect the filter's ranking order
    return groups.value
      .map((group) => {
        const filtered = group.filter(item => filteredItems.value.includes(item))
        filtered.sort((a, b) => filteredItems.value.indexOf(a) - filteredItems.value.indexOf(b))
        return filtered
      })
      .filter(group => group.length > 0)
  })

  // Get only selectable items (excluding labels and separators) for keyboard navigation
  const selectableItems = computed<T[]>(() => {
    return filteredItems.value.filter((item: any) => {
      return item.type !== 'label' && item.type !== 'separator'
    })
  })

  // Build middleware array based on options (following BubbleMenu pattern)
  const floatingUIOptions = defu(options.options, {
    strategy: 'absolute' as Strategy,
    placement: 'bottom-start' as Placement,
    offset: 8,
    flip: {},
    shift: { padding: 8 },
    size: false,
    autoPlacement: false,
    hide: false,
    inline: false
  })

  const middleware = buildFloatingUIMiddleware(floatingUIOptions)

  // Helper function to update menu position using floating-ui
  const updatePosition = (el: HTMLElement) => {
    if (!triggerClientRect) return

    const rect = triggerClientRect()
    if (!rect) return

    const virtualElement = {
      getBoundingClientRect: () => rect
    }

    computePosition(virtualElement, el, {
      placement: floatingUIOptions.placement,
      strategy: floatingUIOptions.strategy,
      middleware
    }).then(({ x, y, strategy }) => {
      el.style.width = 'max-content'
      el.style.position = strategy
      el.style.top = '0'
      el.style.left = '0'
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
    })
  }

  // Helper function to show menu (creates renderer, element, and event listeners)
  const showMenu = () => {
    menuState.value = 'open'

    // Add global keyboard listener for navigation
    if (!globalKeyHandler) {
      globalKeyHandler = (e: KeyboardEvent) => {
        if (keyDownHandler) {
          const handled = keyDownHandler({ event: e })
          if (handled) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
      }
      document.addEventListener('keydown', globalKeyHandler, true)
    }

    // Add blur listener to close menu when editor loses focus
    if (!blurHandler) {
      blurHandler = () => {
        setTimeout(() => {
          if (menuState.value === 'open') {
            // Dispatch exit transaction to properly close the suggestion session
            const tr = options.editor.view.state.tr.setMeta(pluginKeyInstance, { exit: true })
            options.editor.view.dispatch(tr)
          }
        }, 0)
      }
      options.editor.view.dom.addEventListener('blur', blurHandler)
    }

    // Add scroll listener to update position on scroll
    if (!scrollHandler) {
      scrollHandler = () => {
        if (element) {
          updatePosition(element)
        }
      }
      window.addEventListener('scroll', scrollHandler, true)
    }

    // Define onHover handler that updates both state and renderer
    handleHover = (index: number) => {
      selectedIndex.value = index
      if (renderer) {
        renderer.updateProps({
          groups: filteredGroups.value,
          selectedIndex: index,
          onSelect: commandFn,
          onHover: handleHover!,
          state: menuState.value
        })
      }
    }

    renderer = new VueRenderer(MenuComponent, {
      props: {
        groups: filteredGroups.value,
        selectedIndex: selectedIndex.value,
        onSelect: commandFn,
        onHover: handleHover,
        state: menuState.value
      },
      editor: options.editor
    })

    element = document.createElement('div')
    element.style.position = floatingUIOptions.strategy
    element.style.zIndex = '50'

    handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
    }
    element.addEventListener('mousedown', handleMouseDown)

    const appendToElement = typeof options.appendTo === 'function' ? options.appendTo() : options.appendTo
    ;(appendToElement ?? options.editor.view.dom.parentElement)?.appendChild(element)
    if (renderer.element) {
      element.appendChild(renderer.element)
    }

    updatePosition(element)
  }

  // Watch for external items changes when ignoreFilter is true (for async items)
  // Use flush: 'sync' to ensure filteredItems is updated before filteredGroups is accessed
  if (options.ignoreFilter) {
    stopItemsWatch = watch(() => unref(options.items), (newItems) => {
      // Only update if we're in an active suggestion session
      // (triggerClientRect is set in onStart and cleared in onExit)
      if (!triggerClientRect) return

      // Normalize items (handle both flat and grouped arrays)
      const normalizedItems = newItems?.length
        ? isArrayOfArray(newItems)
          ? (newItems as T[][]).flat()
          : (newItems as T[])
        : []

      // Update filtered items with the new items (sliced to limit)
      filteredItems.value = normalizedItems.slice(0, limit)

      // Hide menu if no items
      if (!filteredItems.value.length) {
        cleanupMenu()
        return
      }

      // Reset selected index if out of bounds
      if (selectedIndex.value >= selectableItems.value.length) {
        selectedIndex.value = Math.max(0, selectableItems.value.length - 1)
      }

      // If menu was closed but we have items now, reopen it
      if (menuState.value === 'closed' && filteredItems.value.length) {
        showMenu()
        return
      }

      // Update the renderer if it exists
      if (renderer) {
        renderer.updateProps({
          groups: filteredGroups.value,
          selectedIndex: selectedIndex.value,
          onSelect: commandFn,
          onHover: handleHover!,
          state: menuState.value
        })
      }

      // Update position
      if (element) {
        updatePosition(element)
      }
    }, { deep: true, flush: 'sync' })
  }

  // Create the menu component using plain divs (not Reka UI components)
  // to prevent focus stealing and allow typing to pass through to the editor
  const MenuComponent = {
    props: {
      groups: { type: Array, required: true },
      selectedIndex: { type: Number, required: true },
      onSelect: { type: Function, required: true },
      onHover: { type: Function, required: true },
      state: { type: String, required: true }
    },
    setup(menuProps: any) {
      function handleClick(e: MouseEvent, item: T, selectableIndex: number) {
        e.preventDefault()
        menuProps.onSelect(item, selectableIndex)
      }

      function handleMouseEnter(selectableIndex: number) {
        // Update selected index on hover via callback
        menuProps.onHover(selectableIndex)
      }

      return () => {
        const groupsData = menuProps.groups as T[][]
        // Build a map of selectable items to their indices
        const selectableIndexMap = new Map<T, number>()
        let selectableCounter = 0
        for (const group of groupsData) {
          for (const item of group) {
            const itemData = item as any
            if (itemData.type !== 'label' && itemData.type !== 'separator') {
              selectableIndexMap.set(item, selectableCounter++)
            }
          }
        }

        return h('div', {
          'class': options.ui.value.content(),
          'role': 'listbox',
          'data-state': menuProps.state
        }, [
          h('div', {
            class: options.ui.value.viewport(),
            role: 'presentation'
          }, groupsData.map((group, groupIndex) =>
            h('div', {
              key: `group-${groupIndex}`,
              class: options.ui.value.group(),
              role: 'group'
            }, group.map((item, itemInGroupIndex) => {
              const itemData = item as any

              // Render label
              if (itemData.type === 'label') {
                return h('div', {
                  key: `label-${groupIndex}-${itemInGroupIndex}`,
                  class: options.ui.value.label({ class: itemData.class })
                }, options.renderItem(item, options.ui))
              }

              // Render separator
              if (itemData.type === 'separator') {
                return h('div', {
                  key: `separator-${groupIndex}-${itemInGroupIndex}`,
                  class: options.ui.value.separator({ class: itemData.class }),
                  role: 'separator'
                })
              }

              // Render regular item
              const selectableIndex = selectableIndexMap.get(item)!
              const isHighlighted = selectableIndex === menuProps.selectedIndex

              return h('div', {
                'key': `item-${selectableIndex}`,
                'class': options.ui.value.item({ class: itemData.class, active: false }),
                'role': 'option',
                'aria-selected': isHighlighted,
                'data-highlighted': isHighlighted ? '' : undefined,
                'data-disabled': itemData.disabled ? '' : undefined,
                'onMousedown': (e: MouseEvent) => handleClick(e, item, selectableIndex),
                'onMouseenter': () => handleMouseEnter(selectableIndex),
                'ref': (el: any) => {
                  if (el && isHighlighted) {
                    el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
                  }
                }
              }, options.renderItem(item, options.ui))
            }))
          ))
        ])
      }
    }
  }

  // Create the suggestion plugin
  const plugin = Suggestion({
    pluginKey: pluginKeyInstance,
    editor: options.editor,
    char: options.char,
    items: ({ query: q }: { query: string }) => {
      // Update the searchTerm ref for external access
      searchTerm.value = q

      // When ignoreFilter is true, return items as-is (for async filtering)
      if (options.ignoreFilter) {
        return items.value.slice(0, limit)
      }

      const filtered = filter(items.value, q)
      return filtered.slice(0, limit)
    },
    command: ({ editor, range, props }: any) => {
      options.onSelect(editor, range, props)
    },
    render: () => {
      // Define keydown handler that will be stored and called globally
      keyDownHandler = (props: { event: KeyboardEvent }) => {
        const { event } = props

        if (!renderer || !selectableItems.value.length) {
          return false
        }

        // Handle Escape
        if (event.key === 'Escape') {
          cleanupMenu()
          return true
        }

        // Handle ArrowUp
        if (event.key === 'ArrowUp') {
          selectedIndex.value = (selectedIndex.value + selectableItems.value.length - 1) % selectableItems.value.length
          renderer?.updateProps({
            groups: filteredGroups.value,
            selectedIndex: selectedIndex.value,
            onSelect: commandFn,
            onHover: handleHover!,
            state: menuState.value
          })
          return true
        }

        // Handle ArrowDown
        if (event.key === 'ArrowDown') {
          selectedIndex.value = (selectedIndex.value + 1) % selectableItems.value.length
          renderer?.updateProps({
            groups: filteredGroups.value,
            selectedIndex: selectedIndex.value,
            onSelect: commandFn,
            onHover: handleHover!,
            state: menuState.value
          })
          return true
        }

        // Handle Enter or Tab
        if (event.key === 'Enter' || event.key === 'Tab') {
          const selectedItem = selectableItems.value[selectedIndex.value]
          if (selectedItem && commandFn) {
            commandFn(selectedItem)
          }
          return true
        }

        // Let all other keys (typing) pass through to the editor
        return false
      }

      const handlers = {
        onStart: (suggestionProps: SuggestionProps) => {
          // When ignoreFilter is true, always use fresh items from the reactive source
          filteredItems.value = options.ignoreFilter
            ? items.value.slice(0, limit)
            : suggestionProps.items as T[]

          // Start at first selectable item (index 0 in selectableItems)
          selectedIndex.value = 0

          // Capture the command function for use in keyboard navigation
          commandFn = (item: T) => suggestionProps.command(item)

          // Store the trigger position (where the `/`, `@`, or `:` is)
          triggerClientRect = suggestionProps.clientRect as () => DOMRect | null

          // Only show menu if there are items
          if (!filteredItems.value.length) {
            return
          }

          showMenu()
        },
        onUpdate: (suggestionProps: SuggestionProps) => {
          // When ignoreFilter is true, always use fresh items from the reactive source
          filteredItems.value = options.ignoreFilter
            ? items.value.slice(0, limit)
            : suggestionProps.items as T[]

          // Update the command function
          commandFn = (item: T) => suggestionProps.command(item)

          // Reset selected index if out of bounds (comparing against selectableItems)
          if (selectedIndex.value >= selectableItems.value.length) {
            selectedIndex.value = Math.max(0, selectableItems.value.length - 1)
          }

          // Hide menu if no items
          if (!filteredItems.value.length) {
            cleanupMenu()
            return
          }

          // Show menu if it was hidden
          if (!renderer) {
            showMenu()
          } else {
            // Update existing renderer
            renderer.updateProps({
              groups: filteredGroups.value,
              selectedIndex: selectedIndex.value,
              onSelect: commandFn,
              onHover: handleHover!,
              state: menuState.value
            })
          }

          if (element) {
            updatePosition(element)
          }
        },
        onKeyDown: keyDownHandler!,
        onExit: () => {
          cleanupMenu()
          // Clear the stored trigger position
          triggerClientRect = null
          // Reset search term
          searchTerm.value = ''
        }
      }
      return handlers
    }
  })

  // Cleanup function for when the composable is destroyed (always runs regardless of state)
  const destroy = () => {
    menuState.value = 'closed'

    if (globalKeyHandler) {
      document.removeEventListener('keydown', globalKeyHandler, true)
      globalKeyHandler = null
    }
    if (blurHandler) {
      options.editor.view.dom.removeEventListener('blur', blurHandler)
      blurHandler = null
    }
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler, true)
      scrollHandler = null
    }
    if (element && handleMouseDown) {
      element.removeEventListener('mousedown', handleMouseDown)
      handleMouseDown = null
    }
    if (renderer) {
      renderer.destroy()
      renderer = null
    }
    if (element) {
      element.remove()
      element = null
    }
    if (stopItemsWatch) {
      stopItemsWatch()
      stopItemsWatch = null
    }
  }

  return {
    plugin,
    destroy,
    filteredItems,
    searchTerm
  }
}
