import type { QuerySchemaMeta } from "../components/DynamicForm/types";
import * as yup from "yup";
import _addprompt from "../utils/_addprompt.ts";

export default defineNuxtPlugin((nuxtApp) => {
    _addprompt(yup);
    console.log(`Yup modified`);
});
