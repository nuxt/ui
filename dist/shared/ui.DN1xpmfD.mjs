import { pick } from '../../dist/runtime/utils/index.js';
import 'node:url';
import { pascalCase, kebabCase, camelCase } from 'scule';
import { genExport } from 'knitwork';
import colors from 'tailwindcss/colors';
import { addTypeTemplate, addTemplate, updateTemplates, hasNuxtModule, getLayerDirectories, logger } from '@nuxt/kit';
import { readFile } from 'node:fs/promises';
import { join } from 'pathe';
import { globSync } from 'tinyglobby';
import { defuFn, defu } from 'defu';

const icons = {
  arrowDown: "i-lucide-arrow-down",
  arrowLeft: "i-lucide-arrow-left",
  arrowRight: "i-lucide-arrow-right",
  arrowUp: "i-lucide-arrow-up",
  caution: "i-lucide-circle-alert",
  check: "i-lucide-check",
  chevronDoubleLeft: "i-lucide-chevrons-left",
  chevronDoubleRight: "i-lucide-chevrons-right",
  chevronDown: "i-lucide-chevron-down",
  chevronLeft: "i-lucide-chevron-left",
  chevronRight: "i-lucide-chevron-right",
  chevronUp: "i-lucide-chevron-up",
  close: "i-lucide-x",
  copy: "i-lucide-copy",
  copyCheck: "i-lucide-copy-check",
  dark: "i-lucide-moon",
  drag: "i-lucide-grip-vertical",
  ellipsis: "i-lucide-ellipsis",
  error: "i-lucide-circle-x",
  external: "i-lucide-arrow-up-right",
  eye: "i-lucide-eye",
  eyeOff: "i-lucide-eye-off",
  file: "i-lucide-file",
  folder: "i-lucide-folder",
  folderOpen: "i-lucide-folder-open",
  hash: "i-lucide-hash",
  info: "i-lucide-info",
  light: "i-lucide-sun",
  loading: "i-lucide-loader-circle",
  menu: "i-lucide-menu",
  minus: "i-lucide-minus",
  panelClose: "i-lucide-panel-left-close",
  panelOpen: "i-lucide-panel-left-open",
  plus: "i-lucide-plus",
  reload: "i-lucide-rotate-ccw",
  search: "i-lucide-search",
  stop: "i-lucide-square",
  success: "i-lucide-circle-check",
  system: "i-lucide-monitor",
  tip: "i-lucide-lightbulb",
  upload: "i-lucide-upload",
  warning: "i-lucide-triangle-alert"
};

function resolveColors(colors) {
  return colors?.length ? [.../* @__PURE__ */ new Set(["primary", ...colors])] : ["primary", "secondary", "success", "info", "warning", "error"];
}
function getDefaultConfig(theme) {
  return {
    colors: pick({
      primary: "green",
      secondary: "blue",
      success: "green",
      info: "blue",
      warning: "yellow",
      error: "red",
      neutral: "slate"
    }, [...theme?.colors || [], "neutral"]),
    icons,
    prefix: theme?.prefix,
    tv: {
      twMergeConfig: {
        prefix: theme?.prefix
      }
    }
  };
}
const defaultOptions = {
  prefix: "U",
  fonts: true,
  colorMode: true,
  theme: {
    colors: void 0,
    transitions: true,
    defaultVariants: {
      color: void 0,
      size: void 0
    },
    prefix: void 0
  },
  prose: false,
  mdc: false,
  content: false
};

function prefixClasses(classString, prefix) {
  if (!prefix || !classString) {
    return classString;
  }
  return classString.split(" ").filter(Boolean).map((cls) => `${prefix}:${cls}`).join(" ");
}
function isSizeValue(value) {
  return /^(?:[23]x[sl]|xs|sm|md|lg|xl)$/.test(value.trim());
}
function applyPrefixToObject(obj, prefix, context = []) {
  if (!obj || !prefix) {
    return obj;
  }
  const currentKey = context[context.length - 1];
  const compoundVariantsIndex = context.indexOf("compoundVariants");
  const isInCompoundVariant = compoundVariantsIndex !== -1 && !context.slice(compoundVariantsIndex).includes("class");
  const isInDefaultVariants = context.includes("defaultVariants");
  const isComponentSizeValue = typeof obj === "string" && typeof currentKey === "string" && currentKey.endsWith("Size") && isSizeValue(obj);
  if (typeof obj === "string" && (isInCompoundVariant || isInDefaultVariants || isComponentSizeValue)) {
    return obj;
  }
  if (typeof obj === "string") {
    return prefixClasses(obj, prefix);
  }
  if (Array.isArray(obj)) {
    return obj.map((item, index) => applyPrefixToObject(item, prefix, [...context, String(index)]));
  }
  if (typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = applyPrefixToObject(value, prefix, [...context, key]);
    }
    return result;
  }
  return obj;
}
function applyDefaultVariants(result, defaultVariants) {
  if (!result || !defaultVariants) {
    return result;
  }
  if (defaultVariants.color && result.defaultVariants?.color && result.defaultVariants.color === "primary") {
    result.defaultVariants.color = defaultVariants.color;
  }
  if (defaultVariants.size && result.defaultVariants?.size && result.defaultVariants.size === "md") {
    result.defaultVariants.size = defaultVariants.size;
  }
  return result;
}

async function buildComponentDependencyGraph(componentDir, componentPattern) {
  const dependencyGraph = /* @__PURE__ */ new Map();
  const componentFiles = globSync(["**/*.vue"], {
    cwd: componentDir,
    absolute: true
  });
  for (const componentFile of componentFiles) {
    try {
      const content = await readFile(componentFile, "utf-8");
      const componentName = pascalCase(componentFile.split("/").pop().replace(".vue", ""));
      const dependencies = /* @__PURE__ */ new Set();
      const matches = content.matchAll(componentPattern);
      for (const match of matches) {
        const depName = match[1] || match[2];
        if (depName && depName !== componentName) {
          dependencies.add(depName);
        }
      }
      dependencyGraph.set(componentName, dependencies);
    } catch {
    }
  }
  return dependencyGraph;
}
function resolveComponentDependencies(component, dependencyGraph, resolved = /* @__PURE__ */ new Set()) {
  if (resolved.has(component)) {
    return resolved;
  }
  resolved.add(component);
  const dependencies = dependencyGraph.get(component);
  if (dependencies) {
    for (const dep of dependencies) {
      resolveComponentDependencies(dep, dependencyGraph, resolved);
    }
  }
  return resolved;
}
async function detectUsedComponents(dirs, prefix, componentDir, includeComponents) {
  const detectedComponents = /* @__PURE__ */ new Set();
  if (includeComponents && includeComponents.length > 0) {
    for (const component of includeComponents) {
      detectedComponents.add(component);
    }
  }
  const componentPattern = new RegExp(`<(?:Lazy)?${prefix}([A-Z][a-zA-Z]+)|\\b(?:Lazy)?${prefix}([A-Z][a-zA-Z]+)\\b`, "g");
  for (const dir of dirs) {
    const appFiles = globSync(["**/*.{vue,ts,js,tsx,jsx}"], {
      cwd: dir,
      ignore: ["node_modules/**", ".nuxt/**", "dist/**"]
    });
    for (const file of appFiles) {
      try {
        const filePath = join(dir, file);
        const content = await readFile(filePath, "utf-8");
        const matches = content.matchAll(componentPattern);
        for (const match of matches) {
          const componentName = match[1] || match[2];
          if (componentName) {
            detectedComponents.add(componentName);
          }
        }
      } catch {
      }
    }
  }
  if (detectedComponents.size === 0) {
    return void 0;
  }
  const dependencyGraph = await buildComponentDependencyGraph(componentDir, componentPattern);
  const allComponents = /* @__PURE__ */ new Set();
  for (const component of detectedComponents) {
    const resolved = resolveComponentDependencies(component, dependencyGraph);
    for (const resolvedComponent of resolved) {
      allComponents.add(resolvedComponent);
    }
  }
  return allComponents;
}

const accordion$1 = {
  slots: {
    root: "w-full",
    item: "border-b border-default last:border-b-0",
    header: "flex",
    trigger: "group flex-1 flex items-center gap-1.5 font-medium text-sm py-3.5 focus-visible:outline-primary min-w-0",
    content: "data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out] overflow-hidden focus:outline-none",
    body: "text-sm pb-3.5",
    leadingIcon: "shrink-0 size-5",
    trailingIcon: "shrink-0 size-5 ms-auto group-data-[state=open]:rotate-180 transition-transform duration-200",
    label: "text-start break-words"
  },
  variants: {
    disabled: {
      true: {
        trigger: "cursor-not-allowed opacity-75"
      }
    }
  }
};

const alert = (options) => ({
  slots: {
    root: "relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5",
    wrapper: "min-w-0 flex-1 flex flex-col",
    title: "text-sm font-medium",
    description: "text-sm opacity-90",
    icon: "shrink-0 size-5",
    avatar: "shrink-0",
    avatarSize: "2xl",
    actions: "flex flex-wrap gap-1.5 shrink-0",
    close: "p-0"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      solid: "",
      outline: "",
      soft: "",
      subtle: ""
    },
    orientation: {
      horizontal: {
        root: "items-center",
        actions: "items-center"
      },
      vertical: {
        root: "items-start",
        actions: "items-start mt-2.5"
      }
    },
    title: {
      true: {
        description: "mt-1"
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: "solid",
    class: {
      root: `bg-${color} text-inverted`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "outline",
    class: {
      root: `text-${color} ring ring-inset ring-${color}/25`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "soft",
    class: {
      root: `bg-${color}/10 text-${color}`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "subtle",
    class: {
      root: `bg-${color}/10 text-${color} ring ring-inset ring-${color}/25`
    }
  })), {
    color: "neutral",
    variant: "solid",
    class: {
      root: "text-inverted bg-inverted"
    }
  }, {
    color: "neutral",
    variant: "outline",
    class: {
      root: "text-highlighted bg-default ring ring-inset ring-default"
    }
  }, {
    color: "neutral",
    variant: "soft",
    class: {
      root: "text-highlighted bg-elevated/50"
    }
  }, {
    color: "neutral",
    variant: "subtle",
    class: {
      root: "text-highlighted bg-elevated/50 ring ring-inset ring-accented"
    }
  }],
  defaultVariants: {
    color: "primary",
    variant: "solid"
  }
});

const authForm = {
  slots: {
    root: "w-full space-y-6",
    header: "flex flex-col text-center",
    leading: "mb-2",
    leadingIcon: "size-8 shrink-0 inline-block",
    title: "text-xl text-pretty font-semibold text-highlighted",
    description: "mt-1 text-base text-pretty text-muted",
    body: "gap-y-6 flex flex-col",
    providers: "space-y-3",
    checkbox: "",
    select: "w-full",
    password: "w-full",
    otp: "w-full",
    input: "w-full",
    separator: "",
    form: "space-y-5",
    footer: "text-sm text-center text-muted mt-2"
  }
};

const avatar = {
  slots: {
    root: "inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle bg-elevated",
    image: "h-full w-full rounded-[inherit] object-cover",
    fallback: "font-medium text-muted truncate",
    icon: "text-muted shrink-0"
  },
  variants: {
    size: {
      "3xs": {
        root: "size-4 text-[8px]"
      },
      "2xs": {
        root: "size-5 text-[10px]"
      },
      "xs": {
        root: "size-6 text-xs"
      },
      "sm": {
        root: "size-7 text-sm"
      },
      "md": {
        root: "size-8 text-base"
      },
      "lg": {
        root: "size-9 text-lg"
      },
      "xl": {
        root: "size-10 text-xl"
      },
      "2xl": {
        root: "size-11 text-[22px]"
      },
      "3xl": {
        root: "size-12 text-2xl"
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
};

const avatarGroup = {
  slots: {
    root: "inline-flex flex-row-reverse justify-end",
    base: "relative rounded-full ring-bg first:me-0"
  },
  variants: {
    size: {
      "3xs": {
        base: "ring -me-0.5"
      },
      "2xs": {
        base: "ring -me-0.5"
      },
      "xs": {
        base: "ring -me-0.5"
      },
      "sm": {
        base: "ring-2 -me-1.5"
      },
      "md": {
        base: "ring-2 -me-1.5"
      },
      "lg": {
        base: "ring-2 -me-1.5"
      },
      "xl": {
        base: "ring-3 -me-2"
      },
      "2xl": {
        base: "ring-3 -me-2"
      },
      "3xl": {
        base: "ring-3 -me-2"
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
};

const fieldGroupVariant = {
  fieldGroup: {
    horizontal: "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
    vertical: "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
  }
};
const fieldGroupVariantWithRoot = {
  fieldGroup: {
    horizontal: {
      root: "group has-focus-visible:z-[1]",
      base: "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none"
    },
    vertical: {
      root: "group has-focus-visible:z-[1]",
      base: "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none"
    }
  }
};
const fieldGroup$1 = {
  base: "relative",
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: ""
    },
    orientation: {
      horizontal: "inline-flex -space-x-px",
      vertical: "flex flex-col -space-y-px"
    }
  }
};

const badge$1 = (options) => ({
  slots: {
    base: "font-medium inline-flex items-center",
    label: "truncate",
    leadingIcon: "shrink-0",
    leadingAvatar: "shrink-0",
    leadingAvatarSize: "",
    trailingIcon: "shrink-0"
  },
  variants: {
    ...fieldGroupVariant,
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      solid: "",
      outline: "",
      soft: "",
      subtle: ""
    },
    size: {
      xs: {
        base: "text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm",
        leadingIcon: "size-3",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-3"
      },
      sm: {
        base: "text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm",
        leadingIcon: "size-3",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-3"
      },
      md: {
        base: "text-xs px-2 py-1 gap-1 rounded-md",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-4"
      },
      lg: {
        base: "text-sm px-2 py-1 gap-1.5 rounded-md",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-5"
      },
      xl: {
        base: "text-base px-2.5 py-1 gap-1.5 rounded-md",
        leadingIcon: "size-6",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-6"
      }
    },
    square: {
      true: ""
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: "solid",
    class: `bg-${color} text-inverted`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "outline",
    class: `text-${color} ring ring-inset ring-${color}/50`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "soft",
    class: `bg-${color}/10 text-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "subtle",
    class: `bg-${color}/10 text-${color} ring ring-inset ring-${color}/25`
  })), {
    color: "neutral",
    variant: "solid",
    class: "text-inverted bg-inverted"
  }, {
    color: "neutral",
    variant: "outline",
    class: "ring ring-inset ring-accented text-default bg-default"
  }, {
    color: "neutral",
    variant: "soft",
    class: "text-default bg-elevated"
  }, {
    color: "neutral",
    variant: "subtle",
    class: "ring ring-inset ring-accented text-default bg-elevated"
  }, {
    size: "xs",
    square: true,
    class: "p-0.5"
  }, {
    size: "sm",
    square: true,
    class: "p-1"
  }, {
    size: "md",
    square: true,
    class: "p-1"
  }, {
    size: "lg",
    square: true,
    class: "p-1"
  }, {
    size: "xl",
    square: true,
    class: "p-1"
  }],
  defaultVariants: {
    color: "primary",
    variant: "solid",
    size: "md"
  }
});

const banner = (options) => ({
  slots: {
    root: ["relative z-50 w-full", options.theme.transitions && "transition-colors"],
    container: "flex items-center justify-between gap-3 h-12",
    left: "hidden lg:flex-1 lg:flex lg:items-center",
    center: "flex items-center gap-1.5 min-w-0",
    right: "lg:flex-1 flex items-center justify-end",
    icon: "size-5 shrink-0 text-inverted pointer-events-none",
    title: "text-sm text-inverted font-medium truncate",
    actions: "flex gap-1.5 shrink-0 isolate",
    close: "text-inverted hover:bg-default/10 focus-visible:bg-default/10 -me-1.5 lg:me-0"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        root: `bg-${color}`
      }])),
      neutral: {
        root: "bg-inverted"
      }
    },
    to: {
      true: ""
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    to: true,
    class: {
      root: `hover:bg-${color}/90`
    }
  })), {
    color: "neutral",
    to: true,
    class: {
      root: "hover:bg-inverted/90"
    }
  }],
  defaultVariants: {
    color: "primary"
  }
});

const blogPost = (options) => ({
  slots: {
    root: "relative group/blog-post flex flex-col rounded-lg overflow-hidden",
    header: "relative overflow-hidden aspect-[16/9] w-full pointer-events-none",
    body: "min-w-0 flex-1 flex flex-col",
    footer: "",
    image: "object-cover object-top w-full h-full",
    title: "text-xl text-pretty font-semibold text-highlighted",
    description: "mt-1 text-base text-pretty",
    authors: "pt-4 mt-auto flex flex-wrap gap-x-3 gap-y-1.5",
    avatar: "",
    meta: "flex items-center gap-2 mb-2",
    date: "text-sm",
    badge: ""
  },
  variants: {
    orientation: {
      horizontal: {
        root: "lg:grid lg:grid-cols-2 lg:items-center gap-x-8",
        body: "justify-center p-4 sm:p-6 lg:px-0"
      },
      vertical: {
        root: "flex flex-col",
        body: "p-4 sm:p-6"
      }
    },
    variant: {
      outline: {
        root: "bg-default ring ring-default",
        date: "text-toned",
        description: "text-muted"
      },
      soft: {
        root: "bg-elevated/50",
        date: "text-muted",
        description: "text-toned"
      },
      subtle: {
        root: "bg-elevated/50 ring ring-default",
        date: "text-muted",
        description: "text-toned"
      },
      ghost: {
        date: "text-toned",
        description: "text-muted",
        header: "shadow-lg rounded-lg"
      },
      naked: {
        root: "p-0 sm:p-0",
        date: "text-toned",
        description: "text-muted",
        header: "shadow-lg rounded-lg"
      }
    },
    to: {
      true: {
        root: ["has-focus-visible:ring-2 has-focus-visible:ring-primary", options.theme.transitions && "transition"],
        image: "transform transition-transform duration-200 group-hover/blog-post:scale-110",
        avatar: "transform transition-transform duration-200 hover:scale-115 focus-visible:outline-primary"
      }
    },
    image: {
      true: ""
    }
  },
  compoundVariants: [{
    variant: "outline",
    to: true,
    class: {
      root: "hover:bg-elevated/50"
    }
  }, {
    variant: "soft",
    to: true,
    class: {
      root: "hover:bg-elevated"
    }
  }, {
    variant: "subtle",
    to: true,
    class: {
      root: "hover:bg-elevated hover:ring-accented"
    }
  }, {
    variant: "ghost",
    to: true,
    class: {
      root: "hover:bg-elevated/50",
      header: ["group-hover/blog-post:shadow-none", options.theme.transitions && "transition-all"]
    }
  }, {
    variant: "ghost",
    to: true,
    orientation: "vertical",
    class: {
      header: "group-hover/blog-post:rounded-b-none"
    }
  }, {
    variant: "ghost",
    to: true,
    orientation: "horizontal",
    class: {
      header: "group-hover/blog-post:rounded-r-none"
    }
  }, {
    orientation: "vertical",
    image: false,
    variant: "naked",
    class: {
      body: "p-0 sm:p-0"
    }
  }],
  defaultVariants: {
    variant: "outline"
  }
});

const blogPosts = {
  base: "flex flex-col gap-8 lg:gap-y-16",
  variants: {
    orientation: {
      horizontal: "sm:grid sm:grid-cols-2 lg:grid-cols-3",
      vertical: ""
    }
  }
};

const breadcrumb = (options) => ({
  slots: {
    root: "relative min-w-0",
    list: "flex items-center gap-1.5",
    item: "flex min-w-0",
    link: "group relative flex items-center gap-1.5 text-sm min-w-0 focus-visible:outline-primary",
    linkLeadingIcon: "shrink-0 size-5",
    linkLeadingAvatar: "shrink-0",
    linkLeadingAvatarSize: "2xs",
    linkLabel: "truncate",
    separator: "flex",
    separatorIcon: "shrink-0 size-5 text-muted"
  },
  variants: {
    active: {
      true: {
        link: "text-primary font-semibold"
      },
      false: {
        link: "text-muted font-medium"
      }
    },
    disabled: {
      true: {
        link: "cursor-not-allowed opacity-75"
      }
    },
    to: {
      true: ""
    }
  },
  compoundVariants: [{
    disabled: false,
    active: false,
    to: true,
    class: {
      link: ["hover:text-default", options.theme.transitions && "transition-colors"]
    }
  }]
});

const button = (options) => ({
  slots: {
    base: ["rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75", options.theme.transitions && "transition-colors"],
    label: "truncate",
    leadingIcon: "shrink-0",
    leadingAvatar: "shrink-0",
    leadingAvatarSize: "",
    trailingIcon: "shrink-0"
  },
  variants: {
    ...fieldGroupVariant,
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      solid: "",
      outline: "",
      soft: "",
      subtle: "",
      ghost: "",
      link: ""
    },
    size: {
      xs: {
        base: "px-2 py-1 text-xs gap-1",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-4"
      },
      sm: {
        base: "px-2.5 py-1.5 text-xs gap-1.5",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-4"
      },
      md: {
        base: "px-2.5 py-1.5 text-sm gap-1.5",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-5"
      },
      lg: {
        base: "px-3 py-2 text-sm gap-2",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-5"
      },
      xl: {
        base: "px-3 py-2 text-base gap-2",
        leadingIcon: "size-6",
        leadingAvatarSize: "xs",
        trailingIcon: "size-6"
      }
    },
    block: {
      true: {
        base: "w-full justify-center",
        trailingIcon: "ms-auto"
      }
    },
    square: {
      true: ""
    },
    leading: {
      true: ""
    },
    trailing: {
      true: ""
    },
    loading: {
      true: ""
    },
    active: {
      true: {
        base: ""
      },
      false: {
        base: ""
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: "solid",
    class: `text-inverted bg-${color} hover:bg-${color}/75 active:bg-${color}/75 disabled:bg-${color} aria-disabled:bg-${color} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "outline",
    class: `ring ring-inset ring-${color}/50 text-${color} hover:bg-${color}/10 active:bg-${color}/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "soft",
    class: `text-${color} bg-${color}/10 hover:bg-${color}/15 active:bg-${color}/15 focus:outline-none focus-visible:bg-${color}/15 disabled:bg-${color}/10 aria-disabled:bg-${color}/10`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "subtle",
    class: `text-${color} ring ring-inset ring-${color}/25 bg-${color}/10 hover:bg-${color}/15 active:bg-${color}/15 disabled:bg-${color}/10 aria-disabled:bg-${color}/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "ghost",
    class: `text-${color} hover:bg-${color}/10 active:bg-${color}/10 focus:outline-none focus-visible:bg-${color}/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "link",
    class: `text-${color} hover:text-${color}/75 active:text-${color}/75 disabled:text-${color} aria-disabled:text-${color} focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
  })), {
    color: "neutral",
    variant: "solid",
    class: "text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted"
  }, {
    color: "neutral",
    variant: "outline",
    class: "ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted"
  }, {
    color: "neutral",
    variant: "soft",
    class: "text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 focus:outline-none focus-visible:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated"
  }, {
    color: "neutral",
    variant: "subtle",
    class: "ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted"
  }, {
    color: "neutral",
    variant: "ghost",
    class: "text-default hover:bg-elevated active:bg-elevated focus:outline-none focus-visible:bg-elevated hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent"
  }, {
    color: "neutral",
    variant: "link",
    class: "text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-inverted"
  }, {
    size: "xs",
    square: true,
    class: "p-1"
  }, {
    size: "sm",
    square: true,
    class: "p-1.5"
  }, {
    size: "md",
    square: true,
    class: "p-1.5"
  }, {
    size: "lg",
    square: true,
    class: "p-2"
  }, {
    size: "xl",
    square: true,
    class: "p-2"
  }, {
    loading: true,
    leading: true,
    class: {
      leadingIcon: "animate-spin"
    }
  }, {
    loading: true,
    leading: false,
    trailing: true,
    class: {
      trailingIcon: "animate-spin"
    }
  }],
  defaultVariants: {
    color: "primary",
    variant: "solid",
    size: "md"
  }
});

const pickerTriggerVariants = ["solid", "outline", "soft", "subtle"];
const triggerSizeClasses = {
  day: {
    xs: "size-7",
    sm: "size-7",
    md: "size-8",
    lg: "size-9 text-md",
    xl: "size-10 text-lg"
  },
  picker: {
    xs: "h-7 px-2 text-xs",
    sm: "h-7 px-2 text-xs",
    md: "h-8 px-3 text-sm",
    lg: "h-9 px-4 text-md",
    xl: "h-10 px-5 text-lg"
  }
};
function getTriggerClass(color, variant, includeToday) {
  const today = includeToday ? ` data-today:not-data-[selected]:text-${color}` : "";
  switch (variant) {
    case "solid":
      return `data-[selected]:bg-${color} data-[selected]:text-inverted${today} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`;
    case "outline":
      return `data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-${color}/50 data-[selected]:text-${color}${today} data-[highlighted]:bg-${color}/10 hover:not-data-[selected]:bg-${color}/10`;
    case "soft":
      return `data-[selected]:bg-${color}/10 data-[selected]:text-${color}${today} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`;
    case "subtle":
      return `data-[selected]:bg-${color}/10 data-[selected]:text-${color} data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-${color}/25${today} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`;
  }
}
function getNeutralTriggerClass(variant, includeToday) {
  const today = includeToday ? " data-today:not-data-[selected]:text-highlighted" : "";
  switch (variant) {
    case "solid":
      return `data-[selected]:bg-inverted data-[selected]:text-inverted${today} data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10`;
    case "outline":
      return `data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-[selected]:text-default data-[selected]:bg-default${today} data-[highlighted]:bg-inverted/10 hover:not-data-[selected]:bg-inverted/10`;
    case "soft":
      return `data-[selected]:bg-elevated data-[selected]:text-default${today} data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10`;
    case "subtle":
      return `data-[selected]:bg-elevated data-[selected]:text-default data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented${today} data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10`;
  }
}
const calendar = (options) => ({
  slots: {
    root: "",
    header: "flex items-center justify-between",
    body: "flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0",
    heading: "mx-auto text-center font-medium",
    grid: "w-full select-none space-y-1 focus:outline-none",
    gridRow: "grid",
    gridWeekDaysRow: "mb-1 grid w-full grid-cols-7",
    gridBody: "grid",
    headCell: "rounded-md",
    headCellWeek: "rounded-md text-muted",
    cell: "relative text-center",
    cellTrigger: ["relative flex items-center justify-center whitespace-nowrap focus-visible:ring-2 focus:outline-none data-disabled:text-muted", options.theme.transitions && "transition"],
    cellWeek: "relative text-center text-muted"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        headCell: `text-${color}`,
        cellTrigger: `focus-visible:ring-${color}`
      }])),
      neutral: {
        headCell: "text-highlighted",
        cellTrigger: "focus-visible:ring-inverted"
      }
    },
    variant: {
      solid: "",
      outline: "",
      soft: "",
      subtle: ""
    },
    type: {
      day: {
        grid: "border-collapse",
        gridRow: "grid-cols-7 place-items-center",
        cellTrigger: "m-0.5 rounded-full data-unavailable:line-through data-unavailable:text-muted data-unavailable:pointer-events-none data-today:font-semibold data-[outside-view]:text-muted"
      },
      month: {
        gridRow: "grid-cols-4 gap-1",
        cellTrigger: "w-full rounded-md"
      },
      year: {
        gridRow: "grid-cols-4 gap-1",
        cellTrigger: "w-full rounded-md tabular-nums"
      }
    },
    size: {
      xs: {
        heading: "text-xs",
        cell: "text-xs",
        cellWeek: "text-xs",
        headCell: "text-[10px]",
        headCellWeek: "text-[10px]",
        body: "space-y-2 pt-2"
      },
      sm: {
        heading: "text-xs",
        headCell: "text-xs",
        headCellWeek: "text-xs",
        cellWeek: "text-xs",
        cell: "text-xs"
      },
      md: {
        heading: "text-sm",
        headCell: "text-xs",
        headCellWeek: "text-xs",
        cellWeek: "text-xs",
        cell: "text-sm"
      },
      lg: {
        heading: "text-md",
        headCell: "text-md",
        headCellWeek: "text-md"
      },
      xl: {
        heading: "text-lg",
        headCell: "text-lg",
        headCellWeek: "text-lg"
      }
    },
    weekNumbers: {
      true: ""
    }
  },
  compoundVariants: [
    ...Object.entries(triggerSizeClasses.day).map(([size, cellTrigger]) => ({
      size,
      type: "day",
      class: { cellTrigger }
    })),
    ...Object.entries(triggerSizeClasses.picker).map(([size, cellTrigger]) => ({
      size,
      type: ["month", "year"],
      class: { cellTrigger }
    })),
    {
      type: "day",
      weekNumbers: true,
      class: {
        gridRow: "grid-cols-8",
        gridWeekDaysRow: "grid-cols-8 [&>*:first-child]:col-start-2"
      }
    },
    ...(options.theme.colors || []).flatMap((color) => pickerTriggerVariants.map((variant) => ({
      color,
      variant,
      type: "day",
      class: {
        cellTrigger: getTriggerClass(color, variant, true)
      }
    }))),
    ...(options.theme.colors || []).flatMap((color) => pickerTriggerVariants.map((variant) => ({
      color,
      variant,
      type: ["month", "year"],
      class: {
        cellTrigger: getTriggerClass(color, variant, false)
      }
    }))),
    ...pickerTriggerVariants.map((variant) => ({
      color: "neutral",
      variant,
      type: "day",
      class: {
        cellTrigger: getNeutralTriggerClass(variant, true)
      }
    })),
    ...pickerTriggerVariants.map((variant) => ({
      color: "neutral",
      variant,
      type: ["month", "year"],
      class: {
        cellTrigger: getNeutralTriggerClass(variant, false)
      }
    }))
  ],
  defaultVariants: {
    size: "md",
    color: "primary",
    variant: "solid",
    type: "day"
  }
});

const card$1 = {
  slots: {
    root: "rounded-lg overflow-hidden",
    header: "p-4 sm:px-6",
    body: "p-4 sm:p-6",
    footer: "p-4 sm:px-6"
  },
  variants: {
    variant: {
      solid: {
        root: "bg-inverted text-inverted"
      },
      outline: {
        root: "bg-default ring ring-default divide-y divide-default"
      },
      soft: {
        root: "bg-elevated/50 divide-y divide-default"
      },
      subtle: {
        root: "bg-elevated/50 ring ring-default divide-y divide-default"
      }
    }
  },
  defaultVariants: {
    variant: "outline"
  }
};

const carousel = (options) => ({
  slots: {
    root: "relative focus:outline-none",
    viewport: "overflow-hidden",
    container: "flex items-start",
    item: "min-w-0 shrink-0 basis-full",
    controls: "",
    arrows: "",
    prev: "absolute rounded-full",
    next: "absolute rounded-full",
    dots: "absolute inset-x-0 -bottom-7 flex flex-wrap items-center justify-center gap-3",
    dot: ["cursor-pointer size-3 bg-accented rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary", options.theme.transitions && "transition"]
  },
  variants: {
    orientation: {
      vertical: {
        container: "flex-col -mt-4",
        item: "pt-4",
        prev: "top-4 sm:-top-12 left-1/2 -translate-x-1/2 rotate-90 rtl:-rotate-90",
        next: "bottom-4 sm:-bottom-12 left-1/2 -translate-x-1/2 rotate-90 rtl:-rotate-90"
      },
      horizontal: {
        container: "flex-row -ms-4",
        item: "ps-4",
        prev: "start-4 sm:-start-12 top-1/2 -translate-y-1/2",
        next: "end-4 sm:-end-12 top-1/2 -translate-y-1/2"
      }
    },
    active: {
      true: {
        dot: "data-[state=active]:bg-inverted"
      }
    }
  }
});

const changelogVersion = (options) => ({
  slots: {
    root: "relative",
    container: "flex flex-col mx-auto max-w-2xl",
    header: "",
    meta: "flex items-center gap-3 mb-2",
    date: "text-sm/6 text-toned truncate",
    badge: "",
    title: "relative text-xl text-pretty font-semibold text-highlighted",
    description: "text-base text-pretty text-muted mt-1",
    imageWrapper: "relative overflow-hidden rounded-lg aspect-[16/9] mt-5 group/changelog-version-image",
    image: "object-cover object-top w-full h-full",
    authors: "flex flex-wrap gap-x-4 gap-y-1.5",
    footer: "border-t border-default pt-5 flex items-center justify-between",
    indicator: "absolute start-0 top-0 w-32 hidden lg:flex items-center justify-end gap-3 min-w-0",
    dot: "size-4 rounded-full bg-default ring ring-default flex items-center justify-center my-1",
    dotInner: "size-2 rounded-full bg-primary"
  },
  variants: {
    body: {
      false: {
        footer: "mt-5"
      }
    },
    badge: {
      false: {
        meta: "lg:hidden"
      }
    },
    to: {
      true: {
        title: ["has-focus-visible:ring-2 has-focus-visible:ring-primary rounded-xs", options.theme.transitions && "transition"],
        image: "transform transition-transform duration-200 group-hover/changelog-version-image:scale-105 group-has-focus-visible/changelog-version-image:scale-105"
      }
    },
    hidden: {
      true: {
        date: "lg:hidden"
      }
    }
  }
});

const changelogVersions = {
  slots: {
    root: "relative",
    container: "flex flex-col gap-y-8 sm:gap-y-12 lg:gap-y-16",
    indicator: "absolute hidden lg:block overflow-hidden inset-y-3 start-32 h-full w-px bg-border -ms-[8.5px]",
    beam: "absolute start-0 top-0 w-full bg-primary will-change-[height]"
  }
};

const chatMessage = (options) => ({
  slots: {
    root: "group/message relative w-full",
    container: "relative flex items-start",
    leading: "inline-flex items-center justify-center min-h-6",
    leadingIcon: "shrink-0",
    leadingAvatar: "shrink-0",
    leadingAvatarSize: "",
    files: "flex items-center gap-1.5 mb-1.5",
    content: "relative text-pretty min-w-0 *:first:mt-0 *:last:mb-0",
    actions: ["opacity-0 group-hover/message:opacity-100 absolute bottom-0 flex items-center", options.theme.transitions && "transition-opacity"]
  },
  variants: {
    variant: {
      solid: {
        content: "bg-inverted text-inverted"
      },
      outline: {
        content: "bg-default ring ring-default"
      },
      soft: {
        content: "bg-elevated/50"
      },
      subtle: {
        content: "bg-elevated/50 ring ring-default"
      },
      naked: {
        content: ""
      }
    },
    side: {
      left: {},
      right: {
        container: "justify-end ms-auto max-w-[75%]",
        files: "justify-end"
      }
    },
    leading: {
      true: ""
    },
    actions: {
      true: ""
    },
    compact: {
      true: {
        root: "scroll-mt-3",
        container: "gap-1.5 pb-3",
        content: "space-y-2",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs"
      },
      false: {
        root: "scroll-mt-4 sm:scroll-mt-6",
        container: "gap-3 pb-8",
        content: "space-y-4",
        leadingIcon: "size-8",
        leadingAvatarSize: "md"
      }
    }
  },
  compoundVariants: [{
    compact: true,
    actions: true,
    class: {
      container: "pb-8"
    }
  }, {
    leading: true,
    compact: false,
    side: "left",
    class: {
      actions: "left-11"
    }
  }, {
    leading: true,
    compact: true,
    side: "left",
    class: {
      actions: "left-6.5"
    }
  }, {
    variant: ["solid", "outline", "soft", "subtle"],
    compact: false,
    class: {
      content: "px-4 py-3 rounded-lg min-h-12",
      leading: "mt-2"
    }
  }, {
    variant: ["solid", "outline", "soft", "subtle"],
    compact: true,
    class: {
      content: "px-2 py-1 rounded-lg min-h-8",
      leading: "mt-1"
    }
  }, {
    variant: "naked",
    side: "left",
    class: {
      content: "w-full"
    }
  }],
  defaultVariants: {
    variant: "naked"
  }
});

const chatMessages = {
  slots: {
    root: "w-full flex flex-col gap-1 flex-1 px-2.5 [&>article]:last-of-type:min-h-(--last-message-height)",
    indicator: "h-6 flex items-center gap-1 py-3 *:size-2 *:rounded-full *:bg-elevated [&>*:nth-child(1)]:animate-[bounce_1s_infinite] [&>*:nth-child(2)]:animate-[bounce_1s_0.15s_infinite] [&>*:nth-child(3)]:animate-[bounce_1s_0.3s_infinite]",
    viewport: "absolute inset-x-0 top-[86%] data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]",
    autoScroll: "rounded-full absolute right-1/2 translate-x-1/2 bottom-0"
  },
  variants: {
    compact: {
      true: "",
      false: ""
    }
  }
};

const chatPalette = {
  slots: {
    root: "relative flex-1 flex flex-col min-h-0 min-w-0",
    prompt: "px-0 rounded-t-none border-t border-default",
    close: "",
    content: "overflow-y-auto flex-1 flex flex-col py-3"
  }
};

const chatPrompt = {
  slots: {
    root: "relative flex flex-col items-stretch gap-2 px-2.5 py-2 w-full rounded-lg backdrop-blur",
    header: "flex items-center gap-1.5",
    body: "items-start",
    footer: "flex items-center justify-between gap-1.5",
    base: ""
  },
  variants: {
    variant: {
      outline: {
        root: "bg-default/75 ring ring-default"
      },
      soft: {
        root: "bg-elevated/50"
      },
      subtle: {
        root: "bg-elevated/50 ring ring-default"
      },
      naked: {
        root: ""
      }
    }
  },
  defaultVariants: {
    variant: "outline"
  }
};

const chatPromptSubmit = {
  slots: {
    base: ""
  }
};

const chatReasoning = (options) => ({
  slots: {
    root: "",
    trigger: ["group flex w-full items-center gap-1.5 text-muted text-sm disabled:cursor-default disabled:hover:text-muted hover:text-default focus-visible:outline-offset-2 focus-visible:outline-primary min-w-0", options.theme.transitions && "transition-colors"],
    leading: "relative size-4 shrink-0",
    leadingIcon: "size-4 shrink-0",
    chevronIcon: "size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200",
    label: "truncate",
    trailingIcon: "size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200",
    content: "data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden",
    body: "max-h-[200px] pt-2 overflow-y-auto text-sm text-dimmed whitespace-pre-wrap"
  },
  variants: {
    chevron: {
      leading: {
        leadingIcon: "group-hover:opacity-0"
      },
      trailing: ""
    },
    alone: {
      false: {
        leadingIcon: ["absolute inset-0 group-data-[state=open]:opacity-0", options.theme.transitions && "transition-opacity duration-200"],
        chevronIcon: ["absolute inset-0 opacity-0 group-hover:opacity-100 group-data-[state=open]:opacity-100", options.theme.transitions && "transition-[rotate,opacity] duration-200"]
      }
    }
  }
});

const chatShimmer = {
  base: "text-transparent bg-clip-text bg-no-repeat bg-size-[calc(200%+var(--spread)*2+2px)_100%,auto] bg-[image:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--ui-text-highlighted),#0000_calc(50%+var(--spread))),linear-gradient(var(--ui-text-muted),var(--ui-text-muted))] animate-[shimmer_var(--duration)_linear_infinite] rtl:animate-[shimmer-rtl_var(--duration)_linear_infinite] will-change-[background-position]"
};

const chatTool = (options) => ({
  slots: {
    root: "",
    trigger: ["group flex w-full items-center gap-1.5 text-muted text-sm disabled:cursor-default disabled:hover:text-muted hover:text-default focus-visible:outline-offset-2 focus-visible:outline-primary min-w-0", options.theme.transitions && "transition-colors"],
    leading: "relative size-4 shrink-0",
    leadingIcon: "size-4 shrink-0",
    chevronIcon: "size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200",
    label: "truncate",
    suffix: "text-dimmed ms-1",
    trailingIcon: "size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200",
    content: "data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden",
    body: "text-sm text-dimmed whitespace-pre-wrap"
  },
  variants: {
    variant: {
      inline: {
        body: "pt-2"
      },
      card: {
        root: "rounded-md ring ring-default overflow-hidden",
        trigger: "px-2 py-1",
        trailingIcon: "ms-auto",
        body: "border-t border-default p-2 max-h-[200px] overflow-y-auto"
      }
    },
    chevron: {
      leading: {
        leadingIcon: "group-hover:opacity-0"
      },
      trailing: ""
    },
    loading: {
      true: {
        leadingIcon: "animate-spin"
      }
    },
    alone: {
      false: {
        leadingIcon: ["absolute inset-0 group-data-[state=open]:opacity-0", options.theme.transitions && "transition-opacity duration-200"],
        chevronIcon: ["absolute inset-0 opacity-0 group-hover:opacity-100 group-data-[state=open]:opacity-100", options.theme.transitions && "transition-[rotate,opacity] duration-200"]
      }
    }
  },
  defaultVariants: {
    variant: "inline"
  }
});

const checkbox = (options) => ({
  slots: {
    root: "relative flex items-start",
    container: "flex items-center",
    base: "rounded-sm ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
    indicator: "flex items-center justify-center size-full text-inverted",
    icon: "shrink-0 size-full",
    wrapper: "w-full",
    label: "block font-medium text-default",
    description: "text-muted"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        base: `focus-visible:outline-${color}`,
        indicator: `bg-${color}`
      }])),
      neutral: {
        base: "focus-visible:outline-inverted",
        indicator: "bg-inverted"
      }
    },
    variant: {
      list: {
        root: ""
      },
      card: {
        root: "border border-muted rounded-lg"
      }
    },
    indicator: {
      start: {
        root: "flex-row",
        wrapper: "ms-2"
      },
      end: {
        root: "flex-row-reverse",
        wrapper: "me-2"
      },
      hidden: {
        base: "sr-only",
        wrapper: "text-center"
      }
    },
    size: {
      xs: {
        base: "size-3",
        container: "h-4",
        wrapper: "text-xs"
      },
      sm: {
        base: "size-3.5",
        container: "h-4",
        wrapper: "text-xs"
      },
      md: {
        base: "size-4",
        container: "h-5",
        wrapper: "text-sm"
      },
      lg: {
        base: "size-4.5",
        container: "h-5",
        wrapper: "text-sm"
      },
      xl: {
        base: "size-5",
        container: "h-6",
        wrapper: "text-base"
      }
    },
    required: {
      true: {
        label: "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    disabled: {
      true: {
        root: "opacity-75",
        base: "cursor-not-allowed",
        label: "cursor-not-allowed",
        description: "cursor-not-allowed"
      }
    },
    checked: {
      true: ""
    }
  },
  compoundVariants: [
    { size: "xs", variant: "card", class: { root: "p-2.5" } },
    { size: "sm", variant: "card", class: { root: "p-3" } },
    { size: "md", variant: "card", class: { root: "p-3.5" } },
    { size: "lg", variant: "card", class: { root: "p-4" } },
    { size: "xl", variant: "card", class: { root: "p-4.5" } },
    ...(options.theme.colors || []).map((color) => ({
      color,
      variant: "card",
      class: {
        root: `has-data-[state=checked]:border-${color}`
      }
    })),
    {
      color: "neutral",
      variant: "card",
      class: {
        root: "has-data-[state=checked]:border-inverted"
      }
    },
    {
      variant: "card",
      disabled: true,
      class: {
        root: "cursor-not-allowed"
      }
    }
  ],
  defaultVariants: {
    size: "md",
    color: "primary",
    variant: "list",
    indicator: "start"
  }
});

const checkboxGroup = (options) => ({
  slots: {
    root: "relative",
    fieldset: "flex gap-x-2",
    legend: "mb-1 block font-medium text-default",
    item: ""
  },
  variants: {
    orientation: {
      horizontal: {
        fieldset: "flex-row"
      },
      vertical: {
        fieldset: "flex-col"
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {}])),
      neutral: {}
    },
    variant: {
      list: {},
      card: {},
      table: {
        item: "border border-muted"
      }
    },
    size: {
      xs: {
        fieldset: "gap-y-0.5",
        legend: "text-xs"
      },
      sm: {
        fieldset: "gap-y-0.5",
        legend: "text-xs"
      },
      md: {
        fieldset: "gap-y-1",
        legend: "text-sm"
      },
      lg: {
        fieldset: "gap-y-1",
        legend: "text-sm"
      },
      xl: {
        fieldset: "gap-y-1.5",
        legend: "text-base"
      }
    },
    required: {
      true: {
        legend: "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    disabled: {
      true: {}
    }
  },
  compoundVariants: [
    { size: "xs", variant: "table", class: { item: "p-2.5" } },
    { size: "sm", variant: "table", class: { item: "p-3" } },
    { size: "md", variant: "table", class: { item: "p-3.5" } },
    { size: "lg", variant: "table", class: { item: "p-4" } },
    { size: "xl", variant: "table", class: { item: "p-4.5" } },
    {
      orientation: "horizontal",
      variant: "table",
      class: {
        item: "first-of-type:rounded-s-lg last-of-type:rounded-e-lg",
        fieldset: "gap-0 -space-x-px"
      }
    },
    {
      orientation: "vertical",
      variant: "table",
      class: {
        item: "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
        fieldset: "gap-0 -space-y-px"
      }
    },
    ...(options.theme.colors || []).map((color) => ({
      color,
      variant: "table",
      class: {
        item: `has-data-[state=checked]:bg-${color}/10 has-data-[state=checked]:border-${color}/50 has-data-[state=checked]:z-[1]`
      }
    })),
    {
      color: "neutral",
      variant: "table",
      class: {
        item: "has-data-[state=checked]:bg-elevated has-data-[state=checked]:border-inverted/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      variant: "table",
      disabled: true,
      class: {
        item: "cursor-not-allowed"
      }
    }
  ],
  defaultVariants: {
    size: "md",
    variant: "list",
    color: "primary"
  }
});

const chip = (options) => ({
  slots: {
    root: "relative inline-flex items-center justify-center shrink-0",
    base: "rounded-full ring ring-bg flex items-center justify-center text-inverted font-medium whitespace-nowrap"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, `bg-${color}`])),
      neutral: "bg-inverted"
    },
    size: {
      "3xs": "h-[4px] min-w-[4px] text-[4px]",
      "2xs": "h-[5px] min-w-[5px] text-[5px]",
      "xs": "h-[6px] min-w-[6px] text-[6px]",
      "sm": "h-[7px] min-w-[7px] text-[7px]",
      "md": "h-[8px] min-w-[8px] text-[8px]",
      "lg": "h-[9px] min-w-[9px] text-[9px]",
      "xl": "h-[10px] min-w-[10px] text-[10px]",
      "2xl": "h-[11px] min-w-[11px] text-[11px]",
      "3xl": "h-[12px] min-w-[12px] text-[12px]"
    },
    position: {
      "top-right": "top-0 right-0",
      "bottom-right": "bottom-0 right-0",
      "top-left": "top-0 left-0",
      "bottom-left": "bottom-0 left-0"
    },
    inset: {
      false: ""
    },
    standalone: {
      false: "absolute"
    }
  },
  compoundVariants: [{
    position: "top-right",
    inset: false,
    class: "-translate-y-1/2 translate-x-1/2 transform"
  }, {
    position: "bottom-right",
    inset: false,
    class: "translate-y-1/2 translate-x-1/2 transform"
  }, {
    position: "top-left",
    inset: false,
    class: "-translate-y-1/2 -translate-x-1/2 transform"
  }, {
    position: "bottom-left",
    inset: false,
    class: "translate-y-1/2 -translate-x-1/2 transform"
  }],
  defaultVariants: {
    size: "md",
    color: "primary",
    position: "top-right"
  }
});

const collapsible$1 = {
  slots: {
    root: "",
    content: "data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden"
  }
};

const colorPicker = {
  slots: {
    root: "data-[disabled]:opacity-75",
    picker: "flex gap-4",
    selector: "rounded-md touch-none",
    selectorBackground: "w-full h-full relative rounded-md",
    selectorThumb: "-translate-y-1/2 -translate-x-1/2 absolute size-4 ring-2 ring-white rounded-full cursor-pointer data-[disabled]:cursor-not-allowed",
    track: "w-[8px] relative rounded-md touch-none",
    trackThumb: "absolute transform -translate-y-1/2 -translate-x-[4px] rtl:translate-x-[4px] size-4 rounded-full ring-2 ring-white cursor-pointer data-[disabled]:cursor-not-allowed"
  },
  variants: {
    size: {
      xs: {
        selector: "w-38 h-38",
        track: "h-38"
      },
      sm: {
        selector: "w-40 h-40",
        track: "h-40"
      },
      md: {
        selector: "w-42 h-42",
        track: "h-42"
      },
      lg: {
        selector: "w-44 h-44",
        track: "h-44"
      },
      xl: {
        selector: "w-46 h-46",
        track: "h-46"
      }
    }
  },
  compoundVariants: [],
  defaultVariants: {
    size: "md"
  }
};

