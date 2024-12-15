import { QuerySchemaMeta } from "./components/DynamicForm/types.ts";

// globals.d.ts
declare module "yup" {
    interface StringSchema<TType, TContext, TDefault, TFlags> {
        prompt(params: QuerySchemaMeta): this;
    }
    interface NumberSchema<TType, TContext, TDefault, TFlags> {
        prompt(params: QuerySchemaMeta): this;
    }
    interface ArraySchema<TIn, TContext, TDefault, TFlags> {
        prompt(params: QuerySchemaMeta): this;
    }
}
