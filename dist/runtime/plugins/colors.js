import { computed } from "vue";
import colors from "tailwindcss/colors";
import { defineNuxtPlugin, useAppConfig, useNuxtApp, useHead } from "#imports";
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
function getColor(color, shade) {
  if (color in colors && typeof colors[color] === "object" && shade in colors[color]) {
    return colors[color][shade];
  }
  return "";
}
function generateShades(key, value, prefix) {
  const prefixStr = prefix ? `${prefix}-` : "";
  return `${shades.map((shade) => `--ui-color-${key}-${shade}: var(--${prefixStr}color-${value === "neutral" ? "old-neutral" : value}-${shade}, ${getColor(value, shade)});`).join("\n  ")}`;
}
function generateColor(key, shade) {
  return `--ui-${key}: var(--ui-color-${key}-${shade});`;
}
export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig();
  const nuxtApp = useNuxtApp();
  const root = computed(() => {
    const { neutral, ...colors2 } = appConfig.ui.colors;
    const prefix = appConfig.ui.prefix;
    return `@layer theme {
  :root, :host {
  ${Object.entries(appConfig.ui.colors).map(([key, value]) => generateShades(key, value, prefix)).join("\n  ")}
  }
  :root, :host, .light {
  ${Object.keys(colors2).map((key) => generateColor(key, 500)).join("\n  ")}
  }
  .dark {
  ${Object.keys(colors2).map((key) => generateColor(key, 400)).join("\n  ")}
  }
}`;
  });
  const headData = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: "critical",
      id: "nuxt-ui-colors"
    }]
  };
  if (import.meta.client && nuxtApp.isHydrating && !nuxtApp.payload.serverRendered) {
    const style = document.createElement("style");
    style.innerHTML = root.value;
    style.setAttribute("data-nuxt-ui-colors", "");
    document.head.appendChild(style);
    headData.script = [{
      innerHTML: "document.head.removeChild(document.querySelector('[data-nuxt-ui-colors]'))"
    }];
  }
  useHead(headData);
});