const commandPalette = (options) => ({
  slots: {
    root: "flex flex-col min-h-0 min-w-0 divide-y divide-default",
    input: "",
    close: "",
    back: "p-0",
    content: "relative overflow-hidden flex flex-col",
    footer: "p-1",
    viewport: "relative scroll-py-1 overflow-y-auto flex-1 focus:outline-none",
    group: "p-1 isolate",
    empty: "text-center text-muted",
    label: "font-semibold text-highlighted",
    item: "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
    itemLeadingIcon: "shrink-0",
    itemLeadingAvatar: "shrink-0",
    itemLeadingAvatarSize: "",
    itemLeadingChip: "shrink-0",
    itemLeadingChipSize: "",
    itemTrailing: "ms-auto inline-flex items-center",
    itemTrailingIcon: "shrink-0",
    itemTrailingHighlightedIcon: "shrink-0 text-dimmed hidden group-data-highlighted:inline-flex",
    itemTrailingKbds: "hidden lg:inline-flex items-center shrink-0",
    itemTrailingKbdsSize: "",
    itemWrapper: "flex-1 flex flex-col text-start min-w-0",
    itemLabel: "truncate space-x-1 text-dimmed",
    itemDescription: "truncate text-muted",
    itemLabelBase: "text-highlighted [&>mark]:text-inverted [&>mark]:bg-primary",
    itemLabelPrefix: "text-default",
    itemLabelSuffix: "text-dimmed [&>mark]:text-inverted [&>mark]:bg-primary"
  },
  variants: {
    virtualize: {
      true: {
        viewport: "p-1 isolate"
      },
      false: {
        viewport: "divide-y divide-default"
      }
    },
    size: {
      xs: {
        input: "[&>input]:h-10",
        empty: "py-3 text-xs",
        label: "p-1 text-[10px]/3 gap-1",
        item: "p-1 text-xs gap-1",
        itemLeadingIcon: "size-4",
        itemLeadingAvatarSize: "3xs",
        itemLeadingChip: "size-4",
        itemLeadingChipSize: "sm",
        itemTrailing: "gap-1",
        itemTrailingIcon: "size-4",
        itemTrailingHighlightedIcon: "size-4",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "sm"
      },
      sm: {
        input: "[&>input]:h-11",
        empty: "py-4 text-xs",
        label: "p-1.5 text-[10px]/3 gap-1.5",
        item: "p-1.5 text-xs gap-1.5",
        itemLeadingIcon: "size-4",
        itemLeadingAvatarSize: "3xs",
        itemLeadingChip: "size-4",
        itemLeadingChipSize: "sm",
        itemTrailing: "gap-1.5",
        itemTrailingIcon: "size-4",
        itemTrailingHighlightedIcon: "size-4",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "sm"
      },
      md: {
        input: "[&>input]:h-12",
        empty: "py-6 text-sm",
        label: "p-1.5 text-xs gap-1.5",
        item: "p-1.5 text-sm gap-1.5",
        itemLeadingIcon: "size-5",
        itemLeadingAvatarSize: "2xs",
        itemLeadingChip: "size-5",
        itemLeadingChipSize: "md",
        itemTrailing: "gap-1.5",
        itemTrailingIcon: "size-5",
        itemTrailingHighlightedIcon: "size-5",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "md"
      },
      lg: {
        input: "[&>input]:h-13",
        empty: "py-7 text-sm",
        label: "p-2 text-xs gap-2",
        item: "p-2 text-sm gap-2",
        itemLeadingIcon: "size-5",
        itemLeadingAvatarSize: "2xs",
        itemLeadingChip: "size-5",
        itemLeadingChipSize: "md",
        itemTrailing: "gap-2",
        itemTrailingIcon: "size-5",
        itemTrailingHighlightedIcon: "size-5",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "md"
      },
      xl: {
        input: "[&>input]:h-14",
        empty: "py-8 text-base",
        label: "p-2 text-sm gap-2",
        item: "p-2 text-base gap-2",
        itemLeadingIcon: "size-6",
        itemLeadingAvatarSize: "xs",
        itemLeadingChip: "size-6",
        itemLeadingChipSize: "lg",
        itemTrailing: "gap-2",
        itemTrailingIcon: "size-6",
        itemTrailingHighlightedIcon: "size-6",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "lg"
      }
    },
    active: {
      true: {
        item: "text-highlighted before:bg-elevated",
        itemLeadingIcon: "text-default"
      },
      false: {
        item: ["text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
        itemLeadingIcon: ["text-dimmed group-data-highlighted:not-group-data-disabled:text-default", options.theme.transitions && "transition-colors"]
      }
    },
    loading: {
      true: {
        itemLeadingIcon: "animate-spin"
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
});

const container = {
  base: "w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8"
};

const contextMenu = (options) => ({
  slots: {
    content: "min-w-32 bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-context-menu-content-transform-origin) flex flex-col",
    viewport: "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
    group: "p-1 isolate",
    label: "w-full flex items-center font-semibold text-highlighted",
    separator: "-mx-1 my-1 h-px bg-border",
    item: "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
    itemLeadingIcon: "shrink-0",
    itemLeadingAvatar: "shrink-0",
    itemLeadingAvatarSize: "",
    itemTrailing: "ms-auto inline-flex gap-1.5 items-center",
    itemTrailingIcon: "shrink-0",
    itemTrailingKbds: "hidden lg:inline-flex items-center shrink-0",
    itemTrailingKbdsSize: "",
    itemWrapper: "flex-1 flex flex-col text-start min-w-0",
    itemLabel: "truncate",
    itemDescription: "truncate text-muted",
    itemLabelExternalIcon: "inline-block size-3 align-top text-dimmed"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    active: {
      true: {
        item: "text-highlighted before:bg-elevated",
        itemLeadingIcon: "text-default"
      },
      false: {
        item: ["text-default data-highlighted:text-highlighted data-[state=open]:text-highlighted data-highlighted:before:bg-elevated/50 data-[state=open]:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
        itemLeadingIcon: ["text-dimmed group-data-highlighted:text-default group-data-[state=open]:text-default", options.theme.transitions && "transition-colors"]
      }
    },
    loading: {
      true: {
        itemLeadingIcon: "animate-spin"
      }
    },
    size: {
      xs: {
        label: "p-1 text-xs gap-1",
        item: "p-1 text-xs gap-1",
        itemLeadingIcon: "size-4",
        itemLeadingAvatarSize: "3xs",
        itemTrailingIcon: "size-4",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "sm"
      },
      sm: {
        label: "p-1.5 text-xs gap-1.5",
        item: "p-1.5 text-xs gap-1.5",
        itemLeadingIcon: "size-4",
        itemLeadingAvatarSize: "3xs",
        itemTrailingIcon: "size-4",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "sm"
      },
      md: {
        label: "p-1.5 text-sm gap-1.5",
        item: "p-1.5 text-sm gap-1.5",
        itemLeadingIcon: "size-5",
        itemLeadingAvatarSize: "2xs",
        itemTrailingIcon: "size-5",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "md"
      },
      lg: {
        label: "p-2 text-sm gap-2",
        item: "p-2 text-sm gap-2",
        itemLeadingIcon: "size-5",
        itemLeadingAvatarSize: "2xs",
        itemTrailingIcon: "size-5",
        itemTrailingKbds: "gap-1",
        itemTrailingKbdsSize: "md"
      },
      xl: {
        label: "p-2 text-base gap-2",
        item: "p-2 text-base gap-2",
        itemLeadingIcon: "size-6",
        itemLeadingAvatarSize: "xs",
        itemTrailingIcon: "size-6",
        itemTrailingKbds: "gap-1",
        itemTrailingKbdsSize: "lg"
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    active: false,
    class: {
      item: `text-${color} data-highlighted:text-${color} data-highlighted:before:bg-${color}/10 data-[state=open]:before:bg-${color}/10`,
      itemLeadingIcon: `text-${color}/75 group-data-highlighted:text-${color} group-data-[state=open]:text-${color}`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    active: true,
    class: {
      item: `text-${color} before:bg-${color}/10`,
      itemLeadingIcon: `text-${color}`
    }
  }))],
  defaultVariants: {
    size: "md"
  }
});

const dashboardGroup = {
  base: "fixed inset-0 flex overflow-hidden"
};

const dashboardNavbar = {
  slots: {
    root: "h-(--ui-header-height) shrink-0 flex items-center justify-between border-b border-default px-4 sm:px-6 gap-1.5",
    left: "flex items-center gap-1.5 min-w-0",
    icon: "shrink-0 size-5 self-center me-1.5",
    title: "flex items-center gap-1.5 font-semibold text-highlighted truncate",
    center: "hidden lg:flex",
    right: "flex items-center shrink-0 gap-1.5",
    toggle: ""
  },
  variants: {
    toggleSide: {
      left: {
        toggle: ""
      },
      right: {
        toggle: ""
      }
    }
  }
};

const dashboardPanel = {
  slots: {
    root: "relative flex flex-col min-w-0 min-h-svh lg:not-last:border-e lg:not-last:border-default shrink-0",
    body: "flex flex-col gap-4 sm:gap-6 flex-1 overflow-y-auto p-4 sm:p-6",
    handle: ""
  },
  variants: {
    size: {
      true: {
        root: "w-full lg:w-(--width)"
      },
      false: {
        root: "flex-1"
      }
    }
  }
};

const dashboardResizeHandle = {
  base: "hidden lg:block touch-none select-none cursor-ew-resize relative before:absolute before:inset-y-0 before:-left-1.5 before:-right-1.5 before:z-1"
};

const dashboardSearch = {
  slots: {
    modal: "",
    input: ""
  },
  variants: {
    fullscreen: {
      false: {
        modal: "sm:max-w-3xl h-full sm:h-[28rem]"
      }
    },
    size: {
      xs: {},
      sm: {},
      md: {},
      lg: {},
      xl: {}
    }
  },
  defaultVariants: {
    size: "md"
  }
};

const dashboardSearchButton = {
  slots: {
    base: "",
    label: "",
    trailing: "hidden lg:flex items-center gap-0.5 ms-auto"
  },
  variants: {
    collapsed: {
      true: {
        label: "hidden",
        trailing: "lg:hidden"
      }
    }
  }
};

const dashboardSidebar = {
  slots: {
    root: "relative hidden lg:flex flex-col min-h-svh min-w-16 w-(--width) shrink-0",
    header: "h-(--ui-header-height) shrink-0 flex items-center gap-1.5 px-4",
    body: "flex flex-col gap-4 flex-1 overflow-y-auto px-4 py-2",
    footer: "shrink-0 flex items-center gap-1.5 px-4 py-2",
    toggle: "",
    handle: "",
    content: "lg:hidden",
    overlay: "lg:hidden"
  },
  variants: {
    menu: {
      true: {
        header: "sm:px-6",
        body: "sm:px-6",
        footer: "sm:px-6"
      }
    },
    side: {
      left: {
        root: "border-e border-default"
      },
      right: {
        root: ""
      }
    },
    toggleSide: {
      left: {
        toggle: ""
      },
      right: {
        toggle: "ms-auto"
      }
    }
  }
};

const dashboardSidebarCollapse = {
  base: "hidden lg:flex",
  variants: {
    side: {
      left: "",
      right: ""
    }
  }
};

const dashboardSidebarToggle = {
  base: "lg:hidden",
  variants: {
    side: {
      left: "",
      right: ""
    }
  }
};

const dashboardToolbar = {
  slots: {
    root: "shrink-0 flex items-center justify-between border-b border-default px-4 sm:px-6 gap-1.5 overflow-x-auto min-h-[49px]",
    left: "flex items-center gap-1.5",
    right: "flex items-center gap-1.5"
  }
};

const drawer = (options) => ({
  slots: {
    overlay: "fixed inset-0 bg-elevated/75",
    content: "fixed bg-default ring ring-default flex focus:outline-none",
    handle: ["shrink-0 !bg-accented", options.theme.transitions && "transition-opacity"],
    container: "w-full flex flex-col gap-4 p-4 overflow-y-auto",
    header: "",
    title: "text-highlighted font-semibold",
    description: "mt-1 text-muted text-sm",
    body: "flex-1",
    footer: "flex flex-col gap-1.5"
  },
  variants: {
    direction: {
      top: {
        content: "mb-24 flex-col-reverse",
        handle: "mb-4"
      },
      right: {
        content: "flex-row",
        handle: "!ml-4"
      },
      bottom: {
        content: "mt-24 flex-col",
        handle: "mt-4"
      },
      left: {
        content: "flex-row-reverse",
        handle: "!mr-4"
      }
    },
    inset: {
      true: {
        content: "rounded-lg after:hidden overflow-hidden [--initial-transform:calc(100%+1.5rem)]"
      }
    },
    snapPoints: {
      true: ""
    }
  },
  compoundVariants: [
    {
      direction: ["top", "bottom"],
      class: {
        content: "h-auto max-h-[96%]",
        handle: "!w-12 !h-1.5 mx-auto"
      }
    },
    {
      direction: ["top", "bottom"],
      snapPoints: true,
      class: {
        content: "h-full"
      }
    },
    {
      direction: ["right", "left"],
      class: {
        content: "w-auto max-w-[calc(100%-2rem)]",
        handle: "!h-12 !w-1.5 mt-auto mb-auto"
      }
    },
    {
      direction: ["right", "left"],
      snapPoints: true,
      class: {
        content: "w-full"
      }
    },
    {
      direction: "top",
      inset: true,
      class: {
        content: "inset-x-4 top-4"
      }
    },
    {
      direction: "top",
      inset: false,
      class: {
        content: "inset-x-0 top-0 rounded-b-lg"
      }
    },
    {
      direction: "bottom",
      inset: true,
      class: {
        content: "inset-x-4 bottom-4"
      }
    },
    {
      direction: "bottom",
      inset: false,
      class: {
        content: "inset-x-0 bottom-0 rounded-t-lg"
      }
    },
    {
      direction: "left",
      inset: true,
      class: {
        content: "inset-y-4 left-4"
      }
    },
    {
      direction: "left",
      inset: false,
      class: {
        content: "inset-y-0 left-0 rounded-r-lg"
      }
    },
    {
      direction: "right",
      inset: true,
      class: {
        content: "inset-y-4 right-4"
      }
    },
    {
      direction: "right",
      inset: false,
      class: {
        content: "inset-y-0 right-0 rounded-l-lg"
      }
    }
  ]
});

const dropdownMenu = (options) => ({
  slots: {
    content: "min-w-32 bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-dropdown-menu-content-transform-origin) flex flex-col",
    input: "border-b border-default",
    empty: "text-center text-muted",
    viewport: "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
    arrow: "fill-bg stroke-default",
    group: "p-1 isolate",
    label: "w-full flex items-center font-semibold text-highlighted",
    separator: "-mx-1 my-1 h-px bg-border",
    item: "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
    itemLeadingIcon: "shrink-0",
    itemLeadingAvatar: "shrink-0",
    itemLeadingAvatarSize: "",
    itemTrailing: "ms-auto inline-flex gap-1.5 items-center",
    itemTrailingIcon: "shrink-0",
    itemTrailingKbds: "hidden lg:inline-flex items-center shrink-0",
    itemTrailingKbdsSize: "",
    itemWrapper: "flex-1 flex flex-col text-start min-w-0",
    itemLabel: "truncate",
    itemDescription: "truncate text-muted",
    itemLabelExternalIcon: "inline-block size-3 align-top text-dimmed"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    active: {
      true: {
        item: "text-highlighted before:bg-elevated",
        itemLeadingIcon: "text-default"
      },
      false: {
        item: ["text-default data-highlighted:text-highlighted data-[state=open]:text-highlighted data-highlighted:before:bg-elevated/50 data-[state=open]:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
        itemLeadingIcon: ["text-dimmed group-data-highlighted:text-default group-data-[state=open]:text-default", options.theme.transitions && "transition-colors"]
      }
    },
    loading: {
      true: {
        itemLeadingIcon: "animate-spin"
      }
    },
    size: {
      xs: {
        label: "p-1 text-xs gap-1",
        item: "p-1 text-xs gap-1",
        empty: "p-2 text-xs",
        itemLeadingIcon: "size-4",
        itemLeadingAvatarSize: "3xs",
        itemTrailingIcon: "size-4",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "sm"
      },
      sm: {
        label: "p-1.5 text-xs gap-1.5",
        item: "p-1.5 text-xs gap-1.5",
        empty: "p-2.5 text-xs",
        itemLeadingIcon: "size-4",
        itemLeadingAvatarSize: "3xs",
        itemTrailingIcon: "size-4",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "sm"
      },
      md: {
        label: "p-1.5 text-sm gap-1.5",
        item: "p-1.5 text-sm gap-1.5",
        empty: "p-2.5 text-sm",
        itemLeadingIcon: "size-5",
        itemLeadingAvatarSize: "2xs",
        itemTrailingIcon: "size-5",
        itemTrailingKbds: "gap-0.5",
        itemTrailingKbdsSize: "md"
      },
      lg: {
        label: "p-2 text-sm gap-2",
        item: "p-2 text-sm gap-2",
        empty: "p-3 text-sm",
        itemLeadingIcon: "size-5",
        itemLeadingAvatarSize: "2xs",
        itemTrailingIcon: "size-5",
        itemTrailingKbds: "gap-1",
        itemTrailingKbdsSize: "md"
      },
      xl: {
        label: "p-2 text-base gap-2",
        item: "p-2 text-base gap-2",
        empty: "p-3 text-base",
        itemLeadingIcon: "size-6",
        itemLeadingAvatarSize: "xs",
        itemTrailingIcon: "size-6",
        itemTrailingKbds: "gap-1",
        itemTrailingKbdsSize: "lg"
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    active: false,
    class: {
      item: `text-${color} data-highlighted:text-${color} data-highlighted:before:bg-${color}/10 data-[state=open]:before:bg-${color}/10`,
      itemLeadingIcon: `text-${color}/75 group-data-highlighted:text-${color} group-data-[state=open]:text-${color}`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    active: true,
    class: {
      item: `text-${color} before:bg-${color}/10`,
      itemLeadingIcon: `text-${color}`
    }
  }))],
  defaultVariants: {
    size: "md"
  }
});

const editor = (options) => ({
  slots: {
    root: "",
    content: "relative size-full flex-1",
    base: [
      "w-full outline-none *:my-5 *:first:mt-0 *:last:mb-0 sm:px-8 selection:bg-primary/20",
      // Paragraph
      "[&_p]:leading-7",
      // Links
      "[&_a]:text-primary [&_a]:border-b [&_a]:border-transparent [&_a]:hover:border-primary [&_a]:font-medium",
      options.theme?.transitions && "[&_a]:transition-colors",
      // Code inside links
      "[&_a>code]:border-dashed [&_a:hover>code]:border-primary [&_a:hover>code]:text-primary",
      options.theme?.transitions && "[&_a>code]:transition-colors",
      // Mentions
      "[&_.mention]:text-primary [&_.mention]:font-medium",
      // Headings - shared styles
      "[&_:is(h1,h2,h3,h4,h5,h6)]:text-highlighted [&_:is(h1,h2,h3,h4,h5,h6)]:font-bold",
      // Headings - unique styles
      "[&_h1]:text-3xl",
      "[&_h2]:text-2xl",
      "[&_h3]:text-xl",
      "[&_h4]:text-lg",
      "[&_h5]:text-base",
      "[&_h6]:text-base",
      // Code inside headings
      "[&_:is(h1,h2,h3,h4,h5,h6)>code]:border-dashed [&_:is(h1,h2,h3,h4,h5,h6)>code]:font-bold",
      "[&_h2>code]:text-xl/6",
      "[&_h3>code]:text-lg/5",
      // Blockquote & HR
      "[&_blockquote]:border-s-4 [&_blockquote]:border-accented [&_blockquote]:ps-4 [&_blockquote]:italic",
      "[&_[data-type=horizontalRule]]:my-8 [&_[data-type=horizontalRule]]:py-2",
      "[&_hr]:border-t [&_hr]:border-default",
      // Code blocks
      "[&_pre]:text-sm/6 [&_pre]:border [&_pre]:border-muted [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:px-4 [&_pre]:py-3 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-auto",
      "[&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:font-inherit [&_pre_code]:rounded-none [&_pre_code]:inline [&_pre_code]:border-0 [&_pre_code]:bg-transparent",
      // Inline code
      "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:font-medium [&_code]:rounded-md [&_code]:inline-block [&_code]:border [&_code]:border-muted [&_code]:text-highlighted [&_code]:bg-muted",
      // Lists
      "[&_:is(ul,ol)]:ps-6",
      "[&_ul]:list-disc [&_ul]:marker:text-(--ui-border-accented)",
      "[&_ol]:list-decimal [&_ol]:marker:text-muted",
      "[&_li]:my-1.5 [&_li]:ps-1.5",
      // Images
      "[&_img]:rounded-md [&_img]:block [&_img]:max-w-full [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-primary",
      // Selected nodes
      "[&_.ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper])]:bg-primary/20"
    ]
  },
  variants: {
    placeholderMode: {
      firstLine: {
        base: "[&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:text-dimmed [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:float-start [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:h-0 [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:pointer-events-none"
      },
      everyLine: {
        base: "[&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:content-[attr(data-placeholder)] [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:text-dimmed [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:float-start [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:h-0 [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:pointer-events-none"
      }
    }
  },
  defaultVariants: {
    placeholderMode: "everyLine"
  }
});

const editorDragHandle = {
  slots: {
    root: "hidden sm:flex items-center justify-center transition-all duration-200 ease-out",
    handle: "cursor-grab px-1"
  }
};

const editorSuggestionMenu = (options) => ({
  slots: {
    content: "min-w-48 max-w-60 max-h-96 bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-dropdown-menu-content-transform-origin) flex flex-col",
    viewport: "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
    group: "p-1 isolate",
    label: "w-full flex items-center font-semibold text-highlighted",
    separator: "-mx-1 my-1 h-px bg-border",
    item: "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
    itemLeadingIcon: "shrink-0 flex items-center justify-center",
    itemLeadingAvatar: "shrink-0",
    itemLeadingAvatarSize: "",
    itemWrapper: "flex-1 flex flex-col text-start min-w-0",
    itemLabel: "truncate",
    itemDescription: "truncate text-muted",
    itemLabelExternalIcon: "inline-block size-3 align-top text-dimmed"
  },
  variants: {
    size: {
      xs: {
        label: "p-1 text-[10px]/3 gap-1",
        item: "p-1 text-xs gap-1",
        itemLeadingIcon: "size-4 text-sm",
        itemLeadingAvatarSize: "3xs"
      },
      sm: {
        label: "p-1.5 text-[10px]/3 gap-1.5",
        item: "p-1.5 text-xs gap-1.5",
        itemLeadingIcon: "size-4 text-sm",
        itemLeadingAvatarSize: "3xs"
      },
      md: {
        label: "p-1.5 text-xs gap-1.5",
        item: "p-1.5 text-sm gap-1.5",
        itemLeadingIcon: "size-5 text-base",
        itemLeadingAvatarSize: "2xs"
      },
      lg: {
        label: "p-2 text-xs gap-2",
        item: "p-2 text-sm gap-2",
        itemLeadingIcon: "size-5 text-base",
        itemLeadingAvatarSize: "2xs"
      },
      xl: {
        label: "p-2 text-sm gap-2",
        item: "p-2 text-base gap-2",
        itemLeadingIcon: "size-6 text-xl",
        itemLeadingAvatarSize: "xs"
      }
    },
    active: {
      true: {
        item: "text-highlighted before:bg-elevated/75",
        itemLeadingIcon: "text-default"
      },
      false: {
        item: ["text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
        itemLeadingIcon: ["text-dimmed group-data-highlighted:not-group-data-disabled:text-default", options.theme.transitions && "transition-colors"]
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
});

const editorEmojiMenu = (options) => editorSuggestionMenu(options);

const editorMentionMenu = (options) => editorSuggestionMenu(options);

const editorToolbar = {
  slots: {
    root: "focus:outline-none",
    base: "flex items-stretch gap-1.5",
    group: "flex items-center gap-0.5",
    separator: "w-px self-stretch bg-border"
  },
  variants: {
    layout: {
      bubble: {
        base: "bg-default border border-default rounded-lg p-1"
      },
      floating: {
        base: "bg-default border border-default rounded-lg p-1"
      },
      fixed: {
        base: ""
      }
    }
  }
};

const empty = {
  slots: {
    root: "relative flex flex-col items-center justify-center gap-4 rounded-lg p-4 sm:p-6 lg:p-8 min-w-0",
    header: "flex flex-col items-center gap-2 max-w-sm text-center",
    avatar: "shrink-0 mb-2",
    title: "text-highlighted text-pretty font-medium",
    description: "text-balance text-center",
    body: "flex flex-col items-center gap-4 max-w-sm",
    actions: "flex flex-wrap justify-center gap-2 shrink-0",
    footer: "flex flex-col items-center gap-2 max-w-sm"
  },
  variants: {
    size: {
      xs: {
        avatar: "size-8 text-base",
        title: "text-sm",
        description: "text-xs"
      },
      sm: {
        avatar: "size-9 text-lg",
        title: "text-sm",
        description: "text-xs"
      },
      md: {
        avatar: "size-10 text-xl",
        title: "text-base",
        description: "text-sm"
      },
      lg: {
        avatar: "size-11 text-[22px]",
        title: "text-base",
        description: "text-sm"
      },
      xl: {
        avatar: "size-12 text-2xl",
        title: "text-lg",
        description: "text-base"
      }
    },
    variant: {
      solid: {
        root: "bg-inverted",
        title: "text-inverted",
        description: "text-dimmed"
      },
      outline: {
        root: "bg-default ring ring-default",
        description: "text-muted"
      },
      soft: {
        root: "bg-elevated/50",
        description: "text-toned"
      },
      subtle: {
        root: "bg-elevated/50 ring ring-default",
        description: "text-toned"
      },
      naked: {
        description: "text-muted"
      }
    }
  },
  defaultVariants: {
    variant: "outline",
    size: "md"
  }
};

const error = {
  slots: {
    root: "min-h-[calc(100vh-var(--ui-header-height))] flex flex-col items-center justify-center text-center",
    statusCode: "text-base font-semibold text-primary",
    statusMessage: "mt-2 text-4xl sm:text-5xl font-bold text-highlighted text-balance",
    message: "mt-4 text-lg text-muted text-balance",
    links: "mt-8 flex items-center justify-center gap-6"
  }
};

const fileUpload = (options) => ({
  slots: {
    root: "relative flex flex-col",
    base: ["w-full flex-1 bg-default border border-default flex flex-col gap-2 items-stretch justify-center rounded-lg focus-visible:outline-2", options.theme.transitions && "transition-[background]"],
    wrapper: "flex flex-col items-center justify-center text-center",
    icon: "shrink-0",
    avatar: "shrink-0",
    label: "font-medium text-default mt-2",
    description: "text-muted mt-1",
    actions: "flex flex-wrap gap-1.5 shrink-0 mt-4",
    files: "",
    file: "relative",
    fileLeadingAvatar: "shrink-0",
    fileWrapper: "flex flex-col min-w-0",
    fileName: "text-default truncate",
    fileSize: "text-muted truncate",
    fileTrailingButton: ""
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      area: {
        wrapper: "px-4 py-3",
        base: "p-4"
      },
      button: {}
    },
    size: {
      xs: {
        base: "text-xs",
        icon: "size-4",
        file: "text-xs px-2 py-1 gap-1",
        fileWrapper: "flex-row gap-1"
      },
      sm: {
        base: "text-xs",
        icon: "size-4",
        file: "text-xs px-2.5 py-1.5 gap-1.5",
        fileWrapper: "flex-row gap-1"
      },
      md: {
        base: "text-sm",
        icon: "size-5",
        file: "text-xs px-2.5 py-1.5 gap-1.5"
      },
      lg: {
        base: "text-sm",
        icon: "size-5",
        file: "text-sm px-3 py-2 gap-2",
        fileSize: "text-xs"
      },
      xl: {
        base: "text-base",
        icon: "size-6",
        file: "text-sm px-3 py-2 gap-2"
      }
    },
    layout: {
      list: {
        root: "gap-2 items-start",
        files: "flex flex-col w-full gap-2",
        file: "min-w-0 flex items-center border border-default rounded-md w-full",
        fileTrailingButton: "ms-auto"
      },
      grid: {
        fileWrapper: "hidden",
        fileLeadingAvatar: "size-full rounded-lg",
        fileTrailingButton: "absolute -top-1.5 -end-1.5 p-0 rounded-full border-2 border-bg"
      }
    },
    position: {
      inside: "",
      outside: ""
    },
    dropzone: {
      true: "border-dashed data-[dragging=true]:bg-elevated/25"
    },
    interactive: {
      true: ""
    },
    highlight: {
      true: ""
    },
    multiple: {
      true: ""
    },
    disabled: {
      true: "cursor-not-allowed opacity-75"
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    class: `focus-visible:outline-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    highlight: true,
    class: `border-${color}`
  })), {
    color: "neutral",
    class: "focus-visible:outline-inverted"
  }, {
    color: "neutral",
    highlight: true,
    class: "border-inverted"
  }, {
    size: "xs",
    layout: "list",
    class: {
      fileTrailingButton: "-me-1"
    }
  }, {
    size: "sm",
    layout: "list",
    class: {
      fileTrailingButton: "-me-1.5"
    }
  }, {
    size: "md",
    layout: "list",
    class: {
      fileTrailingButton: "-me-1.5"
    }
  }, {
    size: "lg",
    layout: "list",
    class: {
      fileTrailingButton: "-me-2"
    }
  }, {
    size: "xl",
    layout: "list",
    class: {
      fileTrailingButton: "-me-2"
    }
  }, {
    variant: "button",
    size: "xs",
    class: {
      base: "p-1"
    }
  }, {
    variant: "button",
    size: "sm",
    class: {
      base: "p-1.5"
    }
  }, {
    variant: "button",
    size: "md",
    class: {
      base: "p-1.5"
    }
  }, {
    variant: "button",
    size: "lg",
    class: {
      base: "p-2"
    }
  }, {
    variant: "button",
    size: "xl",
    class: {
      base: "p-2"
    }
  }, {
    layout: "grid",
    multiple: true,
    class: {
      files: "grid grid-cols-2 md:grid-cols-3 gap-4 w-full",
      file: "p-0 aspect-square"
    }
  }, {
    layout: "grid",
    multiple: false,
    class: {
      file: "absolute inset-0 p-0"
    }
  }, {
    interactive: true,
    disabled: false,
    class: "hover:bg-elevated/25"
  }],
  defaultVariants: {
    color: "primary",
    variant: "area",
    size: "md"
  }
});

const footer = {
  slots: {
    root: "",
    top: "py-8 lg:py-12",
    bottom: "py-8 lg:py-12",
    container: "py-8 lg:py-4 lg:flex lg:items-center lg:justify-between lg:gap-x-3",
    left: "flex items-center justify-center lg:justify-start lg:flex-1 gap-x-1.5 mt-3 lg:mt-0 lg:order-1",
    center: "mt-3 lg:mt-0 lg:order-2 flex items-center justify-center",
    right: "lg:flex-1 flex items-center justify-center lg:justify-end gap-x-1.5 lg:order-3"
  }
};

const footerColumns = (options) => ({
  slots: {
    root: "xl:grid xl:grid-cols-3 xl:gap-8",
    left: "mb-10 xl:mb-0",
    center: "flex flex-col lg:grid grid-flow-col auto-cols-fr gap-8 xl:col-span-2",
    right: "mt-10 xl:mt-0",
    label: "text-sm font-semibold",
    list: "mt-6 space-y-4",
    item: "relative",
    link: "group text-sm flex items-center gap-1.5 focus-visible:outline-primary",
    linkLeadingIcon: "size-5 shrink-0",
    linkLabel: "truncate",
    linkLabelExternalIcon: "size-3 absolute top-0 text-dimmed inline-block"
  },
  variants: {
    active: {
      true: {
        link: "text-primary font-medium"
      },
      false: {
        link: ["text-muted hover:text-default", options.theme.transitions && "transition-colors"]
      }
    }
  }
});

const form = {
  base: ""
};

const formField = {
  slots: {
    root: "",
    wrapper: "",
    labelWrapper: "flex content-center items-center justify-between gap-1",
    label: "block font-medium text-default",
    container: "relative",
    description: "text-muted",
    error: "mt-2 text-error",
    hint: "text-muted",
    help: "mt-2 text-muted"
  },
  variants: {
    size: {
      xs: { root: "text-xs" },
      sm: { root: "text-xs" },
      md: { root: "text-sm" },
      lg: { root: "text-sm" },
      xl: { root: "text-base" }
    },
    required: {
      true: {
        label: `after:content-['*'] after:ms-0.5 after:text-error`
      }
    },
    orientation: {
      vertical: {
        container: "mt-1"
      },
      horizontal: {
        root: "flex justify-between place-items-baseline gap-2"
      }
    }
  },
  defaultVariants: {
    size: "md",
    orientation: "vertical"
  }
};

const header = {
  slots: {
    root: "bg-default/75 backdrop-blur border-b border-default h-(--ui-header-height) sticky top-0 z-50",
    container: "flex items-center justify-between gap-3 h-full",
    left: "lg:flex-1 flex items-center gap-1.5",
    center: "hidden lg:flex",
    right: "flex items-center justify-end lg:flex-1 gap-1.5",
    title: "shrink-0 font-bold text-xl text-highlighted flex items-end gap-1.5",
    toggle: "lg:hidden",
    content: "lg:hidden",
    overlay: "lg:hidden",
    header: "px-4 sm:px-6 h-(--ui-header-height) shrink-0 flex items-center justify-between gap-3",
    body: "p-4 sm:p-6 overflow-y-auto"
  },
  variants: {
    toggleSide: {
      left: {
        toggle: "-ms-1.5"
      },
      right: {
        toggle: "-me-1.5"
      }
    }
  }
};

const input = (options) => ({
  slots: {
    root: "relative inline-flex items-center",
    base: ["w-full rounded-md border-0 appearance-none placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75", options.theme.transitions && "transition-colors"],
    leading: "absolute inset-y-0 start-0 flex items-center",
    leadingIcon: "shrink-0 text-dimmed",
    leadingAvatar: "shrink-0",
    leadingAvatarSize: "",
    trailing: "absolute inset-y-0 end-0 flex items-center",
    trailingIcon: "shrink-0 text-dimmed"
  },
  variants: {
    ...fieldGroupVariantWithRoot,
    size: {
      xs: {
        base: "px-2 py-1 text-sm/4 gap-1",
        leading: "ps-2",
        trailing: "pe-2",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-4"
      },
      sm: {
        base: "px-2.5 py-1.5 text-sm/4 gap-1.5",
        leading: "ps-2.5",
        trailing: "pe-2.5",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs",
        trailingIcon: "size-4"
      },
      md: {
        base: "px-2.5 py-1.5 text-base/5 gap-1.5",
        leading: "ps-2.5",
        trailing: "pe-2.5",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-5"
      },
      lg: {
        base: "px-3 py-2 text-base/5 gap-2",
        leading: "ps-3",
        trailing: "pe-3",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs",
        trailingIcon: "size-5"
      },
      xl: {
        base: "px-3 py-2 text-base gap-2",
        leading: "ps-3",
        trailing: "pe-3",
        leadingIcon: "size-6",
        leadingAvatarSize: "xs",
        trailingIcon: "size-6"
      }
    },
    variant: {
      outline: "text-highlighted bg-default ring ring-inset ring-accented",
      soft: "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      subtle: "text-highlighted bg-elevated ring ring-inset ring-accented",
      ghost: "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      none: "text-highlighted bg-transparent"
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    leading: {
      true: ""
    },
    trailing: {
      true: ""
    },
    loading: {
      true: ""
    },
    highlight: {
      true: ""
    },
    fixed: {
      false: ""
    },
    type: {
      file: "file:me-1.5 file:font-medium file:text-muted file:outline-none"
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: ["outline", "subtle"],
    class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-${color}`
  })), {
    color: "neutral",
    variant: ["outline", "subtle"],
    class: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
  }, {
    color: "neutral",
    highlight: true,
    class: "ring ring-inset ring-inverted"
  }, {
    leading: true,
    size: "xs",
    class: "ps-7"
  }, {
    leading: true,
    size: "sm",
    class: "ps-8"
  }, {
    leading: true,
    size: "md",
    class: "ps-9"
  }, {
    leading: true,
    size: "lg",
    class: "ps-10"
  }, {
    leading: true,
    size: "xl",
    class: "ps-11"
  }, {
    trailing: true,
    size: "xs",
    class: "pe-7"
  }, {
    trailing: true,
    size: "sm",
    class: "pe-8"
  }, {
    trailing: true,
    size: "md",
    class: "pe-9"
  }, {
    trailing: true,
    size: "lg",
    class: "pe-10"
  }, {
    trailing: true,
    size: "xl",
    class: "pe-11"
  }, {
    loading: true,
    leading: true,
    class: {
      leadingIcon: "animate-spin"
    }
  }, {
    loading: true,
    leading: false,
    trailing: true,
    class: {
      trailingIcon: "animate-spin"
    }
  }, {
    fixed: false,
    size: "xs",
    class: "md:text-xs"
  }, {
    fixed: false,
    size: "sm",
    class: "md:text-xs"
  }, {
    fixed: false,
    size: "md",
    class: "md:text-sm"
  }, {
    fixed: false,
    size: "lg",
    class: "md:text-sm"
  }],
  defaultVariants: {
    size: "md",
    color: "primary",
    variant: "outline"
  }
});

const inputDate = (options) => {
  return defuFn({
    slots: {
      root: () => void 0,
      base: () => ["group relative inline-flex items-center rounded-md select-none", options.theme.transitions && "transition-colors"],
      segment: ["rounded text-center outline-hidden data-placeholder:text-dimmed data-[segment=literal]:text-muted data-invalid:text-error data-disabled:cursor-not-allowed data-disabled:opacity-75", options.theme.transitions && "transition-colors"],
      separatorIcon: "shrink-0 size-4 text-muted"
    },
    variants: {
      ...fieldGroupVariant,
      size: {
        xs: {
          base: (prev) => [prev, "gap-0.25"],
          segment: "data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-10"
        },
        sm: {
          base: (prev) => [prev, "gap-0.5"],
          segment: "data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-10"
        },
        md: {
          base: (prev) => [prev, "gap-0.5"],
          segment: "data-[segment=day]:w-9 data-[segment=month]:w-9 data-[segment=year]:w-11"
        },
        lg: {
          base: (prev) => [prev, "gap-0.75"],
          segment: "data-[segment=day]:w-9 data-[segment=month]:w-9 data-[segment=year]:w-11"
        },
        xl: {
          base: (prev) => [prev, "gap-0.75"],
          segment: "data-[segment=day]:w-10 data-[segment=month]:w-10 data-[segment=year]:w-12"
        }
      }
    },
    compoundVariants: [{
      variant: "outline",
      class: {
        segment: "focus:bg-elevated"
      }
    }, {
      variant: "soft",
      class: {
        segment: "focus:bg-accented/50 group-hover:focus:bg-accented"
      }
    }, {
      variant: "subtle",
      class: {
        segment: "focus:bg-accented"
      }
    }, {
      variant: "ghost",
      class: {
        segment: "focus:bg-elevated group-hover:focus:bg-accented"
      }
    }, {
      variant: "none",
      class: {
        segment: "focus:bg-elevated"
      }
    }]
  }, input(options));
};

const inputMenu = (options) => {
  return defuFn({
    slots: {
      base: () => ["rounded-md", options.theme.transitions && "transition-colors"],
      trailing: "group absolute inset-y-0 end-0 flex items-center disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none",
      trailingClear: "p-0",
      arrow: "fill-bg stroke-default",
      content: "max-h-60 w-(--reka-combobox-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-combobox-content-transform-origin) pointer-events-auto flex flex-col",
      viewport: "relative scroll-py-1 overflow-y-auto flex-1",
      group: "p-1 isolate",
      empty: "text-center text-muted",
      label: "font-semibold text-highlighted",
      separator: "-mx-1 my-1 h-px bg-border",
      item: ["group relative w-full flex items-start gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
      itemLeadingIcon: ["shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default", options.theme.transitions && "transition-colors"],
      itemLeadingAvatar: "shrink-0",
      itemLeadingAvatarSize: "",
      itemLeadingChip: "shrink-0",
      itemLeadingChipSize: "",
      itemTrailing: "ms-auto inline-flex gap-1.5 items-center",
      itemTrailingIcon: "shrink-0",
      itemWrapper: "flex-1 flex flex-col min-w-0",
      itemLabel: "truncate",
      itemDescription: "truncate text-muted",
      tagsItem: "px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-accented bg-elevated text-default data-disabled:cursor-not-allowed data-disabled:opacity-75",
      tagsItemText: "truncate",
      tagsItemDelete: ["inline-flex items-center rounded-xs text-dimmed hover:text-default hover:bg-accented/75 disabled:pointer-events-none", options.theme.transitions && "transition-colors"],
      tagsItemDeleteIcon: "shrink-0",
      tagsInput: "flex-1 border-0 bg-transparent placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
    },
    variants: {
      virtualize: {
        true: {
          viewport: "p-1 isolate"
        },
        false: {
          viewport: "divide-y divide-default"
        }
      },
      multiple: {
        true: {
          root: "flex-wrap"
        },
        false: {
          base: "w-full border-0 placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
        }
      },
      size: {
        xs: {
          label: "p-1 text-[10px]/3 gap-1",
          item: "p-1 text-xs gap-1",
          itemLeadingIcon: "size-4",
          itemLeadingAvatarSize: "3xs",
          itemLeadingChip: "size-4",
          itemLeadingChipSize: "sm",
          itemTrailingIcon: "size-4",
          tagsItem: "text-[10px]/3",
          tagsItemDeleteIcon: "size-3",
          empty: "p-2 text-xs"
        },
        sm: {
          label: "p-1.5 text-[10px]/3 gap-1.5",
          item: "p-1.5 text-xs gap-1.5",
          itemLeadingIcon: "size-4",
          itemLeadingAvatarSize: "3xs",
          itemLeadingChip: "size-4",
          itemLeadingChipSize: "sm",
          itemTrailingIcon: "size-4",
          tagsItem: "text-[10px]/3",
          tagsItemDeleteIcon: "size-3",
          empty: "p-2.5 text-xs"
        },
        md: {
          label: "p-1.5 text-xs gap-1.5",
          item: "p-1.5 text-sm gap-1.5",
          itemLeadingIcon: "size-5",
          itemLeadingAvatarSize: "2xs",
          itemLeadingChip: "size-5",
          itemLeadingChipSize: "md",
          itemTrailingIcon: "size-5",
          tagsItem: "text-xs",
          tagsItemDeleteIcon: "size-3.5",
          empty: "p-2.5 text-sm"
        },
        lg: {
          label: "p-2 text-xs gap-2",
          item: "p-2 text-sm gap-2",
          itemLeadingIcon: "size-5",
          itemLeadingAvatarSize: "2xs",
          itemLeadingChip: "size-5",
          itemLeadingChipSize: "md",
          itemTrailingIcon: "size-5",
          tagsItem: "text-xs",
          tagsItemDeleteIcon: "size-3.5",
          empty: "p-3 text-sm"
        },
        xl: {
          label: "p-2 text-sm gap-2",
          item: "p-2 text-base gap-2",
          itemLeadingIcon: "size-6",
          itemLeadingAvatarSize: "xs",
          itemLeadingChip: "size-6",
          itemLeadingChipSize: "lg",
          itemTrailingIcon: "size-6",
          tagsItem: "text-sm",
          tagsItemDeleteIcon: "size-4",
          empty: "p-3 text-base"
        }
      }
    },
    compoundVariants: [{
      variant: "soft",
      multiple: true,
      class: "has-focus:bg-elevated"
    }, {
      variant: "ghost",
      multiple: true,
      class: "has-focus:bg-elevated"
    }, ...(options.theme.colors || []).map((color) => ({
      color,
      multiple: true,
      variant: ["outline", "subtle"],
      class: `has-focus-visible:ring-2 has-focus-visible:ring-${color}`
    })), {
      color: "neutral",
      multiple: true,
      variant: ["outline", "subtle"],
      class: "has-focus-visible:ring-2 has-focus-visible:ring-inverted"
    }]
  }, input(options));
};

const inputNumber = (options) => {
  const input$1 = input(options);
  return {
    slots: {
      root: "relative inline-flex items-center",
      base: ["w-full rounded-md border-0 placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75", options.theme.transitions && "transition-colors"],
      increment: "absolute flex items-center",
      decrement: "absolute flex items-center"
    },
    variants: {
      ...fieldGroupVariantWithRoot,
      color: {
        ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
        neutral: ""
      },
      size: {
        xs: "px-2 py-1 text-sm/4 gap-1",
        sm: "px-2.5 py-1.5 text-sm/4 gap-1.5",
        md: "px-2.5 py-1.5 text-base/5 gap-1.5",
        lg: "px-3 py-2 text-base/5 gap-2",
        xl: "px-3 py-2 text-base gap-2"
      },
      variant: {
        ...input$1.variants.variant
      },
      disabled: {
        true: {
          increment: "opacity-75 cursor-not-allowed",
          decrement: "opacity-75 cursor-not-allowed"
        }
      },
      orientation: {
        horizontal: {
          base: "text-center",
          increment: "inset-y-0 end-0 pe-1",
          decrement: "inset-y-0 start-0 ps-1"
        },
        vertical: {
          increment: "top-0 end-0 pe-1 [&>button]:py-0 scale-80",
          decrement: "bottom-0 end-0 pe-1 [&>button]:py-0 scale-80"
        }
      },
      highlight: {
        true: ""
      },
      fixed: {
        false: ""
      },
      increment: {
        false: ""
      },
      decrement: {
        false: ""
      }
    },
    compoundVariants: [...(options.theme.colors || []).map((color) => ({
      color,
      variant: ["outline", "subtle"],
      class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
    })), ...(options.theme.colors || []).map((color) => ({
      color,
      highlight: true,
      class: `ring ring-inset ring-${color}`
    })), {
      color: "neutral",
      variant: ["outline", "subtle"],
      class: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
    }, {
      color: "neutral",
      highlight: true,
      class: "ring ring-inset ring-inverted"
    }, {
      orientation: "horizontal",
      decrement: false,
      class: "text-start"
    }, {
      decrement: true,
      size: "xs",
      class: "ps-7"
    }, {
      decrement: true,
      size: "sm",
      class: "ps-8"
    }, {
      decrement: true,
      size: "md",
      class: "ps-9"
    }, {
      decrement: true,
      size: "lg",
      class: "ps-10"
    }, {
      decrement: true,
      size: "xl",
      class: "ps-11"
    }, {
      increment: true,
      size: "xs",
      class: "pe-7"
    }, {
      increment: true,
      size: "sm",
      class: "pe-8"
    }, {
      increment: true,
      size: "md",
      class: "pe-9"
    }, {
      increment: true,
      size: "lg",
      class: "pe-10"
    }, {
      increment: true,
      size: "xl",
      class: "pe-11"
    }, {
      fixed: false,
      size: "xs",
      class: "md:text-xs"
    }, {
      fixed: false,
      size: "sm",
      class: "md:text-xs"
    }, {
      fixed: false,
      size: "md",
      class: "md:text-sm"
    }, {
      fixed: false,
      size: "lg",
      class: "md:text-sm"
    }],
    defaultVariants: {
      size: "md",
      color: "primary",
      variant: "outline"
    }
  };
};

const inputTags = (options) => {
  return defuFn({
    slots: {
      root: (prev) => [prev, "flex-wrap"],
      base: () => ["rounded-md", options.theme.transitions && "transition-colors"],
      item: 'px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-accented bg-elevated text-default data-disabled:cursor-not-allowed data-disabled:opacity-75 wrap-anywhere data-[state="active"]:bg-accented',
      itemText: "",
      itemDelete: ["inline-flex items-center rounded-xs text-dimmed hover:text-default hover:bg-accented/75 disabled:pointer-events-none", options.theme.transitions && "transition-colors"],
      itemDeleteIcon: "shrink-0",
      input: "flex-1 border-0 bg-transparent placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
    },
    variants: {
      ...fieldGroupVariant,
      size: {
        xs: {
          item: "text-[10px]/3",
          itemDeleteIcon: "size-3"
        },
        sm: {
          item: "text-[10px]/3",
          itemDeleteIcon: "size-3"
        },
        md: {
          item: "text-xs",
          itemDeleteIcon: "size-3.5"
        },
        lg: {
          item: "text-xs",
          itemDeleteIcon: "size-3.5"
        },
        xl: {
          item: "text-sm",
          itemDeleteIcon: "size-4"
        }
      },
      variant: (prev) => Object.fromEntries(
        Object.entries(prev).map(([key, value]) => [key, replaceFocus$2(value)])
      )
    },
    compoundVariants: (prev) => prev.map((item) => ({
      ...item,
      class: typeof item.class === "string" ? replaceFocus$2(item.class) : item.class
    }))
  }, input(options));
};
function replaceFocus$2(str) {
  return str.replace(/focus:/g, "has-focus:").replace(/focus-visible:/g, "has-focus-visible:");
}

const inputTime = (options) => {
  return defuFn({
    slots: {
      root: () => void 0,
      base: () => ["group relative inline-flex items-center rounded-md select-none", options.theme.transitions && "transition-colors"],
      segment: ["rounded text-center outline-hidden data-placeholder:text-dimmed data-[segment=literal]:text-muted data-invalid:text-error data-disabled:cursor-not-allowed data-disabled:opacity-75", options.theme.transitions && "transition-colors"],
      separatorIcon: "shrink-0 size-4 text-muted"
    },
    variants: {
      ...fieldGroupVariant,
      size: {
        xs: {
          base: (prev) => [prev, "gap-0.25"],
          segment: "not-data-[segment=literal]:w-8"
        },
        sm: {
          base: (prev) => [prev, "gap-0.5"],
          segment: "not-data-[segment=literal]:w-8"
        },
        md: {
          base: (prev) => [prev, "gap-0.5"],
          segment: "not-data-[segment=literal]:w-9"
        },
        lg: {
          base: (prev) => [prev, "gap-0.75"],
          segment: "not-data-[segment=literal]:w-9"
        },
        xl: {
          base: (prev) => [prev, "gap-0.75"],
          segment: "not-data-[segment=literal]:w-10"
        }
      }
    },
    compoundVariants: [{
      variant: "outline",
      class: {
        segment: "focus:bg-elevated"
      }
    }, {
      variant: "soft",
      class: {
        segment: "focus:bg-accented/50 group-hover:focus:bg-accented"
      }
    }, {
      variant: "subtle",
      class: {
        segment: "focus:bg-accented"
      }
    }, {
      variant: "ghost",
      class: {
        segment: "focus:bg-elevated group-hover:focus:bg-accented"
      }
    }, {
      variant: "none",
      class: {
        segment: "focus:bg-elevated"
      }
    }]
  }, input(options));
};

const kbd$1 = (options) => ({
  base: "inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans uppercase",
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      solid: "",
      outline: "",
      soft: "",
      subtle: ""
    },
    size: {
      sm: "h-4 min-w-[16px] text-[10px]",
      md: "h-5 min-w-[20px] text-[11px]",
      lg: "h-6 min-w-[24px] text-[12px]"
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: "solid",
    class: `text-inverted bg-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "outline",
    class: `ring ring-inset ring-${color}/50 text-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "soft",
    class: `text-${color} bg-${color}/10`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "subtle",
    class: `text-${color} ring ring-inset ring-${color}/25 bg-${color}/10`
  })), {
    color: "neutral",
    variant: "solid",
    class: "text-inverted bg-inverted"
  }, {
    color: "neutral",
    variant: "outline",
    class: "ring ring-inset ring-accented text-default bg-default"
  }, {
    color: "neutral",
    variant: "soft",
    class: "text-default bg-elevated"
  }, {
    color: "neutral",
    variant: "subtle",
    class: "ring ring-inset ring-accented text-default bg-elevated"
  }],
  defaultVariants: {
    variant: "outline",
    color: "neutral",
    size: "md"
  }
});

const link = (options) => ({
  base: "focus-visible:outline-primary",
  variants: {
    active: {
      true: "text-primary",
      false: "text-muted"
    },
    disabled: {
      true: "cursor-not-allowed opacity-75"
    }
  },
  compoundVariants: [{
    active: false,
    disabled: false,
    class: ["hover:text-default", options.theme.transitions && "transition-colors"]
  }]
});

const main = {
  base: "min-h-[calc(100vh-var(--ui-header-height))]"
};

const marquee = {
  slots: {
    root: "group relative flex items-center overflow-hidden gap-(--gap) [--gap:--spacing(16)] [--duration:20s]",
    content: "flex items-center shrink-0 justify-around gap-(--gap) min-w-max"
  },
  variants: {
    orientation: {
      horizontal: {
        content: "w-full"
      },
      vertical: {
        content: "h-full"
      }
    },
    pauseOnHover: {
      true: {
        content: "group-hover:[animation-play-state:paused]"
      }
    },
    reverse: {
      true: {
        content: "![animation-direction:reverse]"
      }
    },
    overlay: {
      true: {
        root: 'before:absolute before:pointer-events-none before:content-[""] before:z-2 before:from-default before:to-transparent after:absolute after:pointer-events-none after:content-[""] after:z-2 after:from-default after:to-transparent'
      }
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    class: {
      root: "flex-row",
      content: "flex-row animate-[marquee_var(--duration)_linear_infinite] rtl:animate-[marquee-rtl_var(--duration)_linear_infinite] backface-hidden"
    }
  }, {
    orientation: "horizontal",
    overlay: true,
    class: {
      root: "before:inset-y-0 before:left-0 before:h-full before:w-1/3 before:bg-gradient-to-r after:inset-y-0 after:right-0 after:h-full after:w-1/3 after:bg-gradient-to-l backface-hidden"
    }
  }, {
    orientation: "vertical",
    class: {
      root: "flex-col",
      content: "flex-col animate-[marquee-vertical_var(--duration)_linear_infinite] rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] h-[fit-content] backface-hidden"
    }
  }, {
    orientation: "vertical",
    overlay: true,
    class: {
      root: "before:inset-x-0 before:top-0 before:w-full before:h-1/3 before:bg-gradient-to-b after:inset-x-0 after:bottom-0 after:w-full after:h-1/3 after:bg-gradient-to-t backface-hidden"
    }
  }]
};

const modal = {
  slots: {
    overlay: "fixed inset-0",
    content: "bg-default divide-y divide-default flex flex-col focus:outline-none",
    header: "flex items-center gap-1.5 p-4 sm:px-6 min-h-(--ui-header-height)",
    wrapper: "",
    body: "flex-1 p-4 sm:p-6",
    footer: "flex items-center gap-1.5 p-4 sm:px-6",
    title: "text-highlighted font-semibold",
    description: "mt-1 text-muted text-sm",
    close: "absolute top-4 end-4"
  },
  variants: {
    transition: {
      true: {
        overlay: "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]",
        content: "data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]"
      }
    },
    fullscreen: {
      true: {
        content: "inset-0"
      },
      false: {
        content: "w-[calc(100vw-2rem)] max-w-lg rounded-lg shadow-lg ring ring-default"
      }
    },
    overlay: {
      true: {
        overlay: "bg-elevated/75"
      }
    },
    scrollable: {
      true: {
        overlay: "overflow-y-auto",
        content: "relative"
      },
      false: {
        content: "fixed",
        body: "overflow-y-auto"
      }
    }
  },
  compoundVariants: [{
    scrollable: true,
    fullscreen: false,
    class: {
      overlay: "grid place-items-center p-4 sm:py-8"
    }
  }, {
    scrollable: false,
    fullscreen: false,
    class: {
      content: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden"
    }
  }]
};

const navigationMenu = (options) => ({
  slots: {
    root: "relative flex gap-1.5 [&>div]:min-w-0",
    list: "isolate min-w-0",
    label: "w-full flex items-center gap-1.5 font-semibold text-xs/5 text-highlighted px-2.5 py-1.5",
    item: "min-w-0",
    link: "group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
    linkLeadingIcon: "shrink-0 size-5",
    linkLeadingAvatar: "shrink-0",
    linkLeadingAvatarSize: "2xs",
    linkLeadingChipSize: "sm",
    linkTrailing: "group ms-auto inline-flex gap-1.5 items-center",
    linkTrailingBadge: "shrink-0",
    linkTrailingBadgeSize: "sm",
    linkTrailingIcon: "size-5 transform shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200",
    linkLabel: "truncate",
    linkLabelExternalIcon: "inline-block size-3 align-top text-dimmed",
    childList: "isolate",
    childLabel: "text-xs text-highlighted",
    childItem: "",
    childLink: "group relative size-full flex items-start text-start text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
    childLinkWrapper: "min-w-0",
    childLinkIcon: "size-5 shrink-0",
    childLinkLabel: "truncate",
    childLinkLabelExternalIcon: "inline-block size-3 align-top text-dimmed",
    childLinkDescription: "text-muted",
    separator: "px-2 h-px bg-border",
    viewportWrapper: "absolute top-full left-0 flex w-full",
    viewport: "relative overflow-hidden bg-default shadow-lg rounded-md ring ring-default h-(--reka-navigation-menu-viewport-height) w-full transition-[width,height,left,right] duration-200 origin-[top_center] data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] z-1",
    content: "",
    indicator: "absolute left-0 data-[state=visible]:animate-[fade-in_100ms_ease-out] data-[state=hidden]:animate-[fade-out_100ms_ease-in] data-[state=hidden]:opacity-0 bottom-0 z-2 w-(--reka-navigation-menu-indicator-size) translate-x-(--reka-navigation-menu-indicator-position) flex h-2.5 items-end justify-center overflow-hidden transition-[translate,width] duration-200",
    arrow: "relative top-[50%] size-2.5 rotate-45 border border-default bg-default z-1 rounded-xs"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        link: `focus-visible:before:ring-${color}`,
        childLink: `focus-visible:before:ring-${color}`
      }])),
      neutral: {
        link: "focus-visible:before:ring-inverted",
        childLink: "focus-visible:before:ring-inverted"
      }
    },
    highlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      pill: "",
      link: ""
    },
    orientation: {
      horizontal: {
        root: "items-center justify-between",
        list: "flex items-center",
        item: "py-2",
        link: "px-2.5 py-1.5 before:inset-x-px before:inset-y-0",
        childList: "grid p-2",
        childLink: "px-3 py-2 gap-2 before:inset-x-px before:inset-y-0",
        childLinkLabel: "font-medium",
        content: "absolute top-0 left-0 w-full max-h-[70vh] overflow-y-auto"
      },
      vertical: {
        root: "flex-col",
        link: "flex-row px-2.5 py-1.5 before:inset-y-px before:inset-x-0",
        childLabel: "px-1.5 py-0.5",
        childLink: "p-1.5 gap-1.5 before:inset-y-px before:inset-x-0"
      }
    },
    contentOrientation: {
      horizontal: {
        viewportWrapper: "justify-center",
        content: "data-[motion=from-start]:animate-[enter-from-left_200ms_ease] data-[motion=from-end]:animate-[enter-from-right_200ms_ease] data-[motion=to-start]:animate-[exit-to-left_200ms_ease] data-[motion=to-end]:animate-[exit-to-right_200ms_ease]"
      },
      vertical: {
        viewport: "sm:w-(--reka-navigation-menu-viewport-width) left-(--reka-navigation-menu-viewport-left) rtl:left-auto rtl:right-[calc(100%-var(--reka-navigation-menu-viewport-left)-var(--reka-navigation-menu-viewport-width))]"
      }
    },
    active: {
      true: {
        childLink: "before:bg-elevated text-highlighted",
        childLinkIcon: "text-default"
      },
      false: {
        link: "text-muted",
        linkLeadingIcon: "text-dimmed",
        childLink: ["hover:before:bg-elevated/50 text-default hover:text-highlighted", options.theme.transitions && "transition-colors before:transition-colors"],
        childLinkIcon: ["text-dimmed group-hover:text-default", options.theme.transitions && "transition-colors"]
      }
    },
    disabled: {
      true: {
        link: "cursor-not-allowed opacity-75"
      }
    },
    highlight: {
      true: ""
    },
    level: {
      true: ""
    },
    collapsed: {
      true: ""
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    contentOrientation: "horizontal",
    class: {
      childList: "grid-cols-2 gap-2"
    }
  }, {
    orientation: "horizontal",
    contentOrientation: "vertical",
    class: {
      childList: "gap-1",
      content: "w-60"
    }
  }, {
    orientation: "vertical",
    collapsed: false,
    class: {
      childList: "ms-5 border-s border-default",
      childItem: "ps-1.5 -ms-px",
      content: "data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden"
    }
  }, {
    orientation: "vertical",
    collapsed: true,
    class: {
      link: "px-1.5",
      linkLabel: "hidden",
      linkTrailing: "hidden",
      content: "shadow-sm rounded-sm min-h-6 p-1"
    }
  }, {
    orientation: "horizontal",
    highlight: true,
    class: {
      link: ["after:absolute after:-bottom-2 after:inset-x-2.5 after:block after:h-px after:rounded-full", options.theme.transitions && "after:transition-colors"]
    }
  }, {
    orientation: "vertical",
    highlight: true,
    level: true,
    class: {
      link: ["after:absolute after:-start-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full", options.theme.transitions && "after:transition-colors"]
    }
  }, {
    disabled: false,
    active: false,
    variant: "pill",
    class: {
      link: ["hover:text-highlighted hover:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
      linkLeadingIcon: ["group-hover:text-default", options.theme.transitions && "transition-colors"]
    }
  }, {
    disabled: false,
    active: false,
    variant: "pill",
    orientation: "horizontal",
    class: {
      link: "data-[state=open]:text-highlighted",
      linkLeadingIcon: "group-data-[state=open]:text-default"
    }
  }, {
    disabled: false,
    variant: "pill",
    highlight: true,
    orientation: "horizontal",
    class: {
      link: "data-[state=open]:before:bg-elevated/50"
    }
  }, {
    disabled: false,
    variant: "pill",
    highlight: false,
    active: false,
    orientation: "horizontal",
    class: {
      link: "data-[state=open]:before:bg-elevated/50"
    }
  }, ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "pill",
    active: true,
    class: {
      link: `text-${color}`,
      linkLeadingIcon: `text-${color} group-data-[state=open]:text-${color}`
    }
  })), {
    color: "neutral",
    variant: "pill",
    active: true,
    class: {
      link: "text-highlighted",
      linkLeadingIcon: "text-highlighted group-data-[state=open]:text-highlighted"
    }
  }, {
    variant: "pill",
    active: true,
    highlight: false,
    class: {
      link: "before:bg-elevated"
    }
  }, {
    variant: "pill",
    active: true,
    highlight: true,
    disabled: false,
    class: {
      link: ["hover:before:bg-elevated/50", options.theme.transitions && "before:transition-colors"]
    }
  }, {
    disabled: false,
    active: false,
    variant: "link",
    class: {
      link: ["hover:text-highlighted", options.theme.transitions && "transition-colors"],
      linkLeadingIcon: ["group-hover:text-default", options.theme.transitions && "transition-colors"]
    }
  }, {
    disabled: false,
    active: false,
    variant: "link",
    orientation: "horizontal",
    class: {
      link: "data-[state=open]:text-highlighted",
      linkLeadingIcon: "group-data-[state=open]:text-default"
    }
  }, ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "link",
    active: true,
    class: {
      link: `text-${color}`,
      linkLeadingIcon: `text-${color} group-data-[state=open]:text-${color}`
    }
  })), {
    color: "neutral",
    variant: "link",
    active: true,
    class: {
      link: "text-highlighted",
      linkLeadingIcon: "text-highlighted group-data-[state=open]:text-highlighted"
    }
  }, ...(options.theme.colors || []).map((highlightColor) => ({
    highlightColor,
    highlight: true,
    level: true,
    active: true,
    class: {
      link: `after:bg-${highlightColor}`
    }
  })), {
    highlightColor: "neutral",
    highlight: true,
    level: true,
    active: true,
    class: {
      link: "after:bg-inverted"
    }
  }],
  defaultVariants: {
    color: "primary",
    highlightColor: "primary",
    variant: "pill"
  }
});

