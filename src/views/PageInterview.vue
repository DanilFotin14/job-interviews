<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview, IStage } from '@/interfaces'

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()

const isLoading = ref<boolean>(true)
const interview = ref<IInterview>({} as IInterview)

const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)

  if (docSnap.exists()) {
    const data = docSnap.data() as IInterview
    if (data.stages && data.stages.length) {
      data.stages = data.stages.map((stage: IStage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return {
            ...stage,
            date: stage.date.toDate(),
          }
        }
        return stage
      })
    }
    interview.value = data
  }
  isLoading.value = false
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true
  await updateDoc(docref, interview.value)
  await getData()
  isLoading.value = false
}

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages?.push({ name: '', date: null, description: '' } as IStage)
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

onMounted(async () => await getData())
</script>

<template>
  <app-progress v-if="isLoading" />
  <div v-else-if="interview?.id && !isLoading" class="content-interview">
    <app-card>
      <template #title>Interview at company {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Company</label>
          <app-input-text
            v-model="interview.company"
            class="input mb-3"
            id="company"
            placeholder="Company"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Vacancy description {link}</label>
          <app-input-text
            v-model="interview.vacancyLink"
            class="input mb-3"
            id="vacancyLink"
            placeholder="Company"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="hrContact">Contact {name}</label>
          <app-input-text
            v-model="interview.hrName"
            class="input mb-3"
            id="hrContact"
            placeholder="Company"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactWhatsApp">WhatsApp HR</label>
          <app-input-text
            v-model="interview.contactWhatsApp"
            class="input mb-3"
            id="contactWhatsApp"
            placeholder="Company"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Telegram HR</label>
          <app-input-text
            v-model="interview.contactTelegram"
            class="input mb-3"
            id="contactTelegram"
            placeholder="Company"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactPhone">HR phone</label>
          <app-input-text
            v-model="interview.contactPhone"
            class="input mb-3"
            id="contactPhone"
            placeholder="Company"
          />
        </div>
        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <app-input-number
              v-model="interview.salaryFrom"
              inputId="salaryForm"
              placeholder="Salary from"
            />
          </div>
          <div class="flex-auto">
            <app-input-number
              v-model="interview.salaryTo"
              inputId="salaryTo"
              placeholder="Salary to"
            />
          </div>
        </div>

        <app-button
          @click="addStage()"
          label="Add new"
          severity="info"
          icon="pi pi-plus"
          class="mb-3"
        />
        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
            <div class="flex flex-column gap-2">
              <label :for="`stage-name-${index}`">Stage name</label>
              <app-input-text
                v-model="stage.name"
                class="input mb-3"
                :id="`stage-name-${index}`"
                placeholder="Stage name"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-date-${index}`">Date of stage</label>
              <app-calendar
                v-model="stage.date"
                class="input mb-3"
                :id="`stage-date-${index}`"
                placeholder="Date"
                dateFormat="dd.mm.yy"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-description-${index}`">Description</label>
              <app-textarea
                v-model="stage.description"
                class="input mb-3"
                :id="`stage-description-${index}`"
                placeholder="Description"
                rows="5"
              />
              <app-button
                @click="removeStage(index)"
                label="Delete stage"
                severity="danger"
                class="mb-3"
              />
            </div>
          </div>
        </template>
        <div class="flex flex-wrap gap-3 mb-3">
          <div class="flex align-items-center">
            <app-radio
              v-model="interview.result"
              inputId="interviewResult1"
              name="result"
              value="Refusal"
            />
            <label for="interviewResult1" class="ml-2">Job refusal</label>
          </div>
          <div class="flex align-items-center">
            <app-radio
              v-model="interview.result"
              inputId="interviewResult2"
              name="result"
              value="Offer"
            />
            <label for="interviewResult2" class="ml-2">Job offer</label>
          </div>
          <div>
            <app-button @click="saveInterview" label="Save" severity="success" class="mb-3" />
          </div>
        </div>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
