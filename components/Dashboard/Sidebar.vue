<script setup lang="ts">
const { data: user } = await useFetch("/api/me", { lazy: true });
const { data, status, refresh } = await useFetch("/api/projects", {
    method: "post",
    body: { id: user.value.id },
    lazy: true,
    immediate: false,
});

watchImmediate(user, () => refresh());
</script>

<template>
    <div class="border-r border-surface-600 px-2 py-2 flex flex-col min-w-[225px]">
        <Loader :finished="status !== 'pending' && user">
            <div></div>
            <Empty v-if="data?.length === 0" text="No projects" class="text-surface-400" />
        </Loader>
        <Button label="Add Project" class="mt-auto" icon="pi pi-plus" />
    </div>
</template>

<style lang="scss" scoped></style>