const page = {
  slots: {
    root: "flex flex-col lg:grid lg:grid-cols-10 lg:gap-10",
    left: "lg:col-span-2",
    center: "lg:col-span-8",
    right: "lg:col-span-2 order-first lg:order-last"
  },
  variants: {
    left: {
      true: ""
    },
    right: {
      true: ""
    }
  },
  compoundVariants: [{
    left: true,
    right: true,
    class: {
      center: "lg:col-span-6"
    }
  }, {
    left: false,
    right: false,
    class: {
      center: "lg:col-span-10"
    }
  }]
};

const pageAnchors = (options) => ({
  slots: {
    root: "",
    list: "",
    item: "relative",
    link: "group text-sm flex items-center gap-1.5 py-1 focus-visible:outline-primary",
    linkLeading: "rounded-md p-1 inline-flex ring-inset ring",
    linkLeadingIcon: "size-4 shrink-0",
    linkLabel: "truncate",
    linkLabelExternalIcon: "size-3 absolute top-0 text-dimmed"
  },
  variants: {
    active: {
      true: {
        link: "text-primary font-semibold",
        linkLeading: "bg-primary ring-primary text-inverted"
      },
      false: {
        link: ["text-muted hover:text-default font-medium", options.theme.transitions && "transition-colors"],
        linkLeading: ["bg-elevated/50 ring-accented text-dimmed group-hover:bg-primary group-hover:ring-primary group-hover:text-inverted", options.theme.transitions && "transition"]
      }
    }
  }
});

