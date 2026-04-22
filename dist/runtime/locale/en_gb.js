import { defineLocale } from "../composables/defineLocale.js";
import en from "./en.js";
export default defineLocale({
  name: "English (United Kingdom)",
  code: "en-GB",
  messages: en.messages
});
