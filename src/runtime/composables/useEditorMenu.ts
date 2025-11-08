import { ref, h, computed, type Ref, type ComputedRef } from 'vue'
import { computePosition, flip, shift } from '@floating-ui/dom'
import type { Editor } from '@tiptap/vue-3'
import { VueRenderer } from '@tiptap/vue-3'
import type { SuggestionProps } from '@tiptap/suggestion'
import Suggestion from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'
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
  items: T[] | T[][]
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
   * UI styles computed ref
   */
  ui: ComputedRef<any>
}

export function useEditorMenu<T = any>(options: EditorMenuOptions<T>) {
  const filteredItems: Ref<T[]> = ref([])
  const selectedIndex = ref(0)
  let renderer: VueRenderer | null = null
  let element: HTMLElement | null = null
  let handleMouseDown: ((e: MouseEvent) => void) | null = null
  let commandFn: ((item: T) => void) | null = null
  let keyDownHandler: ((props: { event: KeyboardEvent }) => boolean) | null = null
  let globalKeyHandler: ((e: KeyboardEvent) => void) | null = null
  let triggerClientRect: (() => DOMRect | null) | null = null
  let handleHover: ((index: number) => void) | null = null

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
    return isArrayOfArray(options.items)
      ? (options.items as T[][]).flat()
      : options.items as T[]
  })

  // Group items back into groups after filtering
  const groups = computed<T[][]>(() => {
    if (filteredItems.value.length === 0) return []

    if (isArrayOfArray(options.items)) {
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

  // Helper function to update menu position using floating-ui
  const updatePosition = (element: HTMLElement) => {
    if (!triggerClientRect) return

    const rect = triggerClientRect()
    if (!rect) return

    const virtualElement = {
      getBoundingClientRect: () => rect
    }

    computePosition(virtualElement, element, {
      placement: 'bottom-start',
      strategy: 'absolute',
      middleware: [shift(), flip()]
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
      onHover: { type: Function, required: true }
    },
    setup(menuProps: any) {
      function handleClick(e: MouseEvent, item: T, index: number) {
        e.preventDefault()
        menuProps.onSelect(item, index)
      }

      function handleMouseEnter(index: number) {
        // Update selected index on hover via callback
        menuProps.onHover(index)
      }

      return () => {
        const groupsData = menuProps.groups as T[][]
        let globalIndex = 0

        return h('div', {
          class: options.ui.value.root()
        }, [
          h('div', { class: options.ui.value.content() }, [
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

                // Render label (non-interactive)
                if (itemData.type === 'label') {
                  return h('div', {
                    key: `label-${groupIndex}-${itemInGroupIndex}`,
                    class: options.ui.value.label({ class: itemData.class }),
                    role: 'presentation'
                  }, options.renderItem(item, options.ui))
                }

                // Render regular item (interactive)
                const itemIndex = globalIndex++
                const isHighlighted = itemIndex === menuProps.selectedIndex
                return h('div', {
                  'key': itemIndex,
                  'class': options.ui.value.item({ class: itemData.class, active: false }),
                  'role': 'option',
                  'aria-selected': isHighlighted,
                  'data-highlighted': isHighlighted ? '' : undefined,
                  'data-disabled': itemData.disabled ? '' : undefined,
                  'onMousedown': (e: MouseEvent) => handleClick(e, item, itemIndex),
                  'onMouseenter': () => handleMouseEnter(itemIndex)
                }, options.renderItem(item, options.ui))
              }))
            ))
          ])
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

        if (!renderer || !filteredItems.value.length) {
          return false
        }

        // Handle Escape
        if (event.key === 'Escape') {
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
          return true
        }

        // Handle ArrowUp
        if (event.key === 'ArrowUp') {
          selectedIndex.value = (selectedIndex.value + filteredItems.value.length - 1) % filteredItems.value.length
          renderer?.updateProps({
            groups: groups.value,
            selectedIndex: selectedIndex.value,
            onSelect: commandFn,
            onHover: handleHover!
          })
          return true
        }

        // Handle ArrowDown
        if (event.key === 'ArrowDown') {
          selectedIndex.value = (selectedIndex.value + 1) % filteredItems.value.length
          renderer?.updateProps({
            groups: groups.value,
            selectedIndex: selectedIndex.value,
            onSelect: commandFn,
            onHover: handleHover!
          })
          return true
        }

        // Handle Enter or Tab
        if (event.key === 'Enter' || event.key === 'Tab') {
          const selectedItem = filteredItems.value[selectedIndex.value]
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
          selectedIndex.value = 0

          // Capture the command function for use in keyboard navigation
          commandFn = (item: T) => suggestionProps.command(item)

          // Store the trigger position (where the `/`, `@`, or `:` is)
          triggerClientRect = suggestionProps.clientRect as () => DOMRect | null

          // Only show menu if there are items
          if (!filteredItems.value.length) {
            return
          }

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

          // Define onHover handler that updates both state and renderer
          handleHover = (index: number) => {
            selectedIndex.value = index
            // Trigger re-render with updated selectedIndex
            if (renderer) {
              renderer.updateProps({
                groups: groups.value,
                selectedIndex: index,
                onSelect: commandFn,
                onHover: handleHover!
              })
            }
          }

          renderer = new VueRenderer(MenuComponent, {
            props: {
              groups: groups.value,
              selectedIndex: selectedIndex.value,
              onSelect: commandFn,
              onHover: handleHover
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

          document.body.appendChild(element)
          if (renderer.element) {
            element.appendChild(renderer.element)
          }

          updatePosition(element)
        },
        onUpdate: (suggestionProps: SuggestionProps) => {
          filteredItems.value = suggestionProps.items as T[]

          // Update the command function
          commandFn = (item: T) => suggestionProps.command(item)

          // Reset selected index if out of bounds
          if (selectedIndex.value >= filteredItems.value.length) {
            selectedIndex.value = Math.max(0, filteredItems.value.length - 1)
          }

          // Hide menu if no items
          if (!filteredItems.value.length) {
          // Remove global keyboard listener
            if (globalKeyHandler) {
              document.removeEventListener('keydown', globalKeyHandler, true)
              globalKeyHandler = null
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
            return
          }

          // Show menu if it was hidden
          if (!renderer) {
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

            // Define onHover handler that updates both state and renderer
            handleHover = (index: number) => {
              selectedIndex.value = index
              // Trigger re-render with updated selectedIndex
              if (renderer) {
                renderer.updateProps({
                  groups: groups.value,
                  selectedIndex: index,
                  onSelect: commandFn,
                  onHover: handleHover!
                })
              }
            }

            renderer = new VueRenderer(MenuComponent, {
              props: {
                groups: groups.value,
                selectedIndex: selectedIndex.value,
                onSelect: commandFn,
                onHover: handleHover
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

            document.body.appendChild(element)
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
              }
            })
          }

          if (element) {
            updatePosition(element)
          }
        },
        onKeyDown: keyDownHandler!,
        onExit: () => {
        // Remove global keyboard listener
          if (globalKeyHandler) {
            document.removeEventListener('keydown', globalKeyHandler, true)
            globalKeyHandler = null
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
          // Clear the stored trigger position
          triggerClientRect = null
        }
      }
      return handlers
    }
  })

  // Cleanup function
  const destroy = () => {
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
