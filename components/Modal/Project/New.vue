<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { set } from "@vueuse/core";
import { useProjectsStore } from "../../../stores/projects";

// Modal show
const open = defineModel<boolean>({ default: false });

// Store
const projectStore = useProjectsStore();

// Creation Form
interface FormData {
    name?: string;
    class?: string;
    usecase?: string;
}

const state = reactive<FormData>({});

const schema = object({
    name: string().required("You have to assign a name"),
    class: string(),
    usecase: string(),
});

type Schema = InferType<typeof schema>;

const handleFile = async (f: FileList, by: "class" | "usecase") => {
    state[by] = await f[0].text();
};

// Handle submitting along with loading and prevent of closing the modal
const isCreating = ref(false);

const submit = async (ev: FormSubmitEvent<Schema>) => {
    set(isCreating, true);
    const { data } = ev;
    await projectStore.add(data.name, data.class, data.usecase);
    set(isCreating, false);
    set(open, false);
};

// Clear values when opening
watch(open, (v) => {
    if (!v) return;
    state.name = "";
    state.class = "";
    state.usecase = "";
});
</script>

<template>
    <UModal
        v-model="open"
        :prevent-close="isCreating"
        class="z-50"
    >
        <UCard class="DMSans">
            <template #header>
                <div class="text-xl font-semibold">New Project</div>
            </template>

            <UForm
                @submit="submit"
                :state="state"
                :schema="schema"
                class="flex flex-col gap-2"
            >
                <UFormGroup
                    label="Project Name"
                    name="name"
                >
                    <UInput v-model="state.name" />
                </UFormGroup>
                <UFormGroup
                    name="usecase"
                    label="Class Diagram XML"
                    hint="Optional"
                >
                    <UInput
                        type="file"
                        accept=".xml"
                        @change="(f: FileList) => handleFile(f, 'usecase')"
                    />
                </UFormGroup>
                <UFormGroup
                    label="Use Case Diagram XML"
                    name="class"
                    hint="Optional"
                >
                    <UInput
                        type="file"
                        accept=".xml"
                        @change="(f: FileList) => handleFile(f, 'class')"
                    />
                </UFormGroup>
                <div class="flex justify-end pt-4">
                    <UButton
                        icon="i-mdi-plus"
                        type="submit"
                        :loading="isCreating"
                        >Create</UButton
                    >
                </div>
            </UForm>
        </UCard>
    </UModal>
</template>

<style lang="scss" scoped></style>
