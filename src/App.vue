<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from './stores/user'
import AppHeader from '@/components/AppHeader.vue'

const userStore = useUserStore()

const isLoading = ref<boolean>(true)

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ''
    }
    isLoading.value = false
  })
})
</script>

<template>
  <app-progress v-if="isLoading" />
  <div v-else class="container">
    <header>
      <AppHeader />
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.container {
  margin: 0 auto;
  max-width: 1200px;
  padding: 20px;
  box-sizing: border-box;
}
</style>
