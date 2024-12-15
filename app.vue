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
