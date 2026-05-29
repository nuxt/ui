import { ref } from "vue";
import { createSharedComposable } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { sanitizeSnippet } from "../utils/search.js";
function _useContentSearch() {
  const open = ref(false);
  const appConfig = useAppConfig();
  function mapFile(file, link, ancestors = []) {
    const prefix = [...new Set([...ancestors.map((a) => a.title), ...file.titles].filter(Boolean))];
    const ancestorIcon = ancestors.findLast((a) => a.icon)?.icon;
    return {
      prefix: prefix?.length ? prefix.join(" > ") + " >" : void 0,
      label: file.id === link.path ? link.title : file.title,
      suffix: file.content.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
      to: file.id,
      icon: link.icon || ancestorIcon || (file.level > 1 ? appConfig.ui.icons.hash : appConfig.ui.icons.file),
      level: file.level
    };
  }
  function mapNavigationItems(children, files, parent) {
    const filesByPath = /* @__PURE__ */ new Map();
    for (const file of files || []) {
      const basePath = file.id.split("#")[0] || file.id;
      let bucket = filesByPath.get(basePath);
      if (!bucket) {
        bucket = [];
        filesByPath.set(basePath, bucket);
      }
      bucket.push(file);
    }
    function visit(nodes, ancestors) {
      return nodes.flatMap((link) => {
        if (link.children?.length) {
          return visit(link.children, [...ancestors, link]);
        }
        const matched = link.path ? filesByPath.get(link.path) : void 0;
        return matched?.map((file) => mapFile(file, link, ancestors)) || [];
      });
    }
    return visit(children, parent ? [parent] : []);
  }
  function mapLinks(links) {
    return links.flatMap((link) => [{
      ...link,
      suffix: link.description,
      description: void 0,
      icon: link.icon || appConfig.ui.icons.file,
      children: void 0
    }, ...link.children?.map((child) => ({
      ...child,
      prefix: link.label ? link.label + " >" : void 0,
      suffix: child.description,
      description: void 0,
      icon: child.icon || link.icon || appConfig.ui.icons.file
    })) || []]);
  }
  function findNavItem(path, nodes, ancestors = []) {
    for (const node of nodes || []) {
      if (node.path === path) return { link: node, ancestors };
      if (node.children?.length) {
        const found = findNavItem(path, node.children, [...ancestors, node]);
        if (found.link) return found;
      }
    }
    return {};
  }
  function mapSearchResults(results, navigation) {
    const navCache = /* @__PURE__ */ new Map();
    return results.reduce((acc, result) => {
      const basePath = result.id.split("#")[0] ?? result.id;
      let nav = navCache.get(basePath);
      if (!nav) {
        nav = findNavItem(basePath, navigation);
        navCache.set(basePath, nav);
      }
      const { link, ancestors = [] } = nav;
      if (navigation?.length && !link) return acc;
      const sectionChain = ancestors.length ? ancestors : link ? [link] : [];
      const prefixParts = [...new Set([...sectionChain.map((s) => s.title), ...result.titles].filter(Boolean))];
      const prefix = prefixParts.length ? prefixParts.join(" > ") + " >" : void 0;
      const ancestorIcon = ancestors.findLast((a) => a.icon)?.icon;
      acc.push({
        label: result.title,
        labelHtml: result.snippets?.title ? sanitizeSnippet(result.snippets.title) : void 0,
        prefix,
        description: result.content.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
        descriptionHtml: result.snippets?.content ? sanitizeSnippet(result.snippets.content) : void 0,
        to: result.id,
        icon: link?.icon || ancestorIcon || (result.level > 1 ? appConfig.ui.icons.hash : appConfig.ui.icons.file),
        level: result.level
      });
      return acc;
    }, []);
  }
  function postFilter(query, items) {
    if (!query) {
      return items?.filter((item) => item.level === 1);
    }
    return items;
  }
  return {
    open,
    mapFile,
    mapNavigationItems,
    mapLinks,
    mapSearchResults,
    postFilter
  };
}
export const useContentSearch = /* @__PURE__ */ createSharedComposable(_useContentSearch);
