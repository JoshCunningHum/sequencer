<script lang="ts" setup>
import type { QuerySchemaMeta } from "../DynamicForm/types";
import * as yup from "yup";

const toast = useToast();
const projectStore = useProjectsStore();

//#region Add Project
const { ask } = useQuery();
const addProject = () => {
    ask({
        title: "Add New Project",
        schema: yup.object({
            projectName: yup
                .string()
                .required("Please assign a project name")
                .label("Project Name"),
            class: yup
                .string()
                .optional()
                .label("Class Diagram XML")
                .meta({
                    type: "file",
                    accept: ".xml",
                } as QuerySchemaMeta),
            usecase: yup
                .string()
                .optional()
                .label("Use Case Diagram XML")
                .meta({
                    type: "file",
                    accept: ".xml",
                } as QuerySchemaMeta),
        }),
        joinLabels: true,
        then: async (body) => {
            const { user } = useUserStore();

            const [err, res] = await safeAwait(
                $fetch("/api/projects/add", {
                    method: "POST",
                    body: { ...body, id: user?.id || -1 },
                })
            );

            if (err || typeof res === "string") {
                toast.add({
                    severity: "error",
                    closable: true,
                    life: 3000,
                    summary: "Project creation failed",
                    detail: err || res,
                });
            } else await projectStore.sync();
        },
    });
};
</script>

<template>
    <Button label="Add Project" class="mt-auto" icon="pi pi-plus" @click="addProject" />
</template>
