import { ref, h, computed, unref, watch } from "vue";
import { defu } from "defu";
import { useFilter } from "./useFilter.js";
import { computePosition } from "@floating-ui/dom";
import { VueRenderer } from "@tiptap/vue-3";
import Suggestion from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";
import { buildFloatingUIMiddleware } from "../utils/editor.js";
import { get, isArrayOfArray } from "../utils/index.js";
export function useEditorMenu(options) {
  const filteredItems = ref([]);
  const selectedIndex = ref(0);
  const menuState = ref("closed");
  const searchTerm = options.searchTerm ?? ref("");
  let renderer = null;
  let element = null;
  let handleMouseDown = null;
  let commandFn = null;
  let keyDownHandler = null;
  let globalKeyHandler = null;
  let blurHandler = null;
  let triggerClientRect = null;
  let handleHover = null;
  let scrollHandler = null;
  let stopItemsWatch = null;
  const { score } = useFilter();
  const cleanupMenu = () => {
    if (menuState.value === "closed") return;
    menuState.value = "closed";
    if (globalKeyHandler) {
      document.removeEventListener("keydown", globalKeyHandler, true);
      globalKeyHandler = null;
    }
    if (blurHandler) {
      options.editor.view.dom.removeEventListener("blur", blurHandler);
      blurHandler = null;
    }
    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler, true);
      scrollHandler = null;
    }
    if (element && handleMouseDown) {
      element.removeEventListener("mousedown", handleMouseDown);
      handleMouseDown = null;
    }
    if (renderer) {
      renderer.destroy();
      renderer = null;
    }
    if (element) {
      element.remove();
      element = null;
    }
  };
  const filterFields = options.filterFields ?? ["label"];
  const defaultFilter = (items2, query) => {
    if (!query) return items2;
    const scored = [];
    for (const item of items2) {
      let bestScore = null;
      for (const field of filterFields) {
        const value = get(item, field);
        if (value == null) continue;
        const values = Array.isArray(value) ? value.map(String) : [String(value)];
        for (const v of values) {
          const normalized = v.replace(/[\s_-]/g, "");
          const s = Math.min(score(v, query) ?? 3, score(normalized, query) ?? 3);
          if (bestScore === null || s < bestScore) bestScore = s;
          if (bestScore === 0) break;
        }
        if (bestScore === 0) break;
      }
      if (bestScore !== null && bestScore < 3) {
        scored.push({ item, score: bestScore });
      }
    }
    scored.sort((a, b) => a.score - b.score);
    return scored.map(({ item }) => item);
  };
  const filter = options.filter || defaultFilter;
  const limit = options.limit ?? 42;
  const pluginKeyInstance = typeof options.pluginKey === "string" ? new PluginKey(options.pluginKey) : options.pluginKey;
  const groups = computed(() => {
    const items2 = unref(options.items);
    return items2?.length ? isArrayOfArray(items2) ? items2 : [items2] : [];
  });
  const items = computed(() => groups.value.flatMap((group) => group));
  const filteredGroups = computed(() => {
    if (!filteredItems.value.length) return [];
    if (options.ignoreFilter) {
      return [filteredItems.value];
    }
    return groups.value.map((group) => {
      const filtered = group.filter((item) => filteredItems.value.includes(item));
      filtered.sort((a, b) => filteredItems.value.indexOf(a) - filteredItems.value.indexOf(b));
      return filtered;
    }).filter((group) => group.length > 0);
  });
  const selectableItems = computed(() => {
    return filteredItems.value.filter((item) => {
      return item.type !== "label" && item.type !== "separator";
    });
  });
  const floatingUIOptions = defu(options.options, {
    strategy: "absolute",
    placement: "bottom-start",
    offset: 8,
    flip: {},
    shift: { padding: 8 },
    size: false,
    autoPlacement: false,
    hide: false,
    inline: false
  });
  const middleware = buildFloatingUIMiddleware(floatingUIOptions);
  const updatePosition = (el) => {
    if (!triggerClientRect) return;
    const rect = triggerClientRect();
    if (!rect) return;
    const virtualElement = {
      getBoundingClientRect: () => rect
    };
    computePosition(virtualElement, el, {
      placement: floatingUIOptions.placement,
      strategy: floatingUIOptions.strategy,
      middleware
    }).then(({ x, y, strategy }) => {
      el.style.width = "max-content";
      el.style.position = strategy;
      el.style.top = "0";
      el.style.left = "0";
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    });
  };
  const showMenu = () => {
    menuState.value = "open";
    if (!globalKeyHandler) {
      globalKeyHandler = (e) => {
        if (keyDownHandler) {
          const handled = keyDownHandler({ event: e });
          if (handled) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      };
      document.addEventListener("keydown", globalKeyHandler, true);
    }
    if (!blurHandler) {
      blurHandler = () => {
        setTimeout(() => {
          if (menuState.value === "open") {
            const tr = options.editor.view.state.tr.setMeta(pluginKeyInstance, { exit: true });
            options.editor.view.dispatch(tr);
          }
        }, 0);
      };
      options.editor.view.dom.addEventListener("blur", blurHandler);
    }
    if (!scrollHandler) {
      scrollHandler = () => {
        if (element) {
          updatePosition(element);
        }
      };
      window.addEventListener("scroll", scrollHandler, true);
    }
    handleHover = (index) => {
      selectedIndex.value = index;
      if (renderer) {
        renderer.updateProps({
          groups: filteredGroups.value,
          selectedIndex: index,
          onSelect: commandFn,
          onHover: handleHover,
          state: menuState.value
        });
      }
    };
    renderer = new VueRenderer(MenuComponent, {
      props: {
        groups: filteredGroups.value,
        selectedIndex: selectedIndex.value,
        onSelect: commandFn,
        onHover: handleHover,
        state: menuState.value
      },
      editor: options.editor
    });
    element = document.createElement("div");
    element.style.position = floatingUIOptions.strategy;
    element.style.zIndex = "50";
    handleMouseDown = (e) => {
      e.preventDefault();
    };
    element.addEventListener("mousedown", handleMouseDown);
    const appendToElement = typeof options.appendTo === "function" ? options.appendTo() : options.appendTo;
    const container = appendToElement ?? options.editor.view.dom.parentElement;
    container?.appendChild(element);
    if (renderer.element) {
      element.appendChild(renderer.element);
    }
    updatePosition(element);
  };
  if (options.ignoreFilter) {
    stopItemsWatch = watch(() => unref(options.items), (newItems) => {
      if (!triggerClientRect) return;
      const normalizedItems = newItems?.length ? isArrayOfArray(newItems) ? newItems.flat() : newItems : [];
      filteredItems.value = normalizedItems.slice(0, limit);
      if (!filteredItems.value.length) {
        cleanupMenu();
        return;
      }
      if (selectedIndex.value >= selectableItems.value.length) {
        selectedIndex.value = Math.max(0, selectableItems.value.length - 1);
      }
      if (menuState.value === "closed" && filteredItems.value.length) {
        showMenu();
        return;
      }
      if (renderer) {
        renderer.updateProps({
          groups: filteredGroups.value,
          selectedIndex: selectedIndex.value,
          onSelect: commandFn,
          onHover: handleHover,
          state: menuState.value
        });
      }
      if (element) {
        updatePosition(element);
      }
    }, { deep: true, flush: "sync" });
  }
  const MenuComponent = {
    props: {
      groups: { type: Array, required: true },
      selectedIndex: { type: Number, required: true },
      onSelect: { type: Function, required: true },
      onHover: { type: Function, required: true },
      state: { type: String, required: true }
    },
    setup(menuProps) {
      function handleClick(e, item, selectableIndex) {
        e.preventDefault();
        menuProps.onSelect(item, selectableIndex);
      }
      function handleMouseEnter(selectableIndex) {
        menuProps.onHover(selectableIndex);
      }
      return () => {
        const groupsData = menuProps.groups;
        const selectableIndexMap = /* @__PURE__ */ new Map();
        let selectableCounter = 0;
        for (const group of groupsData) {
          for (const item of group) {
            const itemData = item;
            if (itemData.type !== "label" && itemData.type !== "separator") {
              selectableIndexMap.set(item, selectableCounter++);
            }
          }
        }
        return h("div", {
          "class": options.ui.value.content(),
          "role": "listbox",
          "data-state": menuProps.state
        }, [
          h("div", {
            class: options.ui.value.viewport(),
            role: "presentation"
          }, groupsData.map(
            (group, groupIndex) => h("div", {
              key: `group-${groupIndex}`,
              class: options.ui.value.group(),
              role: "group"
            }, group.map((item, itemInGroupIndex) => {
              const itemData = item;
              if (itemData.type === "label") {
                return h("div", {
                  key: `label-${groupIndex}-${itemInGroupIndex}`,
                  class: options.ui.value.label({ class: itemData.class })
                }, options.renderItem(item, options.ui));
              }
              if (itemData.type === "separator") {
                return h("div", {
                  key: `separator-${groupIndex}-${itemInGroupIndex}`,
                  class: options.ui.value.separator({ class: itemData.class }),
                  role: "separator"
                });
              }
              const selectableIndex = selectableIndexMap.get(item);
              const isHighlighted = selectableIndex === menuProps.selectedIndex;
              return h("div", {
                "key": `item-${selectableIndex}`,
                "class": options.ui.value.item({ class: itemData.class, active: false }),
                "role": "option",
                "aria-selected": isHighlighted,
                "data-highlighted": isHighlighted ? "" : void 0,
                "data-disabled": itemData.disabled ? "" : void 0,
                "onMousedown": (e) => handleClick(e, item, selectableIndex),
                "onMouseenter": () => handleMouseEnter(selectableIndex),
                "ref": (el) => {
                  if (el && isHighlighted) {
                    el.scrollIntoView({ block: "nearest", inline: "nearest" });
                  }
                }
              }, options.renderItem(item, options.ui));
            }))
          ))
        ]);
      };
    }
  };
  const plugin = Suggestion({
    ...options.suggestion || {},
    pluginKey: pluginKeyInstance,
    editor: options.editor,
    char: options.char,
    items: ({ query: q }) => {
      searchTerm.value = q;
      if (options.ignoreFilter) {
        return items.value.slice(0, limit);
      }
      const filtered = filter(items.value, q);
      return filtered.slice(0, limit);
    },
    command: ({ editor, range, props }) => {
      options.onSelect(editor, range, props);
    },
    render: () => {
      keyDownHandler = (props) => {
        const { event } = props;
        if (!renderer || !selectableItems.value.length) {
          return false;
        }
        if (event.key === "Escape") {
          cleanupMenu();
          return true;
        }
        if (event.key === "ArrowUp") {
          selectedIndex.value = (selectedIndex.value + selectableItems.value.length - 1) % selectableItems.value.length;
          renderer?.updateProps({
            groups: filteredGroups.value,
            selectedIndex: selectedIndex.value,
            onSelect: commandFn,
            onHover: handleHover,
            state: menuState.value
          });
          return true;
        }
        if (event.key === "ArrowDown") {
          selectedIndex.value = (selectedIndex.value + 1) % selectableItems.value.length;
          renderer?.updateProps({
            groups: filteredGroups.value,
            selectedIndex: selectedIndex.value,
            onSelect: commandFn,
            onHover: handleHover,
            state: menuState.value
          });
          return true;
        }
        if (event.key === "Enter" || event.key === "Tab") {
          const selectedItem = selectableItems.value[selectedIndex.value];
          if (selectedItem && commandFn) {
            commandFn(selectedItem);
          }
          return true;
        }
        return false;
      };
      const handlers = {
        onStart: (suggestionProps) => {
          filteredItems.value = options.ignoreFilter ? items.value.slice(0, limit) : suggestionProps.items;
          selectedIndex.value = 0;
          commandFn = (item) => suggestionProps.command(item);
          triggerClientRect = suggestionProps.clientRect;
          if (!filteredItems.value.length) {
            return;
          }
          showMenu();
        },
        onUpdate: (suggestionProps) => {
          filteredItems.value = options.ignoreFilter ? items.value.slice(0, limit) : suggestionProps.items;
          commandFn = (item) => suggestionProps.command(item);
          if (selectedIndex.value >= selectableItems.value.length) {
            selectedIndex.value = Math.max(0, selectableItems.value.length - 1);
          }
          if (!filteredItems.value.length) {
            cleanupMenu();
            return;
          }
          if (!renderer) {
            showMenu();
          } else {
            renderer.updateProps({
              groups: filteredGroups.value,
              selectedIndex: selectedIndex.value,
              onSelect: commandFn,
              onHover: handleHover,
              state: menuState.value
            });
          }
          if (element) {
            updatePosition(element);
          }
        },
        onKeyDown: keyDownHandler,
        onExit: () => {
          cleanupMenu();
          triggerClientRect = null;
          searchTerm.value = "";
        }
      };
      return handlers;
    }
  });
  const destroy = () => {
    menuState.value = "closed";
    if (globalKeyHandler) {
      document.removeEventListener("keydown", globalKeyHandler, true);
      globalKeyHandler = null;
    }
    if (blurHandler) {
      options.editor.view.dom.removeEventListener("blur", blurHandler);
      blurHandler = null;
    }
    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler, true);
      scrollHandler = null;
    }
    if (element && handleMouseDown) {
      element.removeEventListener("mousedown", handleMouseDown);
      handleMouseDown = null;
    }
    if (renderer) {
      renderer.destroy();
      renderer = null;
    }
    if (element) {
      element.remove();
      element = null;
    }
    if (stopItemsWatch) {
      stopItemsWatch();
      stopItemsWatch = null;
    }
  };
  return {
    plugin,
    destroy,
    filteredItems,
    searchTerm
  };
}
