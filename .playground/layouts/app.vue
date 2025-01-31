<template>
  <DashboardLayout>
    <template #auth>
      <AuthButton />
    </template>
    <template #modules>
      <ModulesList :all-modules-enabled="true"/>
    </template>
    <slot />
  </DashboardLayout>
</template>
<script setup lang="ts">
</script>