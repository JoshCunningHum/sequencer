import type { QuerySchemaMeta } from "../components/DynamicForm/types";
import * as yup from "yup";

export default (yup_?: typeof yup) => {
    // Modify yup
    if (!("prompt" in (yup_ || yup).string())) {
        (yup_ || yup).addMethod(
            (yup_ || yup).string,
            "prompt",
            function append(params: QuerySchemaMeta) {
                return this.meta(params);
            },
        );
    }

    if (!("prompt" in (yup_ || yup).number())) {
        (yup_ || yup).addMethod(
            (yup_ || yup).number,
            "prompt",
            function append(params: QuerySchemaMeta) {
                return this.meta(params);
            },
        );
    }

    if (!("prompt" in (yup_ || yup).array())) {
        (yup_ || yup).addMethod(
            (yup_ || yup).array,
            "prompt",
            function append(params: QuerySchemaMeta) {
                return this.meta(params);
            },
        );
    }
};
