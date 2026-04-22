import { usePage } from "@inertiajs/vue3";
export * from "./base.js";
export const useRoute = () => {
  const page = usePage();
  return {
    fullPath: page.url
  };
};
export const useRouter = () => {
};