const pageAside = {
  slots: {
    root: "hidden overflow-y-auto lg:block lg:max-h-[calc(100vh-var(--ui-header-height))] lg:sticky lg:top-(--ui-header-height) py-8 lg:ps-4 lg:-ms-4 lg:pe-6.5",
    container: "relative",
    top: "sticky -top-8 -mt-8 pointer-events-none z-[1]",
    topHeader: "h-8 bg-default -mx-4 px-4",
    topBody: "bg-default relative pointer-events-auto flex flex-col -mx-4 px-4",
    topFooter: "h-8 bg-gradient-to-b from-default -mx-4 px-4"
  }
};

const pageBody = {
  base: "mt-8 pb-24 space-y-12"
};

const pageCta = {
  slots: {
    root: "relative isolate rounded-xl overflow-hidden",
    container: "flex flex-col lg:grid px-6 py-12 sm:px-12 sm:py-24 lg:px-16 lg:py-24 gap-8 sm:gap-16",
    wrapper: "",
    header: "",
    title: "text-3xl sm:text-4xl text-pretty tracking-tight font-bold text-highlighted",
    description: "text-base sm:text-lg text-muted",
    body: "mt-8",
    footer: "mt-8",
    links: "flex flex-wrap gap-x-6 gap-y-3"
  },
  variants: {
    orientation: {
      horizontal: {
        container: "lg:grid-cols-2 lg:items-center",
        description: "text-pretty"
      },
      vertical: {
        container: "",
        title: "text-center",
        description: "text-center text-balance",
        links: "justify-center"
      }
    },
    reverse: {
      true: {
        wrapper: "order-last"
      }
    },
    variant: {
      solid: {
        root: "bg-inverted text-inverted",
        title: "text-inverted",
        description: "text-dimmed"
      },
      outline: {
        root: "bg-default ring ring-default",
        description: "text-muted"
      },
      soft: {
        root: "bg-elevated/50",
        description: "text-toned"
      },
      subtle: {
        root: "bg-elevated/50 ring ring-default",
        description: "text-toned"
      },
      naked: {
        description: "text-muted"
      }
    },
    title: {
      true: {
        description: "mt-6"
      }
    }
  },
  defaultVariants: {
    variant: "outline"
  }
};

const pageCard = (options) => ({
  slots: {
    root: "relative flex rounded-lg",
    spotlight: "absolute inset-0 rounded-[inherit] pointer-events-none bg-default/90",
    container: "relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 p-4 sm:p-6",
    wrapper: "flex flex-col flex-1 items-start",
    header: "mb-4",
    body: "flex-1",
    footer: "pt-4 mt-auto",
    leading: "inline-flex items-center mb-2.5",
    leadingIcon: "size-5 shrink-0 text-primary",
    title: "text-base text-pretty font-semibold text-highlighted",
    description: "text-[15px] text-pretty"
  },
  variants: {
    orientation: {
      horizontal: {
        container: "lg:grid-cols-2 lg:items-center"
      },
      vertical: {
        container: ""
      }
    },
    reverse: {
      true: {
        wrapper: "order-last"
      }
    },
    variant: {
      solid: {
        root: "bg-inverted text-inverted",
        title: "text-inverted",
        description: "text-dimmed"
      },
      outline: {
        root: "bg-default ring ring-default",
        description: "text-muted"
      },
      soft: {
        root: "bg-elevated/50",
        description: "text-toned"
      },
      subtle: {
        root: "bg-elevated/50 ring ring-default",
        description: "text-toned"
      },
      ghost: {
        description: "text-muted"
      },
      naked: {
        container: "p-0 sm:p-0",
        description: "text-muted"
      }
    },
    to: {
      true: {
        root: ["has-focus-visible:ring-2 has-focus-visible:ring-primary", options.theme.transitions && "transition"]
      }
    },
    title: {
      true: {
        description: "mt-1"
      }
    },
    highlight: {
      true: {
        root: "ring-2"
      }
    },
    highlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    spotlight: {
      true: {
        root: "[--spotlight-size:400px] before:absolute before:-inset-px before:pointer-events-none before:rounded-[inherit] before:bg-[radial-gradient(var(--spotlight-size)_var(--spotlight-size)_at_calc(var(--spotlight-x,0px))_calc(var(--spotlight-y,0px)),var(--spotlight-color),transparent_70%)]"
      }
    },
    spotlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    }
  },
  compoundVariants: [{
    variant: "solid",
    to: true,
    class: {
      root: "hover:bg-inverted/90"
    }
  }, {
    variant: "outline",
    to: true,
    class: {
      root: "hover:bg-elevated/50"
    }
  }, {
    variant: "soft",
    to: true,
    class: {
      root: "hover:bg-elevated"
    }
  }, {
    variant: "subtle",
    to: true,
    class: {
      root: "hover:bg-elevated"
    }
  }, {
    variant: "subtle",
    to: true,
    highlight: false,
    class: {
      root: "hover:ring-accented"
    }
  }, {
    variant: "ghost",
    to: true,
    class: {
      root: "hover:bg-elevated/50"
    }
  }, ...(options.theme.colors || []).map((highlightColor) => ({
    highlightColor,
    highlight: true,
    class: {
      root: `ring-${highlightColor}`
    }
  })), {
    highlightColor: "neutral",
    highlight: true,
    class: {
      root: "ring-inverted"
    }
  }, ...(options.theme.colors || []).map((spotlightColor) => ({
    spotlightColor,
    spotlight: true,
    class: {
      root: `[--spotlight-color:var(--ui-${spotlightColor})]`
    }
  })), {
    spotlightColor: "neutral",
    spotlight: true,
    class: {
      root: "[--spotlight-color:var(--ui-bg-inverted)]"
    }
  }],
  defaultVariants: {
    variant: "outline",
    highlightColor: "primary",
    spotlightColor: "primary"
  }
});

const pageColumns = {
  base: "relative column-1 md:columns-2 lg:columns-3 gap-8 space-y-8 *:break-inside-avoid-column *:will-change-transform"
};

const pageFeature = (options) => ({
  slots: {
    root: "relative rounded-sm",
    wrapper: "",
    leading: "inline-flex items-center justify-center",
    leadingIcon: "size-5 shrink-0 text-primary",
    title: "text-base text-pretty font-semibold text-highlighted",
    description: "text-[15px] text-pretty text-muted"
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex items-start gap-2.5",
        leading: "p-0.5"
      },
      vertical: {
        leading: "mb-2.5"
      }
    },
    to: {
      true: {
        root: ["has-focus-visible:ring-2 has-focus-visible:ring-primary", options.theme.transitions && "transition"]
      }
    },
    title: {
      true: {
        description: "mt-1"
      }
    }
  }
});

const pageGrid = {
  base: "relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
};

const pageHeader = {
  slots: {
    root: "relative border-b border-default py-8",
    container: "",
    wrapper: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
    headline: "mb-2.5 text-sm font-semibold text-primary flex items-center gap-1.5",
    title: "text-3xl sm:text-4xl text-pretty font-bold text-highlighted",
    description: "text-lg text-pretty text-muted",
    links: "flex flex-wrap items-center gap-1.5"
  },
  variants: {
    title: {
      true: {
        description: "mt-4"
      }
    }
  }
};

const pageHero = {
  slots: {
    root: "relative isolate",
    container: "flex flex-col lg:grid py-24 sm:py-32 lg:py-40 gap-16 sm:gap-y-24",
    wrapper: "",
    header: "",
    headline: "mb-4",
    title: "text-5xl sm:text-7xl text-pretty tracking-tight font-bold text-highlighted",
    description: "text-lg sm:text-xl/8 text-muted",
    body: "mt-10",
    footer: "mt-10",
    links: "flex flex-wrap gap-x-6 gap-y-3"
  },
  variants: {
    orientation: {
      horizontal: {
        container: "lg:grid-cols-2 lg:items-center",
        description: "text-pretty"
      },
      vertical: {
        container: "",
        headline: "justify-center",
        wrapper: "text-center",
        description: "text-balance",
        links: "justify-center"
      }
    },
    reverse: {
      true: {
        wrapper: "order-last"
      }
    },
    headline: {
      true: {
        headline: "font-semibold text-primary flex items-center gap-1.5"
      }
    },
    title: {
      true: {
        description: "mt-6"
      }
    }
  }
};

const pageLinks = (options) => ({
  slots: {
    root: "flex flex-col gap-3",
    title: "text-sm font-semibold flex items-center gap-1.5",
    list: "flex flex-col gap-2",
    item: "relative",
    link: "group text-sm flex items-center gap-1.5 focus-visible:outline-primary",
    linkLeadingIcon: "size-5 shrink-0",
    linkLabel: "truncate",
    linkLabelExternalIcon: "size-3 absolute top-0 text-dimmed"
  },
  variants: {
    active: {
      true: {
        link: "text-primary font-medium"
      },
      false: {
        link: ["text-muted hover:text-default", options.theme.transitions && "transition-colors"]
      }
    }
  }
});

const pageList = {
  base: "relative flex flex-col",
  variants: {
    divide: {
      true: "*:not-last:after:absolute *:not-last:after:inset-x-1 *:not-last:after:bottom-0 *:not-last:after:bg-border *:not-last:after:h-px"
    }
  }
};

const pageLogos = {
  slots: {
    root: "relative overflow-hidden",
    title: "text-lg text-center font-semibold text-highlighted",
    logos: "mt-10",
    logo: "size-10 shrink-0"
  },
  variants: {
    marquee: {
      false: {
        logos: "flex items-center shrink-0 justify-around gap-(--gap) [--gap:--spacing(16)]"
      }
    }
  }
};

const pageSection = {
  slots: {
    root: "relative isolate",
    container: "flex flex-col lg:grid py-16 sm:py-24 lg:py-32 gap-8 sm:gap-16",
    wrapper: "",
    header: "",
    leading: "flex items-center mb-6",
    leadingIcon: "size-10 shrink-0 text-primary",
    headline: "mb-3",
    title: "text-3xl sm:text-4xl lg:text-5xl text-pretty tracking-tight font-bold text-highlighted",
    description: "text-base sm:text-lg text-muted",
    body: "mt-8",
    features: "grid",
    footer: "mt-8",
    links: "flex flex-wrap gap-x-6 gap-y-3"
  },
  variants: {
    orientation: {
      horizontal: {
        container: "lg:grid-cols-2 lg:items-center",
        description: "text-pretty",
        features: "gap-4"
      },
      vertical: {
        container: "",
        headline: "justify-center",
        leading: "justify-center",
        title: "text-center",
        description: "text-center text-balance",
        links: "justify-center",
        features: "sm:grid-cols-2 lg:grid-cols-3 gap-8"
      }
    },
    reverse: {
      true: {
        wrapper: "order-last"
      }
    },
    headline: {
      true: {
        headline: "font-semibold text-primary flex items-center gap-1.5"
      }
    },
    title: {
      true: {
        description: "mt-6"
      }
    },
    description: {
      true: ""
    },
    body: {
      true: ""
    }
  },
  compoundVariants: [{
    orientation: "vertical",
    title: true,
    class: {
      body: "mt-16"
    }
  }, {
    orientation: "vertical",
    description: true,
    class: {
      body: "mt-16"
    }
  }, {
    orientation: "vertical",
    body: true,
    class: {
      footer: "mt-16"
    }
  }]
};

const pagination = {
  slots: {
    root: "",
    list: "flex items-center gap-1",
    ellipsis: "pointer-events-none",
    label: "min-w-5 text-center",
    first: "",
    prev: "",
    item: "",
    next: "",
    last: ""
  }
};

