<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInterviews } from '@/composables/useInterviews'

const company = ref('')
const vacancyLink = ref('')
const hrName = ref('')
const contactTelegram = ref('')
const contactWhatsApp = ref('')
const contactPhone = ref('')

const { addNewInterview, isLoading } = useInterviews()

const disabledSaveButton = computed(() => {
  return !company.value || !vacancyLink.value || !hrName.value
})

const handleAddInterview = async () => {
  await addNewInterview({
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactWhatsApp: contactWhatsApp.value,
    contactPhone: contactPhone.value,
    stages: [],
    salaryFrom: undefined,
    salaryTo: undefined,
    result: 'Refusal',
  })
}
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
        <app-input-text v-model="hrName" class="input mb-3" placeholder="HR name" />
        <app-input-text
          v-model="contactTelegram"
          class="input mb-3"
          placeholder="HR Telegram usernam"
        />
        <app-input-text
          v-model="contactWhatsApp"
          class="input mb-3"
          placeholder="HR WhatsApp phone number"
        />
        <app-input-text v-model="contactPhone" class="input mb-3" placeholder="HR phone number" />
        <app-button
          @click="handleAddInterview"
          label="Create interview"
          :disabled="disabledSaveButton"
          :loading="isLoading"
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
