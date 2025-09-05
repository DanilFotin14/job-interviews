<script setup lang="ts">
import { ref } from 'vue'

interface IMenuItem {
  label: string
  icon: string
  path: string
}

const items = ref<IMenuItem[]>([
  {
    label: 'Auth',
    icon: 'pi pi-user',
    path: '/auth',
  },
  {
    label: 'Add',
    icon: 'pi pi-plus',
    path: '/',
  },
  {
    label: 'Interviews list',
    icon: 'pi pi-list',
    path: '/list',
  },
  {
    label: 'Statistics',
    icon: 'pi pi-chart-pie',
    path: '/statistics',
  },
])
</script>

<template>
  <app-menubar :model="items">
    <template #item="{ item, props }">
      <router-link :to="item.path" class="flex align-items-center menu" v-bind="props.action">
        <span :class="item.icon" class="p-menuitem-icon"></span>
        <span class="ml-2">{{ item.label }}</span>
        <!-- <span></span> -->
      </router-link>
    </template>
  </app-menubar>
</template>

<style scoped>
.menu {
  margin: 20px 0;
}
.menu-exit {
  cursor: pointer;
}
</style>
