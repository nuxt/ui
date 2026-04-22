import { reactive } from "vue";
import appConfig from "#build/app.config";
const _appConfig = reactive(appConfig);
export const useAppConfig = () => _appConfig;