const pinInput = (options) => ({
  slots: {
    root: "relative inline-flex items-center gap-1.5",
    base: ["rounded-md border-0 placeholder:text-dimmed text-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75", options.theme.transitions && "transition-colors"]
  },
  variants: {
    size: {
      xs: {
        base: "size-6 text-sm/4"
      },
      sm: {
        base: "size-7 text-sm/4"
      },
      md: {
        base: "size-8 text-base/5"
      },
      lg: {
        base: "size-9 text-base/5"
      },
      xl: {
        base: "size-10 text-base"
      }
    },
    variant: {
      outline: "text-highlighted bg-default ring ring-inset ring-accented",
      soft: "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      subtle: "text-highlighted bg-elevated ring ring-inset ring-accented",
      ghost: "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      none: "text-highlighted bg-transparent"
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    highlight: {
      true: ""
    },
    fixed: {
      false: ""
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    variant: ["outline", "subtle"],
    class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-${color}`
  })), {
    color: "neutral",
    variant: ["outline", "subtle"],
    class: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
  }, {
    color: "neutral",
    highlight: true,
    class: "ring ring-inset ring-inverted"
  }, {
    fixed: false,
    size: "xs",
    class: "md:text-xs"
  }, {
    fixed: false,
    size: "sm",
    class: "md:text-xs"
  }, {
    fixed: false,
    size: "md",
    class: "md:text-sm"
  }, {
    fixed: false,
    size: "lg",
    class: "md:text-sm"
  }],
  defaultVariants: {
    size: "md",
    color: "primary",
    variant: "outline"
  }
});

const popover = {
  slots: {
    content: "bg-default shadow-lg rounded-md ring ring-default data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-popover-content-transform-origin) focus:outline-none pointer-events-auto",
    arrow: "fill-bg stroke-default"
  }
};

const pricingPlan = {
  slots: {
    root: "relative grid rounded-lg p-6 lg:p-8 xl:p-10 gap-6",
    header: "",
    body: "flex flex-col min-w-0",
    footer: "flex flex-col gap-6 items-center",
    titleWrapper: "flex items-center gap-3",
    title: "text-highlighted truncate text-2xl sm:text-3xl text-pretty font-semibold",
    description: "text-muted text-base text-pretty mt-2",
    priceWrapper: "flex items-center gap-1",
    price: "text-highlighted text-3xl sm:text-4xl font-semibold",
    discount: "text-muted line-through text-xl sm:text-2xl",
    billing: "flex flex-col justify-between min-w-0",
    billingPeriod: "text-toned truncate text-xs font-medium",
    billingCycle: "text-muted truncate text-xs font-medium",
    features: "flex flex-col gap-3 flex-1 mt-6 grow-0",
    feature: "flex items-center gap-2 min-w-0",
    featureIcon: "size-5 shrink-0 text-primary",
    featureTitle: "text-muted text-sm truncate",
    badge: "",
    button: "",
    tagline: "text-base font-semibold text-default",
    terms: "text-xs/5 text-muted text-center text-balance"
  },
  variants: {
    orientation: {
      horizontal: {
        root: "grid-cols-1 lg:grid-cols-3 justify-between divide-y lg:divide-y-0 lg:divide-x divide-default",
        body: "lg:col-span-2 pb-6 lg:pb-0 lg:pr-6 justify-center",
        footer: "lg:justify-center lg:items-center lg:p-6 lg:max-w-xs lg:w-full lg:mx-auto",
        features: "lg:grid lg:grid-cols-2 lg:mt-12"
      },
      vertical: {
        footer: "justify-end",
        priceWrapper: "mt-6"
      }
    },
    variant: {
      solid: {
        root: "bg-inverted",
        title: "text-inverted",
        description: "text-dimmed",
        price: "text-inverted",
        discount: "text-dimmed",
        billingCycle: "text-dimmed",
        billingPeriod: "text-dimmed",
        featureTitle: "text-dimmed"
      },
      outline: {
        root: "bg-default ring ring-default"
      },
      soft: {
        root: "bg-elevated/50"
      },
      subtle: {
        root: "bg-elevated/50 ring ring-default"
      }
    },
    highlight: {
      true: {
        root: "ring-2 ring-inset ring-primary"
      }
    },
    scale: {
      true: {
        root: "lg:scale-[1.1] lg:z-[1]"
      }
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    variant: "soft",
    class: {
      root: "divide-accented"
    }
  }, {
    orientation: "horizontal",
    variant: "subtle",
    class: {
      root: "divide-accented"
    }
  }],
  defaultVariants: {
    variant: "outline"
  }
};

const pricingPlans = {
  base: "flex flex-col gap-y-8",
  variants: {
    orientation: {
      horizontal: "lg:grid lg:grid-cols-[repeat(var(--count),minmax(0,1fr))]",
      vertical: ""
    },
    compact: {
      false: "gap-x-8"
    },
    scale: {
      true: ""
    }
  },
  compoundVariants: [{
    compact: false,
    scale: true,
    class: "lg:gap-x-13"
  }]
};

const pricingTable = {
  slots: {
    root: "w-full relative",
    table: "w-full table-fixed border-separate border-spacing-x-0 hidden md:table h-fit",
    list: "md:hidden flex flex-col gap-6 w-full",
    item: "p-6 flex flex-col border border-default rounded-lg",
    caption: "sr-only",
    thead: "",
    tbody: "",
    tr: "",
    th: "py-4 font-normal text-left rtl:text-right border-b border-default",
    td: "px-6 py-4 text-center border-b border-default",
    tier: "p-6 text-left rtl:text-right font-normal align-top h-full",
    tierWrapper: "flex flex-col md:h-full",
    tierTitleWrapper: "flex items-center gap-3",
    tierTitle: "text-lg font-semibold text-highlighted",
    tierDescription: "text-sm font-normal text-muted mt-1",
    tierBadge: "truncate",
    tierPriceWrapper: "flex items-center gap-1 mt-4",
    tierPrice: "text-highlighted text-3xl sm:text-4xl font-semibold",
    tierDiscount: "text-muted line-through text-xl sm:text-2xl",
    tierBilling: "flex flex-col justify-between min-w-0",
    tierBillingPeriod: "text-toned truncate text-xs font-medium",
    tierBillingCycle: "text-muted truncate text-xs font-medium",
    tierButton: "mt-6 md:mt-auto md:pt-6",
    tierFeatureIcon: "size-5 shrink-0",
    section: "mt-6 flex flex-col gap-2",
    sectionTitle: "font-semibold text-sm text-highlighted",
    feature: "flex items-center justify-between gap-1",
    featureTitle: "text-sm text-default",
    featureValue: "text-sm text-muted flex justify-center min-w-5"
  },
  variants: {
    section: {
      true: {
        tr: "*:pt-8"
      }
    },
    active: {
      true: {
        tierFeatureIcon: "text-primary"
      }
    },
    highlight: {
      true: {
        tier: "bg-elevated/50 border-x border-t border-default rounded-t-lg",
        td: "bg-elevated/50 border-x border-default",
        item: "bg-elevated/50"
      }
    }
  }
};

const progress = (options) => ({
  slots: {
    root: "gap-2",
    base: "relative overflow-hidden rounded-full bg-accented",
    indicator: "rounded-full size-full transition-transform duration-200 ease-out",
    status: "flex text-dimmed transition-[width] duration-200",
    steps: "grid items-end",
    step: "truncate text-end row-start-1 col-start-1 transition-opacity"
  },
  variants: {
    animation: {
      "carousel": "",
      "carousel-inverse": "",
      "swing": "",
      "elastic": ""
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        indicator: `bg-${color}`,
        steps: `text-${color}`
      }])),
      neutral: {
        indicator: "bg-inverted",
        steps: "text-inverted"
      }
    },
    size: {
      "2xs": {
        status: "text-xs",
        steps: "text-xs"
      },
      "xs": {
        status: "text-xs",
        steps: "text-xs"
      },
      "sm": {
        status: "text-sm",
        steps: "text-sm"
      },
      "md": {
        status: "text-sm",
        steps: "text-sm"
      },
      "lg": {
        status: "text-sm",
        steps: "text-sm"
      },
      "xl": {
        status: "text-base",
        steps: "text-base"
      },
      "2xl": {
        status: "text-base",
        steps: "text-base"
      }
    },
    step: {
      active: {
        step: "opacity-100"
      },
      first: {
        step: "opacity-100 text-muted"
      },
      other: {
        step: "opacity-0"
      },
      last: {
        step: ""
      }
    },
    orientation: {
      horizontal: {
        root: "w-full flex flex-col",
        base: "w-full",
        status: "flex-row items-center justify-end min-w-fit"
      },
      vertical: {
        root: "h-full flex flex-row-reverse",
        base: "h-full",
        status: "flex-col justify-end min-h-fit"
      }
    },
    inverted: {
      true: {
        status: "self-end"
      }
    }
  },
  compoundVariants: [{
    inverted: true,
    orientation: "horizontal",
    class: {
      step: "text-start",
      status: "flex-row-reverse"
    }
  }, {
    inverted: true,
    orientation: "vertical",
    class: {
      steps: "items-start",
      status: "flex-col-reverse"
    }
  }, {
    orientation: "horizontal",
    size: "2xs",
    class: "h-px"
  }, {
    orientation: "horizontal",
    size: "xs",
    class: "h-0.5"
  }, {
    orientation: "horizontal",
    size: "sm",
    class: "h-1"
  }, {
    orientation: "horizontal",
    size: "md",
    class: "h-2"
  }, {
    orientation: "horizontal",
    size: "lg",
    class: "h-3"
  }, {
    orientation: "horizontal",
    size: "xl",
    class: "h-4"
  }, {
    orientation: "horizontal",
    size: "2xl",
    class: "h-5"
  }, {
    orientation: "vertical",
    size: "2xs",
    class: "w-px"
  }, {
    orientation: "vertical",
    size: "xs",
    class: "w-0.5"
  }, {
    orientation: "vertical",
    size: "sm",
    class: "w-1"
  }, {
    orientation: "vertical",
    size: "md",
    class: "w-2"
  }, {
    orientation: "vertical",
    size: "lg",
    class: "w-3"
  }, {
    orientation: "vertical",
    size: "xl",
    class: "w-4"
  }, {
    orientation: "vertical",
    size: "2xl",
    class: "w-5"
  }, {
    orientation: "horizontal",
    animation: "carousel",
    class: {
      indicator: "data-[state=indeterminate]:animate-[carousel_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "vertical",
    animation: "carousel",
    class: {
      indicator: "data-[state=indeterminate]:animate-[carousel-vertical_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "horizontal",
    animation: "carousel-inverse",
    class: {
      indicator: "data-[state=indeterminate]:animate-[carousel-inverse_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "vertical",
    animation: "carousel-inverse",
    class: {
      indicator: "data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "horizontal",
    animation: "swing",
    class: {
      indicator: "data-[state=indeterminate]:animate-[swing_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "vertical",
    animation: "swing",
    class: {
      indicator: "data-[state=indeterminate]:animate-[swing-vertical_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "horizontal",
    animation: "elastic",
    class: {
      indicator: "data-[state=indeterminate]:animate-[elastic_2s_ease-in-out_infinite]"
    }
  }, {
    orientation: "vertical",
    animation: "elastic",
    class: {
      indicator: "data-[state=indeterminate]:animate-[elastic-vertical_2s_ease-in-out_infinite]"
    }
  }],
  defaultVariants: {
    animation: "carousel",
    color: "primary",
    size: "md"
  }
});

const radioGroup = (options) => ({
  slots: {
    root: "relative",
    fieldset: "flex gap-x-2",
    legend: "mb-1 block font-medium text-default",
    item: "flex items-start",
    container: "flex items-center",
    base: "rounded-full ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
    indicator: "flex items-center justify-center size-full after:bg-default after:rounded-full",
    wrapper: "w-full",
    label: "block font-medium text-default",
    description: "text-muted"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        base: `focus-visible:outline-${color}`,
        indicator: `bg-${color}`
      }])),
      neutral: {
        base: "focus-visible:outline-inverted",
        indicator: "bg-inverted"
      }
    },
    variant: {
      list: {
        item: ""
      },
      card: {
        item: "border border-muted rounded-lg"
      },
      table: {
        item: "border border-muted"
      }
    },
    orientation: {
      horizontal: {
        fieldset: "flex-row"
      },
      vertical: {
        fieldset: "flex-col"
      }
    },
    indicator: {
      start: {
        item: "flex-row",
        wrapper: "ms-2"
      },
      end: {
        item: "flex-row-reverse",
        wrapper: "me-2"
      },
      hidden: {
        base: "sr-only",
        wrapper: "text-center"
      }
    },
    size: {
      xs: {
        fieldset: "gap-y-0.5",
        legend: "text-xs",
        base: "size-3",
        item: "text-xs",
        container: "h-4",
        indicator: "after:size-1"
      },
      sm: {
        fieldset: "gap-y-0.5",
        legend: "text-xs",
        base: "size-3.5",
        item: "text-xs",
        container: "h-4",
        indicator: "after:size-1"
      },
      md: {
        fieldset: "gap-y-1",
        legend: "text-sm",
        base: "size-4",
        item: "text-sm",
        container: "h-5",
        indicator: "after:size-1.5"
      },
      lg: {
        fieldset: "gap-y-1",
        legend: "text-sm",
        base: "size-4.5",
        item: "text-sm",
        container: "h-5",
        indicator: "after:size-1.5"
      },
      xl: {
        fieldset: "gap-y-1.5",
        legend: "text-base",
        base: "size-5",
        item: "text-base",
        container: "h-6",
        indicator: "after:size-2"
      }
    },
    disabled: {
      true: {
        item: "opacity-75",
        base: "cursor-not-allowed",
        label: "cursor-not-allowed",
        description: "cursor-not-allowed"
      }
    },
    required: {
      true: {
        legend: "after:content-['*'] after:ms-0.5 after:text-error"
      }
    }
  },
  compoundVariants: [
    { size: "xs", variant: ["card", "table"], class: { item: "p-2.5" } },
    { size: "sm", variant: ["card", "table"], class: { item: "p-3" } },
    { size: "md", variant: ["card", "table"], class: { item: "p-3.5" } },
    { size: "lg", variant: ["card", "table"], class: { item: "p-4" } },
    { size: "xl", variant: ["card", "table"], class: { item: "p-4.5" } },
    {
      orientation: "horizontal",
      variant: "table",
      class: {
        item: "first-of-type:rounded-s-lg last-of-type:rounded-e-lg",
        fieldset: "gap-0 -space-x-px"
      }
    },
    {
      orientation: "vertical",
      variant: "table",
      class: {
        item: "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
        fieldset: "gap-0 -space-y-px"
      }
    },
    ...(options.theme.colors || []).map((color) => ({
      color,
      variant: "card",
      class: {
        item: `has-data-[state=checked]:border-${color}`
      }
    })),
    {
      color: "neutral",
      variant: "card",
      class: {
        item: "has-data-[state=checked]:border-inverted"
      }
    },
    ...(options.theme.colors || []).map((color) => ({
      color,
      variant: "table",
      class: {
        item: `has-data-[state=checked]:bg-${color}/10 has-data-[state=checked]:border-${color}/50 has-data-[state=checked]:z-[1]`
      }
    })),
    {
      color: "neutral",
      variant: "table",
      class: {
        item: "has-data-[state=checked]:bg-elevated has-data-[state=checked]:border-inverted/50 has-data-[state=checked]:z-[1]"
      }
    },
    {
      variant: ["card", "table"],
      disabled: true,
      class: {
        item: "cursor-not-allowed"
      }
    }
  ],
  defaultVariants: {
    size: "md",
    color: "primary",
    variant: "list",
    orientation: "vertical",
    indicator: "start"
  }
});

const scrollArea = {
  slots: {
    root: "relative",
    viewport: "relative flex",
    item: ""
  },
  variants: {
    orientation: {
      vertical: {
        root: "overflow-y-auto overflow-x-hidden",
        viewport: "flex-col",
        item: ""
      },
      horizontal: {
        root: "overflow-x-auto overflow-y-hidden",
        viewport: "flex-row",
        item: ""
      }
    }
  }
};

const select = (options) => {
  return defuFn({
    slots: {
      root: () => void 0,
      base: () => ["relative group rounded-md inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75", options.theme.transitions && "transition-colors"],
      value: "truncate pointer-events-none",
      placeholder: "truncate text-dimmed",
      arrow: "fill-bg stroke-default",
      content: "max-h-60 w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col",
      viewport: "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
      group: "p-1 isolate",
      empty: "text-center text-muted",
      label: "font-semibold text-highlighted",
      separator: "-mx-1 my-1 h-px bg-border",
      item: ["group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"],
      itemLeadingIcon: ["shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default", options.theme.transitions && "transition-colors"],
      itemLeadingAvatar: "shrink-0",
      itemLeadingAvatarSize: "",
      itemLeadingChip: "shrink-0",
      itemLeadingChipSize: "",
      itemTrailing: "ms-auto inline-flex gap-1.5 items-center",
      itemTrailingIcon: "shrink-0",
      itemWrapper: "flex-1 flex flex-col min-w-0",
      itemLabel: "truncate",
      itemDescription: "truncate text-muted"
    },
    variants: {
      ...fieldGroupVariant,
      variant: (prev) => ({
        ...prev,
        outline: [prev.outline, "hover:bg-elevated disabled:bg-default"].join(" "),
        subtle: [prev.subtle, "hover:bg-accented/75 disabled:bg-elevated"].join(" ")
      }),
      size: {
        xs: {
          base: "px-2 py-1 text-xs gap-1",
          label: "p-1 text-[10px]/3 gap-1",
          item: "p-1 text-xs gap-1",
          itemLeadingIcon: "size-4",
          itemLeadingAvatarSize: "3xs",
          itemLeadingChip: "size-4",
          itemLeadingChipSize: "sm",
          itemTrailingIcon: "size-4",
          empty: "p-2 text-xs"
        },
        sm: {
          base: "px-2.5 py-1.5 text-xs gap-1.5",
          label: "p-1.5 text-[10px]/3 gap-1.5",
          item: "p-1.5 text-xs gap-1.5",
          itemLeadingIcon: "size-4",
          itemLeadingAvatarSize: "3xs",
          itemLeadingChip: "size-4",
          itemLeadingChipSize: "sm",
          itemTrailingIcon: "size-4",
          empty: "p-2.5 text-xs"
        },
        md: {
          base: "px-2.5 py-1.5 text-sm gap-1.5",
          label: "p-1.5 text-xs gap-1.5",
          item: "p-1.5 text-sm gap-1.5",
          itemLeadingIcon: "size-5",
          itemLeadingAvatarSize: "2xs",
          itemLeadingChip: "size-5",
          itemLeadingChipSize: "md",
          itemTrailingIcon: "size-5",
          empty: "p-2.5 text-sm"
        },
        lg: {
          base: "px-3 py-2 text-sm gap-2",
          label: "p-2 text-xs gap-2",
          item: "p-2 text-sm gap-2",
          itemLeadingIcon: "size-5",
          itemLeadingAvatarSize: "2xs",
          itemLeadingChip: "size-5",
          itemLeadingChipSize: "md",
          itemTrailingIcon: "size-5",
          empty: "p-3 text-sm"
        },
        xl: {
          base: "px-3 py-2 text-base gap-2",
          label: "p-2 text-sm gap-2",
          item: "p-2 text-base gap-2",
          itemLeadingIcon: "size-6",
          itemLeadingAvatarSize: "xs",
          itemLeadingChip: "size-6",
          itemLeadingChipSize: "lg",
          itemTrailingIcon: "size-6",
          empty: "p-3 text-base"
        }
      },
      position: {
        "popper": {
          content: "data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]"
        },
        "item-aligned": {
          content: ""
        }
      }
    },
    compoundVariants: (prev) => prev.map((item) => ({
      ...item,
      class: typeof item.class === "string" ? replaceFocus$1(item.class) : item.class
    })),
    defaultVariants: {
      position: "popper"
    }
  }, input(options));
};
function replaceFocus$1(str) {
  return str.replace(/focus-visible:/g, "focus:");
}

const selectMenu = (options) => {
  return defuFn({
    slots: {
      input: "border-b border-default",
      focusScope: "flex flex-col min-h-0",
      viewport: "relative scroll-py-1 overflow-y-auto flex-1",
      content: (content) => [content, "origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)"],
      trailingClear: "p-0"
    },
    variants: {
      virtualize: {
        true: {
          viewport: "p-1 isolate"
        },
        false: {
          viewport: "divide-y divide-default"
        }
      }
    },
    compoundVariants: (prev) => prev.map((item) => ({
      ...item,
      class: typeof item.class === "string" ? replaceFocus(item.class) : item.class
    }))
  }, select(options));
};
function replaceFocus(str) {
  return str.replace(/focus:/g, "focus-visible:");
}

const separator = (options) => ({
  slots: {
    root: "flex items-center align-center text-center",
    border: "",
    container: "font-medium text-default flex",
    icon: "shrink-0 size-5",
    avatar: "shrink-0",
    avatarSize: "2xs",
    label: "text-sm"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, { border: `border-${color}` }])),
      neutral: { border: "border-default" }
    },
    orientation: {
      horizontal: {
        root: "w-full flex-row",
        border: "w-full",
        container: "mx-3 whitespace-nowrap"
      },
      vertical: {
        root: "h-full flex-col",
        border: "h-full",
        container: "my-2"
      }
    },
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: ""
    },
    type: {
      solid: {
        border: "border-solid"
      },
      dashed: {
        border: "border-dashed"
      },
      dotted: {
        border: "border-dotted"
      }
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    size: "xs",
    class: { border: "border-t" }
  }, {
    orientation: "horizontal",
    size: "sm",
    class: { border: "border-t-[2px]" }
  }, {
    orientation: "horizontal",
    size: "md",
    class: { border: "border-t-[3px]" }
  }, {
    orientation: "horizontal",
    size: "lg",
    class: { border: "border-t-[4px]" }
  }, {
    orientation: "horizontal",
    size: "xl",
    class: { border: "border-t-[5px]" }
  }, {
    orientation: "vertical",
    size: "xs",
    class: { border: "border-s" }
  }, {
    orientation: "vertical",
    size: "sm",
    class: { border: "border-s-[2px]" }
  }, {
    orientation: "vertical",
    size: "md",
    class: { border: "border-s-[3px]" }
  }, {
    orientation: "vertical",
    size: "lg",
    class: { border: "border-s-[4px]" }
  }, {
    orientation: "vertical",
    size: "xl",
    class: { border: "border-s-[5px]" }
  }],
  defaultVariants: {
    color: "neutral",
    size: "xs",
    type: "solid"
  }
});

const sidebar = (options) => ({
  slots: {
    root: "peer [--sidebar-width:16rem] [--sidebar-width-icon:4rem]",
    gap: "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
    container: "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear lg:flex",
    inner: "flex size-full flex-col overflow-hidden divide-y divide-default",
    header: "flex items-center gap-1.5 overflow-hidden px-4 min-h-(--ui-header-height)",
    wrapper: "min-w-0 flex-1",
    title: "text-highlighted font-semibold truncate",
    description: "text-muted text-sm truncate",
    actions: "flex items-center gap-1.5 shrink-0",
    close: "",
    body: "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4",
    footer: "flex items-center gap-1.5 overflow-hidden p-4",
    rail: ["absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-px lg:flex hover:after:bg-(--ui-border-accented)", options.theme.transitions && "after:transition-colors"]
  },
  variants: {
    side: {
      left: {
        container: "left-0 border-e border-default",
        rail: "end-0 translate-x-1/2"
      },
      right: {
        container: "right-0 border-s border-default",
        rail: "-start-px -translate-x-1/2"
      }
    },
    collapsible: {
      offcanvas: {
        root: "group/sidebar hidden lg:block",
        gap: "data-[state=collapsed]:w-0"
      },
      icon: {
        root: "group/sidebar hidden lg:block",
        gap: "data-[state=collapsed]:w-(--sidebar-width-icon)",
        container: "data-[state=collapsed]:w-(--sidebar-width-icon)",
        actions: "group-data-[state=collapsed]/sidebar:hidden",
        body: "group-data-[state=collapsed]/sidebar:overflow-hidden"
      },
      none: {
        root: "h-full w-(--sidebar-width)"
      }
    },
    variant: {
      sidebar: {},
      floating: {
        container: "p-4 border-transparent",
        inner: "rounded-lg ring ring-default shadow-lg",
        rail: "inset-y-4"
      },
      inset: {
        container: "py-4 border-transparent",
        inner: "divide-transparent",
        rail: "inset-y-4"
      }
    }
  },
  compoundVariants: [{
    side: "left",
    collapsible: ["offcanvas", "icon"],
    class: {
      rail: "cursor-w-resize data-[state=collapsed]:cursor-e-resize"
    }
  }, {
    side: "right",
    collapsible: ["offcanvas", "icon"],
    class: {
      rail: "cursor-e-resize data-[state=collapsed]:cursor-w-resize"
    }
  }, {
    side: "left",
    collapsible: "none",
    class: {
      root: "border-e border-default"
    }
  }, {
    side: "right",
    collapsible: "none",
    class: {
      root: "border-s border-default"
    }
  }, {
    side: "left",
    collapsible: "offcanvas",
    class: {
      container: "data-[state=collapsed]:-left-(--sidebar-width)"
    }
  }, {
    side: "right",
    collapsible: "offcanvas",
    class: {
      container: "data-[state=collapsed]:-right-(--sidebar-width)"
    }
  }, {
    variant: "floating",
    collapsible: "icon",
    class: {
      gap: "data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)+--spacing(8))]",
      container: "data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)+--spacing(8)+2px)]"
    }
  }, {
    variant: "floating",
    collapsible: "none",
    class: {
      root: "p-4 border-0"
    }
  }, {
    variant: "inset",
    collapsible: "none",
    class: {
      root: "py-4 border-0"
    }
  }, {
    variant: "floating",
    side: "left",
    class: {
      rail: "end-4"
    }
  }, {
    variant: "floating",
    side: "right",
    class: {
      rail: "start-[calc(--spacing(4)-1px)]"
    }
  }]
});

const skeleton = {
  base: "animate-pulse rounded-md bg-elevated"
};

const slideover = {
  slots: {
    overlay: "fixed inset-0 bg-elevated/75",
    content: "fixed bg-default divide-y divide-default sm:ring ring-default sm:shadow-lg flex flex-col focus:outline-none",
    header: "flex items-center gap-1.5 p-4 sm:px-6 min-h-(--ui-header-height)",
    wrapper: "",
    body: "flex-1 overflow-y-auto p-4 sm:p-6",
    footer: "flex items-center gap-1.5 p-4 sm:px-6",
    title: "text-highlighted font-semibold",
    description: "mt-1 text-muted text-sm",
    close: "absolute top-4 end-4"
  },
  variants: {
    side: {
      top: {
        content: ""
      },
      right: {
        content: "max-w-md"
      },
      bottom: {
        content: ""
      },
      left: {
        content: "max-w-md"
      }
    },
    inset: {
      true: {
        content: "rounded-lg"
      }
    },
    transition: {
      true: {
        overlay: "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]"
      }
    }
  },
  compoundVariants: [{
    side: "top",
    inset: true,
    class: {
      content: "max-h-[calc(100%-2rem)] inset-x-4 top-4"
    }
  }, {
    side: "top",
    inset: false,
    class: {
      content: "max-h-full inset-x-0 top-0"
    }
  }, {
    side: "right",
    inset: true,
    class: {
      content: "w-[calc(100%-2rem)] inset-y-4 right-4"
    }
  }, {
    side: "right",
    inset: false,
    class: {
      content: "w-full inset-y-0 right-0"
    }
  }, {
    side: "bottom",
    inset: true,
    class: {
      content: "max-h-[calc(100%-2rem)] inset-x-4 bottom-4"
    }
  }, {
    side: "bottom",
    inset: false,
    class: {
      content: "max-h-full inset-x-0 bottom-0"
    }
  }, {
    side: "left",
    inset: true,
    class: {
      content: "w-[calc(100%-2rem)] inset-y-4 left-4"
    }
  }, {
    side: "left",
    inset: false,
    class: {
      content: "w-full inset-y-0 left-0"
    }
  }, {
    transition: true,
    side: "top",
    class: {
      content: "data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-top_200ms_ease-in-out]"
    }
  }, {
    transition: true,
    side: "right",
    class: {
      content: "data-[state=open]:animate-[slide-in-from-right_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-right_200ms_ease-in-out]"
    }
  }, {
    transition: true,
    side: "bottom",
    class: {
      content: "data-[state=open]:animate-[slide-in-from-bottom_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-bottom_200ms_ease-in-out]"
    }
  }, {
    transition: true,
    side: "left",
    class: {
      content: "data-[state=open]:animate-[slide-in-from-left_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-left_200ms_ease-in-out]"
    }
  }]
};

const slider = (options) => ({
  slots: {
    root: "relative flex items-center select-none touch-none",
    track: "relative bg-accented overflow-hidden rounded-full grow",
    range: "absolute rounded-full",
    thumb: "rounded-full bg-default ring-2 focus-visible:outline-2 focus-visible:outline-offset-2"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        range: `bg-${color}`,
        thumb: `ring-${color} focus-visible:outline-${color}/50`
      }])),
      neutral: {
        range: "bg-inverted",
        thumb: "ring-inverted focus-visible:outline-inverted/50"
      }
    },
    size: {
      xs: {
        thumb: "size-3"
      },
      sm: {
        thumb: "size-3.5"
      },
      md: {
        thumb: "size-4"
      },
      lg: {
        thumb: "size-4.5"
      },
      xl: {
        thumb: "size-5"
      }
    },
    orientation: {
      horizontal: {
        root: "w-full",
        range: "h-full"
      },
      vertical: {
        root: "flex-col h-full",
        range: "w-full"
      }
    },
    disabled: {
      true: {
        root: "opacity-75 cursor-not-allowed"
      }
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    size: "xs",
    class: {
      track: "h-[6px]"
    }
  }, {
    orientation: "horizontal",
    size: "sm",
    class: {
      track: "h-[7px]"
    }
  }, {
    orientation: "horizontal",
    size: "md",
    class: {
      track: "h-[8px]"
    }
  }, {
    orientation: "horizontal",
    size: "lg",
    class: {
      track: "h-[9px]"
    }
  }, {
    orientation: "horizontal",
    size: "xl",
    class: {
      track: "h-[10px]"
    }
  }, {
    orientation: "vertical",
    size: "xs",
    class: {
      track: "w-[6px]"
    }
  }, {
    orientation: "vertical",
    size: "sm",
    class: {
      track: "w-[7px]"
    }
  }, {
    orientation: "vertical",
    size: "md",
    class: {
      track: "w-[8px]"
    }
  }, {
    orientation: "vertical",
    size: "lg",
    class: {
      track: "w-[9px]"
    }
  }, {
    orientation: "vertical",
    size: "xl",
    class: {
      track: "w-[10px]"
    }
  }],
  defaultVariants: {
    size: "md",
    color: "primary"
  }
});

const stepper = (options) => ({
  slots: {
    root: "flex gap-4",
    header: "flex",
    item: "group text-center relative w-full",
    container: "relative",
    trigger: "rounded-full font-medium text-center align-middle flex items-center justify-center font-semibold group-data-[state=completed]:text-inverted group-data-[state=active]:text-inverted text-muted bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2",
    indicator: "flex items-center justify-center size-full",
    icon: "shrink-0",
    separator: "absolute rounded-full group-data-[disabled]:opacity-75 bg-accented",
    wrapper: "",
    title: "font-medium text-default",
    description: "text-muted text-wrap",
    content: "size-full"
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex-col",
        container: "flex justify-center",
        separator: "top-[calc(50%-2px)] h-0.5",
        wrapper: "mt-1"
      },
      vertical: {
        header: "flex-col gap-4",
        item: "flex text-start",
        separator: "start-[calc(50%-1px)] -bottom-[10px] w-0.5"
      }
    },
    size: {
      xs: {
        trigger: "size-6 text-xs",
        icon: "size-3",
        title: "text-xs",
        description: "text-xs",
        wrapper: "mt-1.5"
      },
      sm: {
        trigger: "size-8 text-sm",
        icon: "size-4",
        title: "text-xs",
        description: "text-xs",
        wrapper: "mt-2"
      },
      md: {
        trigger: "size-10 text-base",
        icon: "size-5",
        title: "text-sm",
        description: "text-sm",
        wrapper: "mt-2.5"
      },
      lg: {
        trigger: "size-12 text-lg",
        icon: "size-6",
        title: "text-base",
        description: "text-base",
        wrapper: "mt-3"
      },
      xl: {
        trigger: "size-14 text-xl",
        icon: "size-7",
        title: "text-lg",
        description: "text-lg",
        wrapper: "mt-3.5"
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        trigger: `group-data-[state=completed]:bg-${color} group-data-[state=active]:bg-${color} focus-visible:outline-${color}`,
        separator: `group-data-[state=completed]:bg-${color}`
      }])),
      neutral: {
        trigger: `group-data-[state=completed]:bg-inverted group-data-[state=active]:bg-inverted focus-visible:outline-inverted`,
        separator: `group-data-[state=completed]:bg-inverted`
      }
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    size: "xs",
    class: { separator: "start-[calc(50%+16px)] end-[calc(-50%+16px)]" }
  }, {
    orientation: "horizontal",
    size: "sm",
    class: { separator: "start-[calc(50%+20px)] end-[calc(-50%+20px)]" }
  }, {
    orientation: "horizontal",
    size: "md",
    class: { separator: "start-[calc(50%+28px)] end-[calc(-50%+28px)]" }
  }, {
    orientation: "horizontal",
    size: "lg",
    class: { separator: "start-[calc(50%+32px)] end-[calc(-50%+32px)]" }
  }, {
    orientation: "horizontal",
    size: "xl",
    class: { separator: "start-[calc(50%+36px)] end-[calc(-50%+36px)]" }
  }, {
    orientation: "vertical",
    size: "xs",
    class: { separator: "top-[30px]", item: "gap-1.5" }
  }, {
    orientation: "vertical",
    size: "sm",
    class: { separator: "top-[38px]", item: "gap-2" }
  }, {
    orientation: "vertical",
    size: "md",
    class: { separator: "top-[46px]", item: "gap-2.5" }
  }, {
    orientation: "vertical",
    size: "lg",
    class: { separator: "top-[54px]", item: "gap-3" }
  }, {
    orientation: "vertical",
    size: "xl",
    class: { separator: "top-[62px]", item: "gap-3.5" }
  }],
  defaultVariants: {
    size: "md",
    color: "primary"
  }
});

const _switch = (options) => ({
  slots: {
    root: "relative flex items-start",
    base: ["inline-flex items-center shrink-0 rounded-full border-2 border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 data-[state=unchecked]:bg-accented", options.theme.transitions && "transition-[background] duration-200"],
    container: "flex items-center",
    thumb: "group pointer-events-none rounded-full bg-default shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:rtl:-translate-x-0 flex items-center justify-center",
    icon: ["absolute shrink-0 group-data-[state=unchecked]:text-dimmed opacity-0 size-10/12", options.theme.transitions && "transition-[color,opacity] duration-200"],
    wrapper: "ms-2",
    label: "block font-medium text-default",
    description: "text-muted"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        base: `data-[state=checked]:bg-${color} focus-visible:outline-${color}`,
        icon: `group-data-[state=checked]:text-${color}`
      }])),
      neutral: {
        base: "data-[state=checked]:bg-inverted focus-visible:outline-inverted",
        icon: "group-data-[state=checked]:text-highlighted"
      }
    },
    size: {
      xs: {
        base: "w-7",
        container: "h-4",
        thumb: "size-3 data-[state=checked]:translate-x-3 data-[state=checked]:rtl:-translate-x-3",
        wrapper: "text-xs"
      },
      sm: {
        base: "w-8",
        container: "h-4",
        thumb: "size-3.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:rtl:-translate-x-3.5",
        wrapper: "text-xs"
      },
      md: {
        base: "w-9",
        container: "h-5",
        thumb: "size-4 data-[state=checked]:translate-x-4 data-[state=checked]:rtl:-translate-x-4",
        wrapper: "text-sm"
      },
      lg: {
        base: "w-10",
        container: "h-5",
        thumb: "size-4.5 data-[state=checked]:translate-x-4.5 data-[state=checked]:rtl:-translate-x-4.5",
        wrapper: "text-sm"
      },
      xl: {
        base: "w-11",
        container: "h-6",
        thumb: "size-5 data-[state=checked]:translate-x-5 data-[state=checked]:rtl:-translate-x-5",
        wrapper: "text-base"
      }
    },
    checked: {
      true: {
        icon: "group-data-[state=checked]:opacity-100"
      }
    },
    unchecked: {
      true: {
        icon: "group-data-[state=unchecked]:opacity-100"
      }
    },
    loading: {
      true: {
        icon: "animate-spin"
      }
    },
    required: {
      true: {
        label: "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    disabled: {
      true: {
        root: "opacity-75",
        base: "cursor-not-allowed",
        label: "cursor-not-allowed",
        description: "cursor-not-allowed"
      }
    }
  },
  defaultVariants: {
    color: "primary",
    size: "md"
  }
});

const table$1 = (options) => ({
  slots: {
    root: "relative overflow-auto",
    base: "min-w-full",
    caption: "sr-only",
    thead: "relative",
    tbody: "isolate [&>tr]:data-[selectable=true]:hover:bg-elevated/50 [&>tr]:data-[selectable=true]:focus-visible:outline-primary",
    tfoot: "relative",
    tr: "data-[selected=true]:bg-elevated/50",
    th: "px-4 py-3.5 text-sm text-highlighted text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pe-0",
    td: "p-4 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0",
    separator: "absolute z-1 left-0 w-full h-px bg-(--ui-border-accented)",
    empty: "py-6 text-center text-sm text-muted",
    loading: "py-6 text-center"
  },
  variants: {
    virtualize: {
      false: {
        base: "overflow-clip",
        tbody: "divide-y divide-default"
      }
    },
    pinned: {
      true: {
        th: "sticky bg-default/75 z-1",
        td: "sticky bg-default/75 z-1"
      }
    },
    sticky: {
      true: {
        thead: "sticky top-0 inset-x-0 bg-default/75 backdrop-blur z-1",
        tfoot: "sticky bottom-0 inset-x-0 bg-default/75 backdrop-blur z-1"
      },
      header: {
        thead: "sticky top-0 inset-x-0 bg-default/75 backdrop-blur z-1"
      },
      footer: {
        tfoot: "sticky bottom-0 inset-x-0 bg-default/75 backdrop-blur z-1"
      }
    },
    loading: {
      true: {
        thead: "after:absolute after:z-1 after:h-px"
      }
    },
    loadingAnimation: {
      "carousel": "",
      "carousel-inverse": "",
      "swing": "",
      "elastic": ""
    },
    loadingColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((loadingColor) => ({
    loading: true,
    loadingColor,
    class: {
      thead: `after:bg-${loadingColor}`
    }
  })), {
    loading: true,
    loadingColor: "neutral",
    class: {
      thead: "after:bg-inverted"
    }
  }, {
    loading: true,
    loadingAnimation: "carousel",
    class: {
      thead: "after:animate-[carousel_2s_ease-in-out_infinite] rtl:after:animate-[carousel-rtl_2s_ease-in-out_infinite]"
    }
  }, {
    loading: true,
    loadingAnimation: "carousel-inverse",
    class: {
      thead: "after:animate-[carousel-inverse_2s_ease-in-out_infinite] rtl:after:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]"
    }
  }, {
    loading: true,
    loadingAnimation: "swing",
    class: {
      thead: "after:animate-[swing_2s_ease-in-out_infinite]"
    }
  }, {
    loading: true,
    loadingAnimation: "elastic",
    class: {
      thead: "after:animate-[elastic_2s_ease-in-out_infinite]"
    }
  }],
  defaultVariants: {
    loadingColor: "primary",
    loadingAnimation: "carousel"
  }
});

const tabs$1 = (options) => ({
  slots: {
    root: "flex items-center gap-2",
    list: "relative flex p-1 group",
    indicator: "absolute transition-[translate,width] duration-200",
    trigger: ["group relative inline-flex items-center min-w-0 data-[state=inactive]:text-muted hover:data-[state=inactive]:not-disabled:text-default font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75", options.theme.transitions && "transition-colors"],
    leadingIcon: "shrink-0",
    leadingAvatar: "shrink-0",
    leadingAvatarSize: "",
    label: "truncate",
    trailingBadge: "shrink-0",
    trailingBadgeSize: "sm",
    content: "focus:outline-none w-full"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      pill: {
        list: "bg-elevated rounded-lg",
        trigger: "grow",
        indicator: "rounded-md shadow-xs"
      },
      link: {
        list: "border-default",
        indicator: "rounded-full",
        trigger: "focus:outline-none"
      }
    },
    orientation: {
      horizontal: {
        root: "flex-col",
        list: "w-full",
        indicator: "left-0 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position)",
        trigger: "justify-center"
      },
      vertical: {
        list: "flex-col",
        indicator: "top-0 h-(--reka-tabs-indicator-size) translate-y-(--reka-tabs-indicator-position)"
      }
    },
    size: {
      xs: {
        trigger: "px-2 py-1 text-xs gap-1",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs"
      },
      sm: {
        trigger: "px-2.5 py-1.5 text-xs gap-1.5",
        leadingIcon: "size-4",
        leadingAvatarSize: "3xs"
      },
      md: {
        trigger: "px-3 py-1.5 text-sm gap-1.5",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs"
      },
      lg: {
        trigger: "px-3 py-2 text-sm gap-2",
        leadingIcon: "size-5",
        leadingAvatarSize: "2xs"
      },
      xl: {
        trigger: "px-3 py-2 text-base gap-2",
        leadingIcon: "size-6",
        leadingAvatarSize: "xs"
      }
    }
  },
  compoundVariants: [{
    orientation: "horizontal",
    variant: "pill",
    class: {
      indicator: "inset-y-1"
    }
  }, {
    orientation: "horizontal",
    variant: "link",
    class: {
      list: "border-b -mb-px",
      indicator: "-bottom-px h-px"
    }
  }, {
    orientation: "vertical",
    variant: "pill",
    class: {
      indicator: "inset-x-1",
      list: "items-center"
    }
  }, {
    orientation: "vertical",
    variant: "link",
    class: {
      list: "border-s -ms-px",
      indicator: "-start-px w-px"
    }
  }, ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "pill",
    class: {
      indicator: `bg-${color}`,
      trigger: `data-[state=active]:text-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${color}`
    }
  })), {
    color: "neutral",
    variant: "pill",
    class: {
      indicator: "bg-inverted",
      trigger: "data-[state=active]:text-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted"
    }
  }, ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "link",
    class: {
      indicator: `bg-${color}`,
      trigger: `data-[state=active]:text-${color} focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
    }
  })), {
    color: "neutral",
    variant: "link",
    class: {
      indicator: "bg-inverted",
      trigger: "data-[state=active]:text-highlighted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted"
    }
  }],
  defaultVariants: {
    color: "primary",
    variant: "pill",
    size: "md"
  }
});

const textarea = (options) => {
  return defu({
    slots: {
      leading: "absolute start-0 flex items-start",
      trailing: "absolute end-0 flex items-start"
    },
    variants: {
      autoresize: {
        true: {
          base: "resize-none"
        }
      },
      size: {
        xs: {
          leading: "ps-2 inset-y-1",
          trailing: "pe-2 inset-y-1"
        },
        sm: {
          leading: "ps-2.5 inset-y-1.5",
          trailing: "pe-2.5 inset-y-1.5"
        },
        md: {
          leading: "ps-2.5 inset-y-1.5",
          trailing: "pe-2.5 inset-y-1.5"
        },
        lg: {
          leading: "ps-3 inset-y-2",
          trailing: "pe-3 inset-y-2"
        },
        xl: {
          leading: "ps-3 inset-y-2",
          trailing: "pe-3 inset-y-2"
        }
      }
    }
  }, input(options));
};

