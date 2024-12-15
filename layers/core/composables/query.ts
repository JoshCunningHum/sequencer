import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import * as yup from "yup";
import type {
    ConfirmParams,
    QueryInfer,
    QueryState,
} from "../components/DynamicForm/types";

// Prompt Store
export interface QueryClosures {
    show: (state: QueryState) => void;
}

const useQueryStore = defineStore("query", () => {
    const closures = ref<Partial<QueryClosures>>({});
    return { closures };
});

// Composable
export const useQuery = (args?: QueryState) => {
    const store = useQueryStore();
    const { closures } = storeToRefs(store);

    // Executed when query is loaded, should be used to initialize closures
    const __load__ = (cbs: Partial<QueryClosures>) => {
        closures.value = cbs;
    };

    const ask = <Schema extends yup.AnyObject>(
        cb: (y: typeof yup) => ConfirmParams<Schema>,
    ): Promise<
        | (Schema extends Record<string, never> ? true : QueryInfer<Schema>)
        | null
    > => {
        // Wait for the confirm/accept button
        return new Promise((resolve, reject) => {
            // Make sure that the closure is mounted (the dynamic query component is mounted)
            if (closures.value.show) {
                // Open Dynamic query
                closures.value.show(
                    Object.assign(
                        // Apply default value
                        <QueryState>{
                            approveText: "Confirm",
                            rejectText: "Cancel",
                            approve: (data) => {
                                resolve(
                                    data as Schema extends Record<string, never>
                                        ? true
                                        : QueryInfer<Schema>,
                                );
                            },
                            confirm: () => {
                                resolve(
                                    true as Schema extends Record<string, never>
                                        ? true
                                        : QueryInfer<Schema>,
                                );
                            },
                            reject: () => {
                                resolve(null);
                            },
                        },
                        // Apply the useQuery params
                        args || {},
                        // Apply the custom object of the ask() fn
                        cb(yup),
                    ),
                );
            } else {
                reject(
                    new Error(
                        "No show closure found. Make sure DynamicQuery is mounted.",
                    ),
                );
            }
        });
    };

    return {
        __load__,
        ask,
    };
};
