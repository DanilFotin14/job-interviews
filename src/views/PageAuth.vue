<script setup lang="ts">
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const toast = useToast()

const isLogin = ref<boolean>(true)
const email = ref<string>('')
const password = ref<string>('')
const isLoading = ref<boolean>(false)

const router = useRouter()

const toggleAuth = () => {
  isLogin.value = !isLogin.value
}

const subtitleText = computed<string>(() => {
  return isLogin.value ? 'Sign in to your account' : 'Create your account'
})

const linkAccountText = computed<string>(() => {
  return isLogin.value ? ' Create account' : 'Sign in'
})

const submitButtonText = computed<string>(() => {
  return isLogin.value ? 'Sign in' : 'Create account'
})

const signUp = async (): Promise<void> => {
  isLoading.value = true
  try {
    await createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    // router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000,
      })
    }
  } finally {
    isLoading.value = false
  }
}

const signIn = async (): Promise<void> => {
  isLoading.value = true
  try {
    await signInWithEmailAndPassword(getAuth(), email.value, password.value)
    router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000,
      })
    }
  } finally {
    isLoading.value = false
  }
}

const submitForm = (): void => {
  if (isLogin.value) {
    signIn()
  } else {
    signUp()
  }
}
</script>
<template>
  <app-toast position="bottom-right" />
  <section class="flex justify-content-center mt-5">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <header class="text-center mb-3">
        <div class="text-900 text-3xl font-medium mb-3">Hello!</div>
        <span class="text-600 font-medium line-height-3">{{ subtitleText }}</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer" @click="toggleAuth">
          {{ linkAccountText }}
        </a>
      </header>
      <form @submit.prevent="submitForm" class="auth-form">
        <label for="email1" class="block text-900 font-medium mb-2">Email</label>
        <app-input-text v-model="email" id="email1" type="email" class="w-full mb-3" />
        <label for="password1" class="block text-900 font-medium mb-2">Password</label>
        <app-input-text v-model="password" id="password1" type="password" class="w-full mb-3" />
        <app-button
          :label="submitButtonText"
          type="submit"
          icon="pi pi-user"
          :loading="isLoading"
          class="w-full"
        ></app-button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.auth-container {
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 400px;
}
.auth-form label {
  color: #333;
  font-weight: 500;
}
.auth-form .app-input-text {
  margin-bottom: 1rem;
}
.auth-form .app-button {
  margin-top: 1rem;
}
@media (max-width: 600px) {
  .auth-container {
    max-width: 100vw;
    padding: 1rem;
    margin: 1rem 0;
  }
  .auth-form label {
    font-size: 0.95rem;
  }
}
</style>
