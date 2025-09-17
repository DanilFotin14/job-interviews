<script setup lang="ts">
import { onMounted } from 'vue'
import { useInterviews } from '@/composables/useInterviews'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()
const {
  interviews,
  isLoading,
  selectedFilterResult,
  submitFilter,
  clearFilter,
  removeInterview,
  getAllInterviews,
} = useInterviews()

onMounted(async () => {
  interviews.value = await getAllInterviews()
})

const confirmRemoveInterview = async (id: string) => {
  confirm.require({
    message: 'Do you want to delete this interview?',
    header: 'Interview deletion',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await removeInterview(id)
    },
  })
}
</script>

<template>
  <app-dialog />
  <app-progress v-if="isLoading" />
  <section v-else class="list-container">
    <header>
      <h1>Interviews</h1>
    </header>
    <div class="flex align-items-center mb-5">
      <div class="flex align-items-center mr-2">
        <app-radio
          inputId="interviewResult1"
          name="result"
          value="Refusal"
          v-model="selectedFilterResult"
        />
        <label for="interviewResult1" class="ml-2">Refusal</label>
      </div>
      <div class="flex align-items-center mr-2">
        <app-radio
          inputId="interviewResult2"
          name="result"
          value="Offer"
          v-model="selectedFilterResult"
        />
        <label for="interviewResult2" class="ml-2">Offer</label>
      </div>
      <app-button class="mr-2" @click="submitFilter" :disabled="!selectedFilterResult"
        >Применить</app-button
      >
      <app-button severity="danger" :disabled="!selectedFilterResult" @click="clearFilter"
        >Сбросить</app-button
      >
    </div>

    <app-datatable :value="interviews">
      <app-column field="company" header="Company"></app-column>
      <app-column field="hrName" header="HR name"></app-column>
      <app-column field="vacancyLink" header="Vacancy">
        <template #body="slotProps">
          <a :href="`/interview/${slotProps.data.vacancyLink}`" target="_blank">Vacancy link</a>
        </template>
      </app-column>
      <app-column header="Contacts">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>
            <a
              v-if="slotProps.data.contactWhatsApp"
              :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
              target="_blank"
              class="contacts__whatsapp"
            >
              <span class="contacts__icon pi pi-whatsapp"></span>
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`https://tel:${slotProps.data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </app-column>
      <app-column header="Stages">
        <template #body="slotProps">
          <span v-if="!slotProps.data.stages">Unknown</span>
          <div v-else class="interview-stages">
            <app-badge
              v-for="(stage, i) in slotProps.data.stages"
              :key="i"
              :value="i + 1"
              rounded
              v-tooltip.top="stage.name"
            />
          </div>
        </template>
      </app-column>
      <app-column header="Salary">
        <template #body="slotProps">
          <span v-if="!slotProps.data.salaryFrom">Unknown</span>
          <span v-else>{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span>
        </template>
      </app-column>

      <app-column header="Result">
        <template #body="slotProps">
          <span v-if="!slotProps.data.result">Unknown</span>
          <template v-else>
            <app-badge
              :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"
              :value="slotProps.data.result === 'Offer' ? 'Offer' : 'Refusal'"
            />
          </template>
        </template>
      </app-column>
      <app-column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <app-button icon="pi pi-pencil" severity="info" />
            </router-link>
            <app-button
              icon="pi pi-trash"
              severity="danger"
              @click="() => confirmRemoveInterview(slotProps.data.id)"
            />
          </div>
        </template>
      </app-column>
    </app-datatable>
  </section>
</template>

<style scoped>
.list-container {
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 2rem;
  margin: 2rem auto;
}
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
@media (max-width: 1100px) {
  .list-container {
    padding: 1rem;
  }
}
@media (max-width: 700px) {
  .list-container {
    padding: 0.5rem;
    margin: 1rem 0;
  }
  .contacts {
    gap: 10px;
  }
  .interview-stages {
    gap: 2px;
  }
}
</style>
