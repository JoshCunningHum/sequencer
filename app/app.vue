<template>
    <Toast position="bottom-right" />
    <DynamicQuery />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
        <Tooltip />
    </ClientOnly>
</template>

<style lang="scss">
html,
body {
    @apply bg-surface-950/50;
}
</style>
