<script setup lang="ts">
definePageMeta({
  layout: 'app',
  middleware: ["auth"],
});

const {pushBreadcrumb, resetToBase} = useBreadcrumbs()
const {t} = useI18n({
  useScope: 'local',
})

onBeforeMount(() => {
  pushBreadcrumb({
    id: 'modules',
    title: t('title')
  })
})

onBeforeUnmount(() => {
  resetToBase()
})
</script>

<template>
  <NuxtPage/>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Temporary voice"
  },
  "uk": {
    "title": "Авто-кімнати"
  }
}
</i18n>