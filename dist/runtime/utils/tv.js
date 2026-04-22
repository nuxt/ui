import { createTV } from "tailwind-variants";
import appConfig from "#build/app.config";
const appConfigTv = appConfig;
export const tv = /* @__PURE__ */ createTV(appConfigTv.ui?.tv);
