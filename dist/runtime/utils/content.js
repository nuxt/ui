export function mapContentNavigationItem(item, options, currentDepth = 0) {
  const navMap = {
    [options?.labelAttribute || "title"]: "label",
    path: "to"
  };
  const link = Object.keys(item).reduce((link2, key) => {
    if (item[key]) {
      const mappedKey = navMap[key] || key;
      link2[mappedKey] = item[key];
    }
    return link2;
  }, {});
  const shouldRecurse = typeof options?.deep === "undefined" || currentDepth < options.deep;
  if (shouldRecurse && Array.isArray(item.children)) {
    link.children = item.children.map(
      (child) => mapContentNavigationItem(child, options, currentDepth + 1)
    );
  } else {
    link.children = [];
  }
  return link;
}
export function mapContentNavigation(navigation, options) {
  return navigation.map((item) => mapContentNavigationItem(item, options));
}