const timeline = (options) => ({
  slots: {
    root: "flex gap-1.5",
    item: "group relative flex flex-1 gap-3",
    container: "relative flex items-center gap-1.5",
    indicator: "group-data-[state=completed]:text-inverted group-data-[state=active]:text-inverted text-muted",
    separator: "flex-1 rounded-full bg-elevated",
    wrapper: "w-full",
    date: "text-dimmed text-xs/5",
    title: "font-medium text-highlighted text-sm",
    description: "text-muted text-wrap text-sm"
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex-row w-full",
        item: "flex-col",
        separator: "h-0.5"
      },
      vertical: {
        root: "flex-col",
        container: "flex-col",
        separator: "w-0.5"
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        indicator: `group-data-[state=completed]:bg-${color} group-data-[state=active]:bg-${color}`
      }])),
      neutral: {
        indicator: "group-data-[state=completed]:bg-inverted group-data-[state=active]:bg-inverted"
      }
    },
    size: {
      "3xs": "",
      "2xs": "",
      "xs": "",
      "sm": "",
      "md": "",
      "lg": "",
      "xl": "",
      "2xl": "",
      "3xl": ""
    },
    reverse: {
      true: ""
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    reverse: false,
    class: {
      separator: `group-data-[state=completed]:bg-${color}`
    }
  })), ...(options.theme.colors || []).map((color) => ({
    color,
    reverse: true,
    class: {
      separator: `group-data-[state=active]:bg-${color} group-data-[state=completed]:bg-${color}`
    }
  })), {
    color: "neutral",
    reverse: false,
    class: {
      separator: "group-data-[state=completed]:bg-inverted"
    }
  }, {
    color: "neutral",
    reverse: true,
    class: {
      separator: "group-data-[state=active]:bg-inverted group-data-[state=completed]:bg-inverted"
    }
  }, {
    orientation: "horizontal",
    size: "3xs",
    class: {
      wrapper: "pe-4.5"
    }
  }, {
    orientation: "horizontal",
    size: "2xs",
    class: {
      wrapper: "pe-5"
    }
  }, {
    orientation: "horizontal",
    size: "xs",
    class: {
      wrapper: "pe-5.5"
    }
  }, {
    orientation: "horizontal",
    size: "sm",
    class: {
      wrapper: "pe-6"
    }
  }, {
    orientation: "horizontal",
    size: "md",
    class: {
      wrapper: "pe-6.5"
    }
  }, {
    orientation: "horizontal",
    size: "lg",
    class: {
      wrapper: "pe-7"
    }
  }, {
    orientation: "horizontal",
    size: "xl",
    class: {
      wrapper: "pe-7.5"
    }
  }, {
    orientation: "horizontal",
    size: "2xl",
    class: {
      wrapper: "pe-8"
    }
  }, {
    orientation: "horizontal",
    size: "3xl",
    class: {
      wrapper: "pe-8.5"
    }
  }, {
    orientation: "vertical",
    size: "3xs",
    class: {
      wrapper: "-mt-0.5 pb-4.5"
    }
  }, {
    orientation: "vertical",
    size: "2xs",
    class: {
      wrapper: "pb-5"
    }
  }, {
    orientation: "vertical",
    size: "xs",
    class: {
      wrapper: "mt-0.5 pb-5.5"
    }
  }, {
    orientation: "vertical",
    size: "sm",
    class: {
      wrapper: "mt-1 pb-6"
    }
  }, {
    orientation: "vertical",
    size: "md",
    class: {
      wrapper: "mt-1.5 pb-6.5"
    }
  }, {
    orientation: "vertical",
    size: "lg",
    class: {
      wrapper: "mt-2 pb-7"
    }
  }, {
    orientation: "vertical",
    size: "xl",
    class: {
      wrapper: "mt-2.5 pb-7.5"
    }
  }, {
    orientation: "vertical",
    size: "2xl",
    class: {
      wrapper: "mt-3 pb-8"
    }
  }, {
    orientation: "vertical",
    size: "3xl",
    class: {
      wrapper: "mt-3.5 pb-8.5"
    }
  }],
  defaultVariants: {
    size: "md",
    color: "primary"
  }
});

const toast = (options) => ({
  slots: {
    root: "relative group overflow-hidden bg-default shadow-lg rounded-lg ring ring-default p-4 flex gap-2.5 focus:outline-none",
    wrapper: "w-0 flex-1 flex flex-col",
    title: "text-sm font-medium text-highlighted",
    description: "text-sm text-muted",
    icon: "shrink-0 size-5",
    avatar: "shrink-0",
    avatarSize: "2xl",
    actions: "flex gap-1.5 shrink-0",
    progress: "absolute inset-x-0 bottom-0",
    close: "p-0"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        root: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`,
        icon: `text-${color}`
      }])),
      neutral: {
        root: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted",
        icon: "text-highlighted"
      }
    },
    orientation: {
      horizontal: {
        root: "items-center",
        actions: "items-center"
      },
      vertical: {
        root: "items-start",
        actions: "items-start mt-2.5"
      }
    },
    title: {
      true: {
        description: "mt-1"
      }
    }
  },
  defaultVariants: {
    color: "primary"
  }
});

const toaster = {
  slots: {
    viewport: "fixed flex flex-col w-[calc(100%-2rem)] sm:w-96 z-[100] data-[expanded=true]:h-(--height) focus:outline-none",
    base: "pointer-events-auto absolute inset-x-0 z-(--index) transform-(--transform) data-[expanded=false]:data-[front=false]:h-(--front-height) data-[expanded=false]:data-[front=false]:*:opacity-0 data-[front=false]:*:transition-opacity data-[front=false]:*:duration-100 data-[state=closed]:animate-[toast-closed_200ms_ease-in-out] data-[state=closed]:data-[expanded=false]:data-[front=false]:animate-[toast-collapsed-closed_200ms_ease-in-out] data-[state=open]:data-[pulsing=odd]:animate-[toast-pulse-a_300ms_ease-out] data-[state=open]:data-[pulsing=even]:animate-[toast-pulse-b_300ms_ease-out] data-[swipe=move]:transition-none transition-[transform,translate,height] duration-200 ease-out"
  },
  variants: {
    position: {
      "top-left": {
        viewport: "left-4"
      },
      "top-center": {
        viewport: "left-1/2 transform -translate-x-1/2"
      },
      "top-right": {
        viewport: "right-4"
      },
      "bottom-left": {
        viewport: "left-4"
      },
      "bottom-center": {
        viewport: "left-1/2 transform -translate-x-1/2"
      },
      "bottom-right": {
        viewport: "right-4"
      }
    },
    swipeDirection: {
      up: "data-[swipe=end]:animate-[toast-slide-up_200ms_ease-out]",
      right: "data-[swipe=end]:animate-[toast-slide-right_200ms_ease-out]",
      down: "data-[swipe=end]:animate-[toast-slide-down_200ms_ease-out]",
      left: "data-[swipe=end]:animate-[toast-slide-left_200ms_ease-out]"
    }
  },
  compoundVariants: [{
    position: ["top-left", "top-center", "top-right"],
    class: {
      viewport: "top-4",
      base: "top-0 data-[state=open]:animate-[toast-slide-in-from-top_200ms_ease-in-out]"
    }
  }, {
    position: ["bottom-left", "bottom-center", "bottom-right"],
    class: {
      viewport: "bottom-4",
      base: "bottom-0 data-[state=open]:animate-[toast-slide-in-from-bottom_200ms_ease-in-out]"
    }
  }, {
    swipeDirection: ["left", "right"],
    class: "data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x) data-[swipe=end]:translate-x-(--reka-toast-swipe-end-x) data-[swipe=cancel]:translate-x-0"
  }, {
    swipeDirection: ["up", "down"],
    class: "data-[swipe=move]:translate-y-(--reka-toast-swipe-move-y) data-[swipe=end]:translate-y-(--reka-toast-swipe-end-y) data-[swipe=cancel]:translate-y-0"
  }],
  defaultVariants: {
    position: "bottom-right"
  }
};

const tooltip = {
  slots: {
    content: "flex items-center gap-1 bg-default text-highlighted shadow-sm rounded-sm ring ring-default h-6 px-2.5 py-1 text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-tooltip-content-transform-origin) pointer-events-auto",
    arrow: "fill-bg stroke-default",
    text: "truncate",
    kbds: `hidden lg:inline-flex items-center shrink-0 gap-0.5 not-first-of-type:before:content-['\xB7'] not-first-of-type:before:me-0.5`,
    kbdsSize: "sm"
  }
};

const tree = (options) => ({
  slots: {
    root: "relative isolate",
    item: "w-full",
    listWithChildren: "border-s border-default",
    itemWithChildren: "ps-1.5 -ms-px",
    link: "relative group w-full flex items-center text-sm select-none before:absolute before:inset-y-px before:inset-x-0 before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
    linkLeadingIcon: "shrink-0 relative",
    linkLabel: "truncate",
    linkTrailing: "ms-auto inline-flex gap-1.5 items-center",
    linkTrailingIcon: "shrink-0 transform transition-transform duration-200 group-data-expanded:rotate-180"
  },
  variants: {
    virtualize: {
      true: {
        root: "overflow-y-auto"
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        link: `focus-visible:before:ring-${color}`
      }])),
      neutral: {
        link: "focus-visible:before:ring-inverted"
      }
    },
    size: {
      xs: {
        listWithChildren: "ms-4",
        link: "px-2 py-1 text-xs gap-1",
        linkLeadingIcon: "size-4",
        linkTrailingIcon: "size-4"
      },
      sm: {
        listWithChildren: "ms-4.5",
        link: "px-2.5 py-1.5 text-xs gap-1.5",
        linkLeadingIcon: "size-4",
        linkTrailingIcon: "size-4"
      },
      md: {
        listWithChildren: "ms-5",
        link: "px-2.5 py-1.5 text-sm gap-1.5",
        linkLeadingIcon: "size-5",
        linkTrailingIcon: "size-5"
      },
      lg: {
        listWithChildren: "ms-5.5",
        link: "px-3 py-2 text-sm gap-2",
        linkLeadingIcon: "size-5",
        linkTrailingIcon: "size-5"
      },
      xl: {
        listWithChildren: "ms-6",
        link: "px-3 py-2 text-base gap-2",
        linkLeadingIcon: "size-6",
        linkTrailingIcon: "size-6"
      }
    },
    selected: {
      true: {
        link: "before:bg-elevated"
      }
    },
    disabled: {
      true: {
        link: "cursor-not-allowed opacity-75"
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    selected: true,
    class: {
      link: `text-${color}`
    }
  })), {
    color: "neutral",
    selected: true,
    class: {
      link: "text-highlighted"
    }
  }, {
    selected: false,
    disabled: false,
    class: {
      link: ["hover:text-highlighted hover:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"]
    }
  }],
  defaultVariants: {
    color: "primary",
    size: "md"
  }
});

const user = (options) => ({
  slots: {
    root: "relative group/user",
    wrapper: "",
    name: "font-medium",
    description: "text-muted",
    avatar: "shrink-0"
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex items-center"
      },
      vertical: {
        root: "flex flex-col"
      }
    },
    to: {
      true: {
        name: ["text-default peer-hover:text-highlighted peer-focus-visible:text-highlighted", options.theme.transitions && "transition-colors"],
        description: ["peer-hover:text-toned peer-focus-visible:text-toned", options.theme.transitions && "transition-colors"],
        avatar: "transform transition-transform duration-200 group-hover/user:scale-115 group-has-focus-visible/user:scale-115"
      },
      false: {
        name: "text-highlighted",
        description: ""
      }
    },
    size: {
      "3xs": {
        root: "gap-1",
        wrapper: "flex items-center gap-1",
        name: "text-xs",
        description: "text-xs"
      },
      "2xs": {
        root: "gap-1.5",
        wrapper: "flex items-center gap-1.5",
        name: "text-xs",
        description: "text-xs"
      },
      "xs": {
        root: "gap-1.5",
        wrapper: "flex items-center gap-1.5",
        name: "text-xs",
        description: "text-xs"
      },
      "sm": {
        root: "gap-2",
        name: "text-xs",
        description: "text-xs"
      },
      "md": {
        root: "gap-2",
        name: "text-sm",
        description: "text-xs"
      },
      "lg": {
        root: "gap-2.5",
        name: "text-sm",
        description: "text-sm"
      },
      "xl": {
        root: "gap-2.5",
        name: "text-base",
        description: "text-sm"
      },
      "2xl": {
        root: "gap-3",
        name: "text-base",
        description: "text-base"
      },
      "3xl": {
        root: "gap-3",
        name: "text-lg",
        description: "text-base"
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
});

const theme = {
  __proto__: null,
  accordion: accordion$1,
  alert: alert,
  authForm: authForm,
  avatar: avatar,
  avatarGroup: avatarGroup,
  badge: badge$1,
  banner: banner,
  blogPost: blogPost,
  blogPosts: blogPosts,
  breadcrumb: breadcrumb,
  button: button,
  calendar: calendar,
  card: card$1,
  carousel: carousel,
  changelogVersion: changelogVersion,
  changelogVersions: changelogVersions,
  chatMessage: chatMessage,
  chatMessages: chatMessages,
  chatPalette: chatPalette,
  chatPrompt: chatPrompt,
  chatPromptSubmit: chatPromptSubmit,
  chatReasoning: chatReasoning,
  chatShimmer: chatShimmer,
  chatTool: chatTool,
  checkbox: checkbox,
  checkboxGroup: checkboxGroup,
  chip: chip,
  collapsible: collapsible$1,
  colorPicker: colorPicker,
  commandPalette: commandPalette,
  container: container,
  contextMenu: contextMenu,
  dashboardGroup: dashboardGroup,
  dashboardNavbar: dashboardNavbar,
  dashboardPanel: dashboardPanel,
  dashboardResizeHandle: dashboardResizeHandle,
  dashboardSearch: dashboardSearch,
  dashboardSearchButton: dashboardSearchButton,
  dashboardSidebar: dashboardSidebar,
  dashboardSidebarCollapse: dashboardSidebarCollapse,
  dashboardSidebarToggle: dashboardSidebarToggle,
  dashboardToolbar: dashboardToolbar,
  drawer: drawer,
  dropdownMenu: dropdownMenu,
  editor: editor,
  editorDragHandle: editorDragHandle,
  editorEmojiMenu: editorEmojiMenu,
  editorMentionMenu: editorMentionMenu,
  editorSuggestionMenu: editorSuggestionMenu,
  editorToolbar: editorToolbar,
  empty: empty,
  error: error,
  fieldGroup: fieldGroup$1,
  fileUpload: fileUpload,
  footer: footer,
  footerColumns: footerColumns,
  form: form,
  formField: formField,
  header: header,
  input: input,
  inputDate: inputDate,
  inputMenu: inputMenu,
  inputNumber: inputNumber,
  inputTags: inputTags,
  inputTime: inputTime,
  kbd: kbd$1,
  link: link,
  main: main,
  marquee: marquee,
  modal: modal,
  navigationMenu: navigationMenu,
  page: page,
  pageAnchors: pageAnchors,
  pageAside: pageAside,
  pageBody: pageBody,
  pageCTA: pageCta,
  pageCard: pageCard,
  pageColumns: pageColumns,
  pageFeature: pageFeature,
  pageGrid: pageGrid,
  pageHeader: pageHeader,
  pageHero: pageHero,
  pageLinks: pageLinks,
  pageList: pageList,
  pageLogos: pageLogos,
  pageSection: pageSection,
  pagination: pagination,
  pinInput: pinInput,
  popover: popover,
  pricingPlan: pricingPlan,
  pricingPlans: pricingPlans,
  pricingTable: pricingTable,
  progress: progress,
  radioGroup: radioGroup,
  scrollArea: scrollArea,
  select: select,
  selectMenu: selectMenu,
  separator: separator,
  sidebar: sidebar,
  skeleton: skeleton,
  slideover: slideover,
  slider: slider,
  stepper: stepper,
  switch: _switch,
  table: table$1,
  tabs: tabs$1,
  textarea: textarea,
  timeline: timeline,
  toast: toast,
  toaster: toaster,
  tooltip: tooltip,
  tree: tree,
  user: user
};

const a = (options) => ({
  base: ["text-primary border-b border-transparent hover:border-primary font-medium focus-visible:outline-primary focus-visible:has-[>code]:outline-0 [&>code]:border-dashed hover:[&>code]:border-primary hover:[&>code]:text-primary focus-visible:[&>code]:border-primary focus-visible:[&>code]:text-primary", options.theme.transitions && "transition-colors [&>code]:transition-colors"]
});

const accordion = {
  slots: {
    root: "my-5",
    trigger: "text-base"
  }
};

const accordionItem = {
  base: "pb-4 text-muted *:first:mt-0 *:last:mb-0 *:my-1.5"
};

const badge = {
  base: "rounded-full"
};

const blockquote = {
  base: "border-s-4 border-accented ps-4 italic"
};

const callout = (options) => ({
  slots: {
    base: ["group relative block px-4 py-3 rounded-md text-sm/6 my-5 last:mb-0 [&_code]:text-xs/5 [&_code]:bg-default [&_pre]:bg-default [&>div]:my-2.5 [&_ul]:my-2.5 [&_ol]:my-2.5 *:last:mb-0! [&_ul]:ps-4.5 [&_ol]:ps-4.5 [&_li]:my-0", options.theme.transitions && "transition-colors"],
    icon: ["size-4 shrink-0 align-sub me-2 inline-block", options.theme.transitions && "transition-colors"],
    externalIcon: ["size-4 align-top absolute right-2 top-2 pointer-events-none", options.theme.transitions && "transition-colors"]
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        base: `border border-${color}/25 bg-${color}/10 text-${color}-600 dark:text-${color}-300 [&_a]:text-${color} [&_a]:hover:border-${color} [&_a]:focus-visible:outline-${color} [&_code]:text-${color}-600 dark:[&_code]:text-${color}-300 [&_code]:border-${color}/25 [&_a]:hover:[&>code]:border-${color} [&_a]:hover:[&>code]:text-${color} [&_a]:focus-visible:[&>code]:border-${color} [&_a]:focus-visible:[&>code]:text-${color} [&>ul]:marker:text-${color}/50`,
        icon: `text-${color}`,
        externalIcon: `text-${color}-600 dark:text-${color}-300`
      }])),
      neutral: {
        base: "border border-muted bg-muted text-default",
        icon: "text-highlighted",
        externalIcon: "text-dimmed"
      }
    },
    to: {
      true: "border-dashed"
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    to: true,
    class: {
      base: `hover:border-${color} has-focus-visible:border-${color}`,
      externalIcon: `group-hover:text-${color}`
    }
  })), {
    color: "neutral",
    to: true,
    class: {
      base: "hover:border-inverted has-focus-visible:border-inverted",
      externalIcon: "group-hover:text-highlighted"
    }
  }],
  defaultVariants: {
    color: "neutral"
  }
});

const card = (options) => ({
  slots: {
    base: ["group relative block my-5 p-4 sm:p-6 border border-default rounded-md bg-default", options.theme.transitions && "transition-colors"],
    icon: "size-6 mb-2 block",
    title: "text-highlighted font-semibold",
    description: "text-[15px] text-muted *:first:mt-0 *:last:mb-0 *:my-1",
    externalIcon: ["size-4 align-top absolute right-2 top-2 text-dimmed pointer-events-none", options.theme.transitions && "transition-colors"]
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        icon: `text-${color}`
      }])),
      neutral: {
        icon: "text-highlighted"
      }
    },
    to: {
      true: ""
    },
    title: {
      true: {
        description: "mt-1"
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    to: true,
    class: {
      base: `hover:bg-${color}/10 hover:border-${color} has-focus-visible:border-${color}`,
      externalIcon: `group-hover:text-${color}`
    }
  })), {
    color: "neutral",
    to: true,
    class: {
      base: "hover:bg-elevated/50 hover:border-inverted has-focus-visible:border-inverted",
      externalIcon: "group-hover:text-highlighted"
    }
  }],
  defaultVariants: {
    color: "primary"
  }
});

const cardGroup = {
  base: "grid grid-cols-1 sm:grid-cols-2 gap-5 my-5 *:my-0"
};

const code = (options) => ({
  base: "px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block",
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, `border border-${color}/25 bg-${color}/10 text-${color}`])),
      neutral: "border border-muted text-highlighted bg-muted"
    }
  },
  defaultVariants: {
    color: "neutral"
  }
});

const codeCollapse = {
  slots: {
    root: "relative [&_pre]:h-[200px] bg-muted",
    footer: "h-16 absolute inset-x-px bottom-px rounded-b-md flex items-center justify-center",
    trigger: "group",
    triggerIcon: "group-data-[state=open]:rotate-180"
  },
  variants: {
    open: {
      true: {
        root: "[&_pre]:h-auto [&_pre]:min-h-[200px] [&_pre]:max-h-[80vh] [&_pre]:pb-12"
      },
      false: {
        root: "[&_pre]:overflow-hidden",
        footer: "bg-linear-to-t from-muted"
      }
    }
  }
};

const codeGroup = (options) => ({
  slots: {
    root: "relative group *:not-first:my-0! *:not-first:static! my-5",
    list: "relative flex items-center gap-1 border border-muted bg-default border-b-0 rounded-t-md overflow-x-auto p-2",
    indicator: "absolute left-0 inset-y-2 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) transition-[translate,width] duration-200 bg-elevated rounded-md shadow-xs",
    trigger: ["relative inline-flex items-center gap-1.5 text-default data-[state=active]:text-highlighted hover:bg-elevated/50 px-2 py-1.5 text-sm rounded-md disabled:cursor-not-allowed disabled:opacity-75 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary focus:outline-none", options.theme.transitions && "transition-colors"],
    triggerIcon: "size-4 shrink-0",
    triggerLabel: "truncate"
  }
});

const codeIcon = {
  "package.json": "i-vscode-icons-file-type-node",
  "tsconfig.json": "i-vscode-icons-file-type-tsconfig",
  ".npmrc": "i-vscode-icons-file-type-npm",
  ".editorconfig": "i-vscode-icons-file-type-editorconfig",
  ".eslintrc": "i-vscode-icons-file-type-eslint",
  ".eslintrc.cjs": "i-vscode-icons-file-type-eslint",
  ".eslintignore": "i-vscode-icons-file-type-eslint",
  "eslint.config.js": "i-vscode-icons-file-type-eslint",
  "eslint.config.mjs": "i-vscode-icons-file-type-eslint",
  "eslint.config.cjs": "i-vscode-icons-file-type-eslint",
  ".gitignore": "i-vscode-icons-file-type-git",
  "yarn.lock": "i-vscode-icons-file-type-yarn",
  ".env": "i-vscode-icons-file-type-dotenv",
  ".env.example": "i-vscode-icons-file-type-dotenv",
  ".vscode/settings.json": "i-vscode-icons-file-type-vscode",
  "nuxt": "i-vscode-icons-file-type-nuxt",
  ".nuxtrc": "i-vscode-icons-file-type-nuxt",
  ".nuxtignore": "i-vscode-icons-file-type-nuxt",
  "nuxt.config.js": "i-vscode-icons-file-type-nuxt",
  "nuxt.config.ts": "i-vscode-icons-file-type-nuxt",
  "nuxt.schema.ts": "i-vscode-icons-file-type-nuxt",
  "tailwind.config.js": "i-vscode-icons-file-type-tailwind",
  "tailwind.config.ts": "i-vscode-icons-file-type-tailwind",
  "vue": "i-vscode-icons-file-type-vue",
  "ts": "i-vscode-icons-file-type-typescript",
  "tsx": "i-vscode-icons-file-type-typescript",
  "mjs": "i-vscode-icons-file-type-js",
  "cjs": "i-vscode-icons-file-type-js",
  "js": "i-vscode-icons-file-type-js",
  "jsx": "i-vscode-icons-file-type-js",
  "md": "i-vscode-icons-file-type-markdown",
  "py": "i-vscode-icons-file-type-python",
  "cs": "i-vscode-icons-file-type-csharp",
  "asm": "i-vscode-icons-file-type-assembly",
  "f": "i-vscode-icons-file-type-fortran",
  "hs": "i-vscode-icons-file-type-haskell",
  "fs": "i-vscode-icons-file-type-fsharp",
  "kt": "i-vscode-icons-file-type-kotlin",
  "rs": "i-vscode-icons-file-type-rust",
  "rb": "i-vscode-icons-file-type-ruby",
  "lsp": "i-vscode-icons-file-type-lisp",
  "ps1": "i-vscode-icons-file-type-powershell",
  "psd1": "i-vscode-icons-file-type-powershell",
  "psm1": "i-vscode-icons-file-type-powershell",
  "go": "i-vscode-icons-file-type-go",
  "gleam": "i-vscode-icons-file-type-gleam",
  "bicep": "i-vscode-icons-file-type-bicep",
  "bicepparam": "i-vscode-icons-file-type-bicep",
  "exs": "i-vscode-icons-file-type-elixir",
  "erl": "i-vscode-icons-file-type-erlang",
  "sbt": "i-vscode-icons-file-type-scala",
  "h": "i-vscode-icons-file-type-cppheader",
  "ino": "i-vscode-icons-file-type-arduino",
  "pl": "i-vscode-icons-file-type-perl",
  "jl": "i-vscode-icons-file-type-julia",
  "dart": "i-vscode-icons-file-type-dartlang",
  "ico": "i-vscode-icons-file-type-favicon",
  "npm": "i-vscode-icons-file-type-npm",
  "pnpm": "i-vscode-icons-file-type-pnpm",
  "npx": "i-vscode-icons-file-type-npm",
  "yarn": "i-vscode-icons-file-type-yarn",
  "bun": "i-vscode-icons-file-type-bun",
  "deno": "i-vscode-icons-file-type-deno",
  "yml": "i-vscode-icons-file-type-yaml",
  "terminal": "i-lucide-terminal"
};

const codePreview = {
  slots: {
    root: "my-5",
    preview: "flex justify-center border border-muted relative p-4 rounded-md",
    code: "[&>div>pre]:rounded-t-none [&>div]:my-0"
  },
  variants: {
    code: {
      true: {
        preview: "border-b-0 rounded-b-none"
      }
    }
  }
};

const codeTree = (options) => ({
  slots: {
    root: "relative lg:h-[450px] my-5 grid lg:grid-cols-3 border border-muted rounded-md",
    list: "isolate relative p-2 border-b lg:border-b-0 lg:border-e border-muted overflow-y-auto",
    item: "",
    listWithChildren: "ms-4.5 border-s border-default",
    itemWithChildren: "ps-1.5 -ms-px",
    link: "relative group peer w-full px-2.5 py-1.5 before:inset-y-px before:inset-x-0 flex items-center gap-1.5 text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
    linkLeadingIcon: "size-4 shrink-0",
    linkLabel: "truncate",
    linkTrailing: "ms-auto inline-flex gap-1.5 items-center",
    linkTrailingIcon: "size-5 transform transition-transform duration-200 shrink-0 group-data-expanded:rotate-180",
    content: "overflow-hidden lg:col-span-2 flex flex-col [&>div]:my-0 [&>div]:flex-1 [&>div]:flex [&>div]:flex-col [&>div>div]:border-0 [&>div>pre]:border-b-0 [&>div>pre]:border-s-0 [&>div>pre]:border-e-0 [&>div>pre]:rounded-l-none [&>div>pre]:flex-1 [&>div]:overflow-y-auto"
  },
  variants: {
    active: {
      true: {
        link: "text-highlighted before:bg-elevated"
      },
      false: {
        link: ["hover:text-highlighted hover:before:bg-elevated/50", options.theme.transitions && "transition-colors before:transition-colors"]
      }
    }
  }
});

const collapsible = (options) => ({
  slots: {
    root: "my-5",
    trigger: ["group relative rounded-xs inline-flex items-center gap-1.5 text-muted hover:text-default text-sm focus-visible:ring-2 focus-visible:ring-primary focus:outline-none", options.theme.transitions && "transition-colors"],
    triggerIcon: "size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200",
    triggerLabel: "truncate",
    content: "*:first:mt-2.5 *:last:mb-0 *:my-1.5"
  }
});

const em = {
  base: ""
};

const field = {
  slots: {
    root: "my-5",
    container: "flex items-center gap-3 font-mono text-sm",
    name: "font-semibold text-primary",
    wrapper: "flex-1 flex items-center gap-1.5 text-xs",
    required: "rounded-sm bg-error/10 text-error px-1.5 py-0.5",
    type: "rounded-sm bg-elevated text-toned px-1.5 py-0.5",
    description: "mt-3 text-muted text-sm [&_code]:text-xs/4"
  }
};

const fieldGroup = {
  base: "my-5 divide-y divide-default *:not-last:pb-5"
};

const h1 = {
  slots: {
    base: "text-4xl text-highlighted font-bold mb-8 scroll-mt-[calc(45px+var(--ui-header-height))] lg:scroll-mt-(--ui-header-height)",
    link: "inline-flex items-center gap-2"
  }
};

const h2 = (options) => ({
  slots: {
    base: ["relative text-2xl text-highlighted font-bold mt-12 mb-6 scroll-mt-[calc(48px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(48px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-xl/7 [&>a>code]:font-bold", options.theme.transitions && "[&>a>code]:transition-colors"],
    leading: ["absolute -ms-8 top-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated hover:text-primary rounded-md hidden lg:flex text-muted", options.theme.transitions && "transition"],
    leadingIcon: "size-4 shrink-0",
    link: "group lg:ps-2 lg:-ms-2"
  }
});

const h3 = (options) => ({
  slots: {
    base: ["relative text-xl text-highlighted font-bold mt-8 mb-3 scroll-mt-[calc(32px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(32px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-lg/6 [&>a>code]:font-bold", options.theme.transitions && "[&>a>code]:transition-colors"],
    leading: ["absolute -ms-8 top-0.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated hover:text-primary rounded-md hidden lg:flex text-muted", options.theme.transitions && "transition"],
    leadingIcon: "size-4 shrink-0",
    link: "group lg:ps-2 lg:-ms-2"
  }
});

const h4 = {
  slots: {
    base: "text-lg text-highlighted font-bold mt-6 mb-2 scroll-mt-[calc(24px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(24px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary",
    link: ""
  }
};

const hr = {
  base: "border-t border-default my-12"
};

const icon = {
  base: "size-4 shrink-0 align-sub"
};

const img = {
  slots: {
    base: "rounded-md",
    overlay: "fixed inset-0 bg-default/75 backdrop-blur-sm will-change-opacity",
    content: "fixed inset-0 flex items-center justify-center cursor-zoom-out focus:outline-none",
    zoomedImage: "w-full h-auto max-w-[95vw] max-h-[95vh] object-contain rounded-md"
  },
  variants: {
    zoom: {
      true: "will-change-transform"
    },
    open: {
      true: ""
    },
    width: {
      false: "w-full"
    }
  },
  compoundVariants: [{
    zoom: true,
    open: false,
    class: "cursor-zoom-in"
  }]
};

const kbd = {
  base: "align-text-top"
};

const li = {
  base: "my-1.5 ps-1.5 leading-7 [&>ul]:my-0"
};

const ol = {
  base: "list-decimal ps-6 my-5 marker:text-muted"
};

const p = {
  base: "my-5 leading-7 text-pretty"
};

const pre = {
  slots: {
    root: "relative my-5 group",
    header: "flex items-center gap-1.5 border border-muted bg-default border-b-0 relative rounded-t-md px-4 py-3",
    filename: "text-default text-sm/6",
    icon: "size-4 shrink-0",
    copy: "absolute top-[11px] right-[11px] lg:opacity-0 lg:group-hover:opacity-100 transition",
    base: "group font-mono text-sm/6 border border-muted bg-muted rounded-md px-4 py-3 whitespace-pre-wrap wrap-break-word overflow-x-auto focus:outline-none **:[.line]:block **:[.line.highlight]:-mx-4 **:[.line.highlight]:px-4 **:[.line.highlight]:bg-accented/50!"
  },
  variants: {
    filename: {
      true: {
        root: "[&>pre]:rounded-t-none [&>pre]:my-0 my-5"
      }
    }
  }
};

const prompt = {
  slots: {
    root: "relative flex items-center gap-2 border border-muted bg-muted rounded-md px-4 py-3 my-5 last:mb-0",
    icon: "size-4 shrink-0 text-highlighted",
    content: "flex-1 min-w-0",
    description: "text-sm/6 text-default font-medium",
    actions: "flex items-center shrink-0 gap-1.5"
  }
};

const steps = {
  base: "ms-4 border-s border-default ps-8 [counter-reset:step]",
  variants: {
    level: {
      2: "[&>h2]:[counter-increment:step] [&>h2]:relative [&>h2]:before:absolute [&>h2]:before:size-8 [&>h2]:before:bg-elevated [&>h2]:before:rounded-full [&>h2]:before:font-semibold [&>h2]:before:text-sm [&>h2]:before:tabular-nums [&>h2]:before:inline-flex [&>h2]:before:items-center [&>h2]:before:justify-center [&>h2]:before:ring-4 [&>h2]:before:ring-bg [&>h2]:before:-ms-[48.5px] [&>h2]:before:mt-0 [&>h2]:before:content-[counter(step)] [&>h2>a>span.absolute]:hidden",
      3: "[&>h3]:[counter-increment:step] [&>h3]:relative [&>h3]:before:absolute [&>h3]:before:size-7 [&>h3]:before:inset-x-0.5 [&>h3]:before:bg-elevated [&>h3]:before:rounded-full [&>h3]:before:font-semibold [&>h3]:before:text-sm [&>h3]:before:tabular-nums [&>h3]:before:inline-flex [&>h3]:before:items-center [&>h3]:before:justify-center [&>h3]:before:ring-4 [&>h3]:before:ring-bg [&>h3]:before:-ms-[48.5px] [&>h3]:before:content-[counter(step)] [&>h3>a>span.absolute]:hidden",
      4: "[&>h4]:[counter-increment:step] [&>h4]:relative [&>h4]:before:absolute [&>h4]:before:size-7 [&>h4]:before:inset-x-0.5 [&>h4]:before:bg-elevated [&>h4]:before:rounded-full [&>h4]:before:font-semibold [&>h4]:before:text-sm [&>h4]:before:tabular-nums [&>h4]:before:inline-flex [&>h4]:before:items-center [&>h4]:before:justify-center [&>h4]:before:ring-4 [&>h4]:before:ring-bg [&>h4]:before:-ms-[48.5px] [&>h4]:before:content-[counter(step)] [&>h4>a>span.absolute]:hidden"
    }
  },
  defaultVariants: {
    level: "3"
  }
};

const strong = {
  base: ""
};

const table = {
  slots: {
    root: "relative my-5 overflow-x-auto",
    base: "w-full border-separate border-spacing-0 rounded-md"
  }
};

const tabs = {
  slots: {
    root: "my-5 gap-4"
  }
};

const tabsItem = {
  base: "*:first:mt-0 *:last:mb-0 *:my-1.5"
};

const tbody = {
  base: ""
};

const td = {
  base: "py-3 px-4 text-sm align-top border-e border-b first:border-s border-muted [&_code]:text-xs/5 [&_p]:my-0 [&_p]:leading-6 [&_ul]:my-0 [&_ol]:my-0 [&_ul]:ps-4.5 [&_ol]:ps-4.5 [&_li]:leading-6 [&_li]:my-0.5",
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right"
    }
  },
  defaultVariants: {
    align: "left"
  }
};

const th = {
  base: "py-3 px-4 font-semibold text-sm border-e border-b first:border-s border-t border-muted",
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right"
    }
  },
  defaultVariants: {
    align: "left"
  }
};

const thead = {
  base: "bg-muted"
};

const tr = {
  base: "[&:first-child>th:first-child]:rounded-tl-md [&:first-child>th:last-child]:rounded-tr-md [&:last-child>td:first-child]:rounded-bl-md [&:last-child>td:last-child]:rounded-br-md"
};

const ul = {
  base: "list-disc ps-6 my-5 marker:text-(--ui-border-accented)"
};

const themeProse = {
  __proto__: null,
  a: a,
  accordion: accordion,
  accordionItem: accordionItem,
  badge: badge,
  blockquote: blockquote,
  callout: callout,
  card: card,
  cardGroup: cardGroup,
  code: code,
  codeCollapse: codeCollapse,
  codeGroup: codeGroup,
  codeIcon: codeIcon,
  codePreview: codePreview,
  codeTree: codeTree,
  collapsible: collapsible,
  em: em,
  field: field,
  fieldGroup: fieldGroup,
  h1: h1,
  h2: h2,
  h3: h3,
  h4: h4,
  hr: hr,
  icon: icon,
  img: img,
  kbd: kbd,
  li: li,
  ol: ol,
  p: p,
  pre: pre,
  prompt: prompt,
  steps: steps,
  strong: strong,
  table: table,
  tabs: tabs,
  tabsItem: tabsItem,
  tbody: tbody,
  td: td,
  th: th,
  thead: thead,
  tr: tr,
  ul: ul
};

const contentNavigation = (options) => ({
  slots: {
    root: "",
    content: "data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out] overflow-hidden focus:outline-none",
    list: "isolate -mx-2.5 -mt-1.5",
    item: "",
    listWithChildren: "ms-5 border-s border-default",
    itemWithChildren: "flex flex-col data-[state=open]:mb-1.5",
    trigger: "font-semibold",
    link: "group relative w-full px-2.5 py-1.5 before:inset-y-px before:inset-x-0 flex items-center gap-1.5 text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2",
    linkLeadingIcon: "shrink-0 size-5",
    linkTrailing: "ms-auto inline-flex gap-1.5 items-center",
    linkTrailingBadge: "shrink-0",
    linkTrailingBadgeSize: "sm",
    linkTrailingIcon: "size-5 transform transition-transform duration-200 shrink-0 group-data-[state=open]:rotate-180",
    linkTitle: "truncate",
    linkTitleExternalIcon: "size-3 align-top text-dimmed"
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        trigger: `focus-visible:ring-${color}`,
        link: `focus-visible:before:ring-${color}`
      }])),
      neutral: {
        trigger: "focus-visible:ring-inverted",
        link: "focus-visible:before:ring-inverted"
      }
    },
    highlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    variant: {
      pill: "",
      link: ""
    },
    active: {
      true: {
        link: "font-medium"
      },
      false: {
        link: "text-muted",
        linkLeadingIcon: "text-dimmed"
      }
    },
    disabled: {
      true: {
        trigger: "data-[state=open]:text-highlighted"
      }
    },
    highlight: {
      true: {}
    },
    level: {
      true: {
        item: "ps-1.5 -ms-px",
        itemWithChildren: "ps-1.5 -ms-px"
      }
    }
  },
  compoundVariants: [{
    highlight: true,
    level: true,
    class: {
      link: ["after:absolute after:-left-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full", options.theme.transitions && "after:transition-colors"]
    }
  }, {
    disabled: false,
    active: false,
    variant: "pill",
    class: {
      link: ["hover:text-highlighted hover:before:bg-elevated/50 data-[state=open]:text-highlighted", options.theme.transitions && "transition-colors before:transition-colors"],
      linkLeadingIcon: ["group-hover:text-default group-data-[state=open]:text-default", options.theme.transitions && "transition-colors"]
    }
  }, ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "pill",
    active: true,
    class: {
      link: `text-${color}`,
      linkLeadingIcon: `text-${color} group-data-[state=open]:text-${color}`
    }
  })), {
    color: "neutral",
    variant: "pill",
    active: true,
    class: {
      link: "text-highlighted",
      linkLeadingIcon: "text-highlighted group-data-[state=open]:text-highlighted"
    }
  }, {
    variant: "pill",
    active: true,
    highlight: false,
    class: {
      link: "before:bg-elevated"
    }
  }, {
    variant: "pill",
    active: true,
    highlight: true,
    disabled: false,
    class: {
      link: ["hover:before:bg-elevated/50", options.theme.transitions && "before:transition-colors"]
    }
  }, {
    disabled: false,
    active: false,
    variant: "link",
    class: {
      link: ["hover:text-highlighted data-[state=open]:text-highlighted", options.theme.transitions && "transition-colors"],
      linkLeadingIcon: ["group-hover:text-default group-data-[state=open]:text-default", options.theme.transitions && "transition-colors"]
    }
  }, ...(options.theme.colors || []).map((color) => ({
    color,
    variant: "link",
    active: true,
    class: {
      link: `text-${color}`,
      linkLeadingIcon: `text-${color} group-data-[state=open]:text-${color}`
    }
  })), {
    color: "neutral",
    variant: "link",
    active: true,
    class: {
      link: "text-highlighted",
      linkLeadingIcon: "text-highlighted group-data-[state=open]:text-highlighted"
    }
  }, ...(options.theme.colors || []).map((highlightColor) => ({
    highlightColor,
    highlight: true,
    level: true,
    active: true,
    class: {
      link: `after:bg-${highlightColor}`
    }
  })), {
    highlightColor: "neutral",
    highlight: true,
    level: true,
    active: true,
    class: {
      link: "after:bg-inverted"
    }
  }],
  defaultVariants: {
    color: "primary",
    highlightColor: "primary",
    variant: "pill"
  }
});

const contentSearch = {
  slots: {
    modal: "",
    input: ""
  },
  variants: {
    fullscreen: {
      false: {
        modal: "sm:max-w-3xl h-full sm:h-[28rem]"
      }
    },
    size: {
      xs: {},
      sm: {},
      md: {},
      lg: {},
      xl: {}
    }
  },
  defaultVariants: {
    size: "md"
  }
};

const contentSearchButton = {
  slots: {
    base: "",
    label: "",
    trailing: "hidden lg:flex items-center gap-0.5 ms-auto"
  },
  variants: {
    collapsed: {
      true: {
        label: "hidden",
        trailing: "lg:hidden"
      }
    }
  }
};

const contentSurround = (options) => ({
  slots: {
    root: "grid grid-cols-1 sm:grid-cols-2 gap-8",
    link: ["group block px-6 py-8 rounded-lg border border-default hover:bg-elevated/50 focus-visible:outline-primary", options.theme.transitions && "transition-colors"],
    linkLeading: ["inline-flex items-center rounded-full p-1.5 bg-elevated group-hover:bg-primary/10 ring ring-accented mb-4 group-hover:ring-primary/50", options.theme.transitions && "transition"],
    linkLeadingIcon: ["size-5 shrink-0 text-highlighted group-hover:text-primary", options.theme.transitions && "transition-[color,translate]"],
    linkTitle: "font-medium text-[15px] text-highlighted mb-1 truncate",
    linkDescription: "text-sm text-muted line-clamp-2"
  },
  variants: {
    direction: {
      left: {
        linkLeadingIcon: [options.theme.transitions && "group-active:-translate-x-0.5"]
      },
      right: {
        link: "text-end",
        linkLeadingIcon: [options.theme.transitions && "group-active:translate-x-0.5"]
      }
    }
  }
});

const contentToc = (options) => ({
  slots: {
    root: "sticky top-(--ui-header-height) z-10 bg-default/75 lg:bg-[initial] backdrop-blur -mx-4 px-4 sm:px-6 sm:-mx-6 lg:ms-0 overflow-y-auto max-h-[calc(100vh-var(--ui-header-height))]",
    container: "pt-4 sm:pt-6 pb-2.5 sm:pb-4.5 lg:py-8 border-b border-dashed border-default lg:border-0 flex flex-col",
    top: "",
    bottom: "hidden lg:flex lg:flex-col gap-6",
    trigger: "group text-sm font-semibold flex-1 flex items-center gap-1.5 py-1.5 -mt-1.5 focus-visible:outline-primary",
    title: "truncate",
    trailing: "ms-auto inline-flex gap-1.5 items-center",
    trailingIcon: "size-5 transform transition-transform duration-200 shrink-0 group-data-[state=open]:rotate-180 lg:hidden",
    content: "relative data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden focus:outline-none",
    list: "min-w-0",
    listWithChildren: "ms-3",
    item: "min-w-0",
    itemWithChildren: "",
    link: "group relative text-sm flex items-center focus-visible:outline-primary py-1",
    linkText: "truncate",
    indicator: "",
    indicatorLine: "",
    indicatorActive: ""
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, ""])),
      neutral: ""
    },
    highlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color) => [color, {
        indicatorActive: `bg-${color}`
      }])),
      neutral: {
        indicatorActive: "bg-inverted"
      }
    },
    active: {
      false: {
        link: ["text-muted hover:text-default", options.theme.transitions && "transition-colors"]
      }
    },
    highlight: {
      true: ""
    },
    highlightVariant: {
      straight: "",
      circuit: ""
    },
    body: {
      true: {
        bottom: "mt-6"
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color) => ({
    color,
    active: true,
    class: {
      link: `text-${color}`
    }
  })), {
    color: "neutral",
    active: true,
    class: {
      link: "text-highlighted"
    }
  }, {
    highlight: true,
    highlightVariant: "straight",
    class: {
      list: "ms-2.5 ps-4 border-s border-default",
      item: "-ms-px",
      indicator: "absolute ms-2.5 transition-[translate,height] duration-200 h-(--indicator-size) translate-y-(--indicator-position) w-px rounded-full",
      indicatorLine: "hidden",
      indicatorActive: "w-full h-full"
    }
  }, {
    highlight: true,
    highlightVariant: "circuit",
    class: {
      list: "ps-6.5",
      item: "-ms-px",
      itemWithChildren: "ps-px",
      indicator: "absolute ms-2.5 start-0 top-0 rtl:-scale-x-100",
      indicatorLine: "absolute inset-0 bg-(--ui-border)",
      indicatorActive: "absolute w-full h-(--indicator-size) translate-y-(--indicator-position) transition-[translate,height] duration-200 ease-out"
    }
  }],
  defaultVariants: {
    color: "primary",
    highlightColor: "primary",
    highlightVariant: "straight"
  }
});

const themeContent = {
  __proto__: null,
  contentNavigation: contentNavigation,
  contentSearch: contentSearch,
  contentSearchButton: contentSearchButton,
  contentSurround: contentSurround,
  contentToc: contentToc
};

function getTemplates(options, uiConfig, nuxt, resolve) {
  const templates = [];
  let hasProse = false;
  let hasContent = false;
  let previousDetectedComponents;
  function writeThemeTemplate(theme2, path) {
    for (const component in theme2) {
      templates.push({
        filename: `ui/${path ? path + "/" : ""}${kebabCase(component)}.ts`,
        write: true,
        getContents: async () => {
          const template = theme2[component];
          let result = typeof template === "function" ? template(options) : template;
          result = applyDefaultVariants(result, options.theme?.defaultVariants);
          result = applyPrefixToObject(result, options.theme?.prefix);
          const variants = Object.entries(result.variants || {}).filter(([_, values]) => {
            const keys = Object.keys(values);
            return keys.some((key) => key !== "true" && key !== "false");
          }).map(([key]) => key);
          let json = JSON.stringify(result, null, 2);
          for (const variant of variants) {
            json = json.replace(new RegExp(`("${variant}": "[^"]+")`, "g"), `$1 as typeof ${variant}[number]`);
            json = json.replace(new RegExp(`("${variant}": \\[\\s*)((?:"[^"]+",?\\s*)+)(\\])`, "g"), (_, before, match, after) => {
              const replaced = match.replace(/("[^"]+")/g, `$1 as typeof ${variant}[number]`);
              return `${before}${replaced}${after}`;
            });
          }
          function generateVariantDeclarations(variants2) {
            return variants2.filter((variant) => json.includes(`as typeof ${variant}`)).map((variant) => {
              const keys = Object.keys(result.variants[variant]);
              return `const ${variant} = ${JSON.stringify(keys, null, 2)} as const`;
            });
          }
          return [
            ...generateVariantDeclarations(variants),
            `export default ${json}`
          ].join("\n\n");
        }
      });
    }
  }
  if (options.prose || options.mdc || options.content || !!nuxt && (hasNuxtModule("@nuxtjs/mdc") || hasNuxtModule("@nuxt/content"))) {
    hasProse = true;
    const path = "prose";
    writeThemeTemplate(themeProse, path);
    templates.push({
      filename: `ui/${path}/index.ts`,
      write: true,
      getContents: () => Object.keys(themeProse).map((component) => `export { default as ${component} } from './${kebabCase(component)}'`).join("\n")
    });
  }
  if (options.content || !!nuxt && hasNuxtModule("@nuxt/content")) {
    hasContent = true;
    writeThemeTemplate(themeContent, "content");
  }
  writeThemeTemplate(theme);
  async function generateSources() {
    if (!nuxt) {
      return '@source "./ui";';
    }
    const sources = [];
    const layers = getLayerDirectories(nuxt).map((layer) => layer.app);
    for (const layer of layers) {
      sources.push(`@source "${layer}**/*";`);
    }
    const inlineConfigs = [
      nuxt.options.app?.rootAttrs?.class,
      nuxt.options.app?.head?.htmlAttrs?.class,
      nuxt.options.app?.head?.bodyAttrs?.class
    ];
    for (const value of inlineConfigs) {
      if (value && typeof value === "string") {
        sources.push(`@source inline(${JSON.stringify(value)});`);
      }
    }
    if (resolve && options.experimental?.componentDetection) {
      const detectedComponents = await detectUsedComponents(
        layers,
        options.prefix,
        resolve("./runtime/components"),
        Array.isArray(options.experimental.componentDetection) ? options.experimental.componentDetection : void 0
      );
      if (detectedComponents && detectedComponents.size > 0) {
        if (previousDetectedComponents) {
          const newComponents = Array.from(detectedComponents).filter(
            (component) => !previousDetectedComponents.has(component)
          );
          if (newComponents.length > 0) {
            logger.success(`Nuxt UI detected new components: ${newComponents.join(", ")}`);
          }
        } else {
          logger.success(`Nuxt UI detected ${detectedComponents.size} components in use (including dependencies)`);
        }
        previousDetectedComponents = detectedComponents;
        if (hasProse) {
          sources.push('@source "./ui/prose";');
        }
        for (const component of detectedComponents) {
          const kebabComponent = kebabCase(component);
          const camelComponent = camelCase(component);
          if (hasContent && themeContent[camelComponent]) {
            sources.push(`@source "./ui/content/${kebabComponent}.ts";`);
          } else if (theme[camelComponent]) {
            sources.push(`@source "./ui/${kebabComponent}.ts";`);
          }
        }
      } else {
        if (!previousDetectedComponents || previousDetectedComponents.size > 0) {
          logger.info("Nuxt UI detected no components in use, including all components");
        }
        previousDetectedComponents = /* @__PURE__ */ new Set();
        sources.push('@source "./ui";');
      }
    } else {
      sources.push('@source "./ui";');
    }
    return sources.join("\n");
  }
  templates.push({
    filename: "ui.css",
    write: true,
    getContents: async () => {
      const sources = await generateSources();
      const prefix = options.theme?.prefix ? `${options.theme.prefix}:` : "";
      return `${sources}

@layer base {
  body {
    @apply ${prefix}antialiased ${prefix}text-default ${prefix}bg-default ${prefix}scheme-light ${prefix}dark:scheme-dark;
  }
}

@theme static {
  --color-old-neutral-50: ${colors.neutral[50]};
  --color-old-neutral-100: ${colors.neutral[100]};
  --color-old-neutral-200: ${colors.neutral[200]};
  --color-old-neutral-300: ${colors.neutral[300]};
  --color-old-neutral-400: ${colors.neutral[400]};
  --color-old-neutral-500: ${colors.neutral[500]};
  --color-old-neutral-600: ${colors.neutral[600]};
  --color-old-neutral-700: ${colors.neutral[700]};
  --color-old-neutral-800: ${colors.neutral[800]};
  --color-old-neutral-900: ${colors.neutral[900]};
  --color-old-neutral-950: ${colors.neutral[950]};
}

@theme default inline {
  ${[...(options.theme?.colors || []).filter((color) => !colors[color]), "neutral"].map((color) => [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => `--color-${color}-${shade}: var(--ui-color-${color}-${shade});`).join("\n	")).join("\n	")}
  ${options.theme?.colors?.map((color) => `--color-${color}: var(--ui-${color});`).join("\n	")}
  --radius-xs: calc(var(--ui-radius) * 0.5);
  --radius-sm: var(--ui-radius);
  --radius-md: calc(var(--ui-radius) * 1.5);
  --radius-lg: calc(var(--ui-radius) * 2);
  --radius-xl: calc(var(--ui-radius) * 3);
  --radius-2xl: calc(var(--ui-radius) * 4);
  --radius-3xl: calc(var(--ui-radius) * 6);
  --text-color-dimmed: var(--ui-text-dimmed);
  --text-color-muted: var(--ui-text-muted);
  --text-color-toned: var(--ui-text-toned);
  --text-color-default: var(--ui-text);
  --text-color-highlighted: var(--ui-text-highlighted);
  --text-color-inverted: var(--ui-text-inverted);
  --background-color-default: var(--ui-bg);
  --background-color-muted: var(--ui-bg-muted);
  --background-color-elevated: var(--ui-bg-elevated);
  --background-color-accented: var(--ui-bg-accented);
  --background-color-inverted: var(--ui-bg-inverted);
  --background-color-border: var(--ui-border);
  --border-color-default: var(--ui-border);
  --border-color-muted: var(--ui-border-muted);
  --border-color-accented: var(--ui-border-accented);
  --border-color-inverted: var(--ui-border-inverted);
  --border-color-bg: var(--ui-bg);
  --ring-color-default: var(--ui-border);
  --ring-color-muted: var(--ui-border-muted);
  --ring-color-accented: var(--ui-border-accented);
  --ring-color-inverted: var(--ui-border-inverted);
  --ring-color-bg: var(--ui-bg);
  --ring-offset-color-default: var(--ui-border);
  --ring-offset-color-muted: var(--ui-border-muted);
  --ring-offset-color-accented: var(--ui-border-accented);
  --ring-offset-color-inverted: var(--ui-border-inverted);
  --ring-offset-color-bg: var(--ui-bg);
  --divide-color-default: var(--ui-border);
  --divide-color-muted: var(--ui-border-muted);
  --divide-color-accented: var(--ui-border-accented);
  --divide-color-inverted: var(--ui-border-inverted);
  --divide-color-bg: var(--ui-bg);
  --outline-color-default: var(--ui-border);
  --outline-color-inverted: var(--ui-border-inverted);
  --stroke-bg: var(--ui-bg);
  --stroke-default: var(--ui-border);
  --stroke-inverted: var(--ui-border-inverted);
  --fill-bg: var(--ui-bg);
  --fill-default: var(--ui-border);
  --fill-inverted: var(--ui-border-inverted);
}
`;
    }
  });
  templates.push({
    filename: "ui/index.ts",
    write: true,
    getContents: () => [
      ...Object.keys(theme).map((component) => `export { default as ${component} } from './${kebabCase(component)}'`),
      ...hasContent ? Object.keys(themeContent).map((component) => `export { default as ${component} } from './content/${kebabCase(component)}'`) : [],
      ...hasProse ? [`export * as prose from './prose'`] : []
    ].join("\n")
  });
  templates.push({
    filename: "types/ui.d.ts",
    getContents: () => {
      const iconKeys = Object.keys(uiConfig?.icons || {});
      const iconUnion = iconKeys.length ? iconKeys.map((i) => JSON.stringify(i)).join(" | ") : "string";
      return `import * as ui from '#build/ui'
import type { TVConfig } from '@nuxt/ui'
import type { defaultConfig } from 'tailwind-variants'
import colors from 'tailwindcss/colors'

type IconsConfig = Record<${iconUnion} | (string & {}), string>

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'taupe' | 'mauve' | 'mist' | 'olive'
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {})

type AppConfigUI = {
  colors?: {
    ${options.theme?.colors?.map((color) => `'${color}'?: Color`).join("\n		")}
    neutral?: NeutralColor | (string & {})
  }
  icons?: Partial<IconsConfig>
  prefix?: string
  tv?: typeof defaultConfig
} & TVConfig<typeof ui>

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /**
     * Nuxt UI theme configuration
     * @see https://ui.nuxt.com/docs/getting-started/theme/components
     */
    ui?: AppConfigUI
  }
}

export {}
`;
    }
  });
  templates.push({
    filename: "ui-image-component.ts",
    write: true,
    getContents: ({ app }) => {
      const image = app?.components?.find((c) => c.pascalName === "NuxtImg" && !/nuxt(?:-nightly)?\/dist\/app/.test(c.filePath));
      return image ? genExport(image.filePath, [{ name: image.export, as: "default" }]) : 'export default "img"';
    }
  });
  return templates;
}
function addTemplates(options, nuxt, resolve) {
  const templates = getTemplates(options, nuxt.options.appConfig.ui, nuxt, resolve);
  for (const template of templates) {
    if (template.filename.endsWith(".d.ts")) {
      addTypeTemplate(template);
    } else {
      addTemplate(template);
    }
  }
  nuxt.hook("prepare:types", ({ references }) => {
    references.push({ path: resolve("./runtime/types/app.config.d.ts") });
  });
  if (options.experimental?.componentDetection && nuxt.options.dev) {
    nuxt.hook("builder:watch", async (_, path) => {
      if (/\.(?:vue|ts|js|tsx|jsx)$/.test(path)) {
        await updateTemplates({ filter: (template) => template.filename === "ui.css" });
      }
    });
  }
}

const publicComposables = {
  defineLocale: ["defineLocale", "extendLocale"],
  defineShortcuts: ["defineShortcuts", "extractShortcuts"],
  useContentSearch: ["useContentSearch"],
  useFileUpload: ["useFileUpload"],
  useFormField: ["useFormField"],
  useKbd: ["useKbd"],
  useOverlay: ["useOverlay"],
  useResizable: ["useResizable"],
  useScrollShadow: ["useScrollShadow"],
  useScrollspy: ["useScrollspy"],
  useToast: ["useToast"]
};

export { getDefaultConfig as a, addTemplates as b, defaultOptions as d, getTemplates as g, publicComposables as p, resolveColors as r };
