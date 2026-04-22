import { flip, shift, offset, size, autoPlacement, hide, inline } from "@floating-ui/dom";
import { isArrayOfArray } from "./index.js";
export function isMarkInSchema(mark, editor) {
  if (!editor?.schema) {
    return false;
  }
  const markName = typeof mark === "string" ? mark : mark.name;
  return editor.schema.spec.marks.get(markName) !== void 0;
}
export function isNodeTypeSelected(editor, nodeTypes) {
  if (!editor) {
    return false;
  }
  const { selection } = editor.state;
  const { $from, to } = selection;
  return nodeTypes.some((nodeType) => {
    return editor.state.doc.nodesBetween($from.pos, to, (node) => {
      return node.type.name === nodeType;
    });
  });
}
export function isExtensionAvailable(editor, extensionName) {
  if (!editor) {
    return false;
  }
  return editor.extensionManager.extensions.some((ext) => ext.name === extensionName);
}
export function createToggleHandler(name) {
  const fnName = `toggle${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  return {
    canExecute: (editor) => editor.can()[fnName](),
    execute: (editor) => editor.chain().focus()[fnName](),
    isActive: (editor) => editor.isActive(name),
    isDisabled: (editor) => isNodeTypeSelected(editor, ["image"]) || editor.isActive("code")
  };
}
export function createSetHandler(name) {
  const fnName = `set${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  return {
    canExecute: (editor) => editor.can()[fnName](),
    execute: (editor) => editor.chain().focus()[fnName](),
    isActive: (editor) => editor.isActive(name),
    isDisabled: (editor) => isNodeTypeSelected(editor, ["image"]) || editor.isActive("code")
  };
}
export function createSimpleHandler(name) {
  return {
    canExecute: (editor) => editor.can()[name](),
    execute: (editor) => editor.chain()[name](),
    isActive: () => false,
    isDisabled: void 0
  };
}
export function createMarkHandler() {
  return {
    canExecute: (editor, cmd) => editor.can().toggleMark(cmd.mark),
    execute: (editor, cmd) => editor.chain().focus().toggleMark(cmd.mark),
    isActive: (editor, cmd) => editor.isActive(cmd.mark),
    isDisabled: (editor, cmd) => !isMarkInSchema(cmd.mark, editor) || isNodeTypeSelected(editor, ["image"])
  };
}
export function createTextAlignHandler() {
  return {
    canExecute: (editor, cmd) => editor.can().setTextAlign(cmd.align),
    execute: (editor, cmd) => editor.chain().focus().setTextAlign(cmd.align),
    isActive: (editor, cmd) => editor.isActive({ textAlign: cmd.align }),
    isDisabled: (editor) => !isExtensionAvailable(editor, "textAlign") || isNodeTypeSelected(editor, ["image", "horizontalRule"])
  };
}
export function createHeadingHandler() {
  return {
    canExecute: (editor, cmd) => editor.can().toggleHeading({ level: cmd.level }),
    execute: (editor, cmd) => editor.chain().focus().toggleHeading({ level: cmd.level }),
    isActive: (editor, cmd) => editor.isActive("heading", { level: cmd.level }),
    isDisabled: (editor) => isNodeTypeSelected(editor, ["image"]) || editor.isActive("code")
  };
}
export function createLinkHandler() {
  return {
    canExecute: (editor) => {
      return editor.can().setLink({ href: "" }) || editor.can().unsetLink();
    },
    execute: (editor, cmd) => {
      const chain = editor.chain();
      const previousUrl = editor.getAttributes("link").href;
      const hasCode = editor.isActive("code");
      if (previousUrl) {
        return chain.focus().unsetLink();
      }
      const href = cmd?.href || prompt("Enter the URL:");
      if (!href) {
        return chain;
      }
      if (hasCode) {
        return chain.focus().extendMarkRange("code").setLink({ href });
      }
      return chain.focus().setLink({ href });
    },
    isActive: (editor) => editor.isActive("link"),
    isDisabled: (editor) => {
      if (!isExtensionAvailable(editor, "link") || isNodeTypeSelected(editor, ["image"])) {
        return true;
      }
      const { selection } = editor.state;
      return selection.empty && !editor.isActive("link");
    }
  };
}
export function createImageHandler() {
  return {
    canExecute: (editor) => {
      return editor.can().setImage({ src: "" });
    },
    execute: (editor, cmd) => {
      const chain = editor.chain().focus();
      if (cmd?.src) {
        return chain.setImage({ src: cmd.src });
      }
      const src = prompt("Enter the image URL:");
      if (src) {
        return chain.setImage({ src });
      }
      return chain;
    },
    isActive: (editor) => editor.isActive("image"),
    isDisabled: (editor) => {
      return !isExtensionAvailable(editor, "image");
    }
  };
}
export function createListHandler(listType) {
  const fnNameMap = {
    bulletList: "toggleBulletList",
    orderedList: "toggleOrderedList",
    taskList: "toggleTaskList"
  };
  const fnName = fnNameMap[listType];
  const listItemType = listType === "taskList" ? "taskItem" : "listItem";
  const allListTypes = ["bulletList", "orderedList", "taskList"];
  return {
    canExecute: (editor) => {
      return editor.can()[fnName]() || editor.isActive("listItem") || allListTypes.some((type) => isExtensionAvailable(editor, type) && editor.isActive(type));
    },
    execute: (editor) => {
      const { state } = editor;
      const { selection } = state;
      let chain = editor.chain().focus();
      if (selection.node) {
        const node = selection.node;
        const firstChild = node.firstChild?.firstChild;
        const lastChild = node.lastChild?.lastChild;
        const from = firstChild ? selection.from + firstChild.nodeSize : selection.from + 1;
        const to = lastChild ? selection.to - lastChild.nodeSize : selection.to - 1;
        chain = chain.setTextSelection({ from, to }).clearNodes();
      }
      if (editor.isActive(listType)) {
        let result = chain.liftListItem(listItemType);
        for (const type of allListTypes) {
          if (isExtensionAvailable(editor, type)) {
            result = result.lift(type);
          }
        }
        return result.selectTextblockEnd();
      }
      if (allListTypes.some((type) => isExtensionAvailable(editor, type) && editor.isActive(type))) {
        const currentListItemType = editor.isActive("taskList") ? "taskItem" : "listItem";
        let unwrapped = chain.liftListItem(currentListItemType);
        for (const type of allListTypes) {
          if (isExtensionAvailable(editor, type)) {
            unwrapped = unwrapped.lift(type);
          }
        }
        return unwrapped[fnName]().selectTextblockEnd();
      }
      return chain[fnName]().selectTextblockEnd();
    },
    isActive: (editor) => editor.isActive(listType),
    isDisabled: (editor) => {
      if (!isExtensionAvailable(editor, listType)) {
        return true;
      }
      return isNodeTypeSelected(editor, ["image"]) || editor.isActive("code");
    }
  };
}
export function createMoveHandler(direction) {
  return {
    canExecute: (editor, cmd) => {
      if (cmd?.pos == null) return false;
      const node = editor.state.doc.nodeAt(cmd.pos);
      if (!node) return false;
      const $pos = editor.state.doc.resolve(cmd.pos);
      const parent = $pos.parent;
      const index = $pos.index();
      return direction === "up" ? index > 0 : index < parent.childCount - 1;
    },
    execute: (editor, cmd) => {
      if (cmd?.pos == null) return editor.chain();
      const node = editor.state.doc.nodeAt(cmd.pos);
      if (!node) return editor.chain();
      const $pos = editor.state.doc.resolve(cmd.pos);
      const parent = $pos.parent;
      const index = $pos.index();
      if (direction === "up" && index > 0) {
        const prevNode = parent.child(index - 1);
        const targetPos = cmd.pos - prevNode.nodeSize;
        return editor.chain().focus().deleteRange({ from: cmd.pos, to: cmd.pos + node.nodeSize }).insertContentAt(targetPos, node.toJSON());
      }
      if (direction === "down" && index < parent.childCount - 1) {
        const nextNode = parent.child(index + 1);
        const targetPos = cmd.pos + nextNode.nodeSize;
        return editor.chain().focus().deleteRange({ from: cmd.pos, to: cmd.pos + node.nodeSize }).insertContentAt(targetPos, node.toJSON());
      }
      return editor.chain();
    },
    isActive: () => false,
    isDisabled: void 0
  };
}
export function createHandlers() {
  return {
    mark: createMarkHandler(),
    textAlign: createTextAlignHandler(),
    heading: createHeadingHandler(),
    link: createLinkHandler(),
    image: createImageHandler(),
    blockquote: createToggleHandler("blockquote"),
    bulletList: createListHandler("bulletList"),
    orderedList: createListHandler("orderedList"),
    taskList: createListHandler("taskList"),
    codeBlock: createToggleHandler("codeBlock"),
    horizontalRule: createSetHandler("horizontalRule"),
    paragraph: createSetHandler("paragraph"),
    undo: createSimpleHandler("undo"),
    redo: createSimpleHandler("redo"),
    clearFormatting: {
      canExecute: (editor, cmd) => {
        if (cmd?.pos != null) {
          const node = editor.state.doc.nodeAt(cmd.pos);
          return !!node;
        }
        return editor.can().clearNodes() || editor.can().unsetAllMarks();
      },
      execute: (editor, cmd) => {
        if (cmd?.pos != null) {
          const node = editor.state.doc.nodeAt(cmd.pos);
          if (!node) return editor.chain();
          const from = cmd.pos + 1;
          const to = cmd.pos + node.nodeSize - 1;
          return editor.chain().focus().setTextSelection({ from, to }).clearNodes().unsetAllMarks();
        }
        return editor.chain().focus().clearNodes().unsetAllMarks();
      },
      isActive: () => false,
      isDisabled: void 0
    },
    duplicate: {
      canExecute: (editor, cmd) => {
        if (cmd?.pos == null) return false;
        const node = editor.state.doc.nodeAt(cmd.pos);
        return !!node;
      },
      execute: (editor, cmd) => {
        if (cmd?.pos == null) return editor.chain();
        const node = editor.state.doc.nodeAt(cmd.pos);
        if (!node) return editor.chain();
        return editor.chain().focus().insertContentAt(cmd.pos + node.nodeSize, node.toJSON());
      },
      isActive: () => false,
      isDisabled: void 0
    },
    delete: {
      canExecute: (editor, cmd) => {
        if (cmd?.pos == null) return false;
        const node = editor.state.doc.nodeAt(cmd.pos);
        return !!node;
      },
      execute: (editor, cmd) => {
        if (cmd?.pos == null) return editor.chain();
        const node = editor.state.doc.nodeAt(cmd.pos);
        if (!node) return editor.chain();
        return editor.chain().focus().deleteRange({ from: cmd.pos, to: cmd.pos + node.nodeSize });
      },
      isActive: () => false,
      isDisabled: void 0
    },
    moveUp: createMoveHandler("up"),
    moveDown: createMoveHandler("down"),
    suggestion: {
      canExecute: () => true,
      execute: (editor, cmd) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        if (cmd?.pos !== void 0) {
          const node = state.doc.nodeAt(cmd.pos);
          if (node) {
            const insertPos2 = cmd.pos + node.nodeSize;
            return editor.chain().focus().insertContentAt(insertPos2, { type: "paragraph", content: [{ type: "text", text: "/" }] });
          }
        }
        const currentNode = $from.node($from.depth);
        const currentNodePos = $from.before($from.depth);
        const insertPos = currentNodePos + currentNode.nodeSize;
        return editor.chain().focus().insertContentAt(insertPos, { type: "paragraph", content: [{ type: "text", text: "/" }] });
      },
      isActive: () => false,
      isDisabled: void 0
    },
    mention: {
      canExecute: () => true,
      execute: (editor) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        const textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - 1), $from.parentOffset, void 0, " ");
        const needsSpace = textBefore && textBefore !== " ";
        return editor.chain().focus().insertContent(needsSpace ? " @" : "@");
      },
      isActive: () => false,
      isDisabled: void 0
    },
    emoji: {
      canExecute: () => true,
      execute: (editor) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        const textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - 1), $from.parentOffset, void 0, " ");
        const needsSpace = textBefore && textBefore !== " ";
        return editor.chain().focus().insertContent(needsSpace ? " :" : ":");
      },
      isActive: () => false,
      isDisabled: void 0
    }
  };
}
export function mapEditorItems(editor, items, customHandlers) {
  const handlers = { ...createHandlers(), ...customHandlers };
  if (isArrayOfArray(items)) {
    return items.map(
      (group) => mapEditorItems(editor, group, customHandlers)
    );
  }
  return items.filter(Boolean).map((item) => {
    if ("type" in item) {
      return item;
    }
    const { kind, children, ...rest } = item;
    const processedChildren = children?.length ? mapEditorItems(editor, children, customHandlers) : void 0;
    if (kind) {
      const handler = handlers[kind];
      if (!handler) {
        return {
          ...rest,
          children: processedChildren
        };
      }
      return {
        ...rest,
        children: processedChildren,
        disabled: handler.isDisabled?.(editor, item) || !handler.canExecute(editor, item),
        active: handler.isActive(editor, item),
        onSelect: () => handler.execute(editor, item).run()
      };
    }
    return { ...rest, children: processedChildren };
  });
}
export function buildFloatingUIMiddleware(options) {
  const middleware = [];
  if (options.offset) {
    middleware.push(offset(typeof options.offset !== "boolean" ? options.offset : void 0));
  }
  if (options.flip) {
    middleware.push(flip(typeof options.flip !== "boolean" ? options.flip : void 0));
  }
  if (options.shift) {
    middleware.push(shift(typeof options.shift !== "boolean" ? options.shift : void 0));
  }
  if (options.size) {
    middleware.push(size(typeof options.size !== "boolean" ? options.size : void 0));
  }
  if (options.autoPlacement) {
    middleware.push(autoPlacement(typeof options.autoPlacement !== "boolean" ? options.autoPlacement : void 0));
  }
  if (options.hide) {
    middleware.push(hide(typeof options.hide !== "boolean" ? options.hide : void 0));
  }
  if (options.inline) {
    middleware.push(inline(typeof options.inline !== "boolean" ? options.inline : void 0));
  }
  return middleware;
}
