<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComputedRef } from 'vue'
import { useUserStore } from '@/stores/user'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

interface IMenuItem {
  label: string
  icon: string
  path: string
  show: ComputedRef<boolean>
}

const items = ref<IMenuItem[]>([
  {
    label: 'Auth',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed((): boolean => !userStore.userId),
  },
  {
    label: 'Add',
    icon: 'pi pi-plus',
    path: '/',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    label: 'Interviews list',
    icon: 'pi pi-list',
    path: '/list',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    label: 'Statistics',
    icon: 'pi pi-chart-pie',
    path: '/statistics',
    show: computed((): boolean => !!userStore.userId),
  },
])

const signOutMethod = async (): Promise<void> => {
  await signOut(getAuth()).then(() => router.push('/auth'))
}
</script>

<template>
  <app-menubar :model="items">
    <template #item="{ item, props }">
      <template v-if="item.show">
        <router-link :to="item.path" class="flex align-items-center menu" v-bind="props.action">
          <span :class="item.icon" class="p-menuitem-icon"></span>
          <span class="ml-2">{{ item.label }}</span>
        </router-link>
      </template>
    </template>
    <template #end>
      <span class="flex-align-center menu-exit">
        <span v-if="userStore.userId" class="pi pi-sign-out p-menuitem-icon"> </span>
        <span class="ml-2" @click="signOutMethod()">Exit</span>
      </span>
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
