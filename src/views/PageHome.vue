<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import type { IInterview } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const db = getFirestore()
const router = useRouter()

const company = ref<string>('')
const vacancyLink = ref<string>('')
const hrName = ref<string>('')
const contactTelegram = ref<string>('')
const contactWhatsApp = ref<string>('')
const contactPhone = ref<string>('')

const loading = ref<boolean>(false)

const addNewInterview = async (): Promise<void> => {
  loading.value = true
  console.log('addNewInterview')
  const payload: IInterview = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactWhatsApp: contactWhatsApp.value,
    contactPhone: contactPhone.value,
    createdAt: new Date(),
    result: 'Refusal',
  }

  if (userStore.userId) {
    await setDoc(doc(db, `users/${userStore.userId}/interviews`, payload.id), payload).then(() => {
      router.push('/list')
    })
  }
}

const disabledSaveButton = computed<boolean>(() => {
  return !company.value || !vacancyLink.value || !hrName.value
})
</script>
<template>
  <section class="content-interview">
    <app-card>
      <template #title>New Interview</template>
      <template #content>
        <app-input-text class="input mb-3" placeholder="Company" v-model="company" />
        <app-input-text
          v-model="vacancyLink"
          class="input mb-3"
          placeholder="Direct link to vacancy"
        />
        <app-input-text v-model="hrName" class="input mb-3" placeholder="Contact HR(Name)" />
        <app-input-text
          v-model="contactTelegram"
          class="input mb-3"
          placeholder="Telegram username HR"
        />
        <app-input-text
          v-model="contactWhatsApp"
          class="input mb-3"
          placeholder="WhatsApp phone number HR"
        />
        <app-input-text v-model="contactPhone" class="input mb-3" placeholder="Телефон HR" />
        <app-button
          @click="addNewInterview"
          label="Create interview"
          :disabled="disabledSaveButton"
          :loading="loading"
        ></app-button>
      </template>
    </app-card>
  </section>
</template>

<style scoped>
.input {
  width: 100%;
}
.content-interview {
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 2rem;
  margin: 2rem auto;
}

.p-card {
  background: transparent;
  box-shadow: none;
}

h1,
h2,
h3 {
  color: #333;
  font-weight: 600;
}
@media (max-width: 900px) {
  .content-interview {
    max-width: 95vw;
    padding: 1rem;
  }
}
@media (max-width: 600px) {
  .content-interview {
    max-width: 100vw;
    padding: 0.5rem;
    margin: 1rem 0;
  }
  h1,
  h2,
  h3 {
    font-size: 1.1rem;
  }
}
</style>
