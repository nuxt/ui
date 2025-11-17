import { ref, h, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { defu } from 'defu'
import { computePosition } from '@floating-ui/dom'
import type { Strategy, Placement } from '@floating-ui/dom'
import type { Editor } from '@tiptap/vue-3'
import { VueRenderer } from '@tiptap/vue-3'
import type { SuggestionProps } from '@tiptap/suggestion'
import Suggestion from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'
import type { FloatingUIOptions } from '../types/editor'
import { buildFloatingUIMiddleware } from '../utils/editor'
import { isArrayOfArray } from '../utils'

export interface EditorMenuOptions<T = any> {
  /**
   * The editor instance
   */
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
  items?: T[] | T[][]
  /**
   * Function to filter items based on query
   */
  filter?: (items: T[], query: string) => T[]
  /**
   * Maximum number of items to display
   * @defaultValue 42
   */
  limit?: number
  /**
   * Function to execute when an item is selected
   */
  onSelect: (editor: any, range: any, item: T) => void
  /**
   * Function to render each menu item
   */
  renderItem: (item: T, ui: ComputedRef<any>) => any
  /**
   * The options for positioning the menu. Those are passed to Floating UI and include options for the placement, offset, flip, shift, size, autoPlacement, hide, and inline middleware.
   * @defaultValue { strategy: 'absolute', placement: 'bottom-start', offset: 8 }
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
  const menuState = ref<'closed' | 'open' | 'closing'>('closed')
  let renderer: VueRenderer | null = null
  let element: HTMLElement | null = null
  let handleMouseDown: ((e: MouseEvent) => void) | null = null
  let commandFn: ((item: T) => void) | null = null
  let keyDownHandler: ((props: { event: KeyboardEvent }) => boolean) | null = null
  let globalKeyHandler: ((e: KeyboardEvent) => void) | null = null
  let triggerClientRect: (() => DOMRect | null) | null = null
  let handleHover: ((index: number) => void) | null = null
  let scrollHandler: (() => void) | null = null

  // Helper function to cleanup menu with close animation
  const cleanupMenu = () => {
    if (menuState.value === 'closed') return

    // Set state to closed for animation
    menuState.value = 'closed'

    // Update renderer to show closing animation
    if (renderer) {
      renderer.updateProps({
        groups: groups.value,
        selectedIndex: selectedIndex.value,
        onSelect: commandFn,
        onHover: handleHover!,
        state: menuState.value
      })
    }

    // Wait for animation to complete (100ms from theme) before cleanup
    setTimeout(() => {
      if (globalKeyHandler) {
        document.removeEventListener('keydown', globalKeyHandler, true)
        globalKeyHandler = null
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
    }, 100)
  }

  const defaultFilter = (items: T[], query: string) => {
    if (!query) return items
    return items.filter((item: any) => {
      const searchText = `${item.label} ${item.description || ''}`.toLowerCase()
      return searchText.includes(query.toLowerCase())
    })
  }

  const filter = options.filter || defaultFilter
  const limit = options.limit ?? 42

  // Flatten items to a single array for filtering
  const flatItems = computed(() => {
    return isArrayOfArray(options.items || [])
      ? (options.items as T[][]).flat()
      : options.items as T[]
  })

  // Group items back into groups after filtering
  const groups = computed<T[][]>(() => {
    if (filteredItems.value.length === 0) return []

    if (isArrayOfArray(options.items || [])) {
      // Reconstruct groups maintaining the original group structure
      const groups: T[][] = []
      for (const group of options.items as T[][]) {
        const filteredGroup = group.filter(item => filteredItems.value.includes(item))
        if (filteredGroup.length > 0) {
          groups.push(filteredGroup)
        }
      }
      return groups
    }

    return [filteredItems.value]
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
    shift: {},
    size: false,
    autoPlacement: false,
    hide: false,
    inline: false
  })

  const middleware = buildFloatingUIMiddleware(floatingUIOptions)

  // Helper function to update menu position using floating-ui
  const updatePosition = (element: HTMLElement) => {
    if (!triggerClientRect) return

    const rect = triggerClientRect()
    if (!rect) return

    const virtualElement = {
      getBoundingClientRect: () => rect
    }

    computePosition(virtualElement, element, {
      placement: floatingUIOptions.placement,
      strategy: floatingUIOptions.strategy,
      middleware
    }).then(({ x, y, strategy }) => {
      element.style.width = 'max-content'
      element.style.position = strategy
      element.style.left = `${x}px`
      element.style.top = `${y}px`
    })
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
  const pluginKeyInstance = typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey

  const plugin = Suggestion({
    pluginKey: pluginKeyInstance,
    editor: options.editor,
    char: options.char,
    items: ({ query }: { query: string }) => {
      const filtered = filter(flatItems.value, query)
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
            groups: groups.value,
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
            groups: groups.value,
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
          filteredItems.value = suggestionProps.items as T[]

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

          // Set state to open for animation
          menuState.value = 'open'

          // Add global keyboard listener to capture Enter/arrows
          globalKeyHandler = (e: KeyboardEvent) => {
            if (keyDownHandler) {
              const handled = keyDownHandler({ event: e })
              if (handled) {
                e.preventDefault()
                e.stopPropagation()
              }
            }
          }
          document.addEventListener('keydown', globalKeyHandler, true) // Use capture phase

          // Add scroll listener to update position on scroll
          scrollHandler = () => {
            if (element) {
              updatePosition(element)
            }
          }
          window.addEventListener('scroll', scrollHandler, true)

          // Define onHover handler that updates both state and renderer
          handleHover = (index: number) => {
            selectedIndex.value = index
            // Trigger re-render with updated selectedIndex
            if (renderer) {
              renderer.updateProps({
                groups: groups.value,
                selectedIndex: index,
                onSelect: commandFn,
                onHover: handleHover!,
                state: menuState.value
              })
            }
          }

          renderer = new VueRenderer(MenuComponent, {
            props: {
              groups: groups.value,
              selectedIndex: selectedIndex.value,
              onSelect: commandFn,
              onHover: handleHover,
              state: menuState.value
            },
            editor: suggestionProps.editor
          })

          element = document.createElement('div')
          element.style.position = 'absolute'
          element.style.zIndex = '50'

          // Prevent the menu from capturing mouse down events which would steal focus
          handleMouseDown = (e: MouseEvent) => {
            e.preventDefault()
          }
          element.addEventListener('mousedown', handleMouseDown)

          // Attach to appendTo or editor's parent element
          const appendToElement = typeof options.appendTo === 'function' ? options.appendTo() : options.appendTo
          ;(appendToElement ?? suggestionProps.editor.view.dom.parentElement)?.appendChild(element)
          if (renderer.element) {
            element.appendChild(renderer.element)
          }

          updatePosition(element)
        },
        onUpdate: (suggestionProps: SuggestionProps) => {
          filteredItems.value = suggestionProps.items as T[]

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
            // Set state to open for animation
            menuState.value = 'open'

            // Re-add global keyboard listener
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

            // Re-add scroll listener
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
              // Trigger re-render with updated selectedIndex
              if (renderer) {
                renderer.updateProps({
                  groups: groups.value,
                  selectedIndex: index,
                  onSelect: commandFn,
                  onHover: handleHover!,
                  state: menuState.value
                })
              }
            }

            renderer = new VueRenderer(MenuComponent, {
              props: {
                groups: groups.value,
                selectedIndex: selectedIndex.value,
                onSelect: commandFn,
                onHover: handleHover,
                state: menuState.value
              },
              editor: suggestionProps.editor
            })

            element = document.createElement('div')
            element.style.position = 'absolute'
            element.style.zIndex = '50'

            // Prevent the menu from capturing mouse down events which would steal focus
            handleMouseDown = (e: MouseEvent) => {
              e.preventDefault()
            }
            element.addEventListener('mousedown', handleMouseDown)

            // Attach to appendTo or editor's parent element
            const appendToElement = typeof options.appendTo === 'function' ? options.appendTo() : options.appendTo
            ;(appendToElement ?? suggestionProps.editor.view.dom.parentElement)?.appendChild(element)
            if (renderer.element) {
              element.appendChild(renderer.element)
            }
          } else {
          // Update existing renderer
            renderer.updateProps({
              groups: groups.value,
              selectedIndex: selectedIndex.value,
              onSelect: commandFn,
              onHover: (index: number) => {
                selectedIndex.value = index
              },
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
        }
      }
      return handlers
    }
  })

  // Cleanup function (immediate, no animation)
  const destroy = () => {
    if (globalKeyHandler) {
      document.removeEventListener('keydown', globalKeyHandler, true)
      globalKeyHandler = null
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
  }

  return {
    plugin,
    destroy,
    filteredItems
  }
}
