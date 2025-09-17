<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'

const userStore = useUserStore()
const db = getFirestore()
const interviews = ref<IInterview[]>([])
const chartData = ref()
const chartOptions = ref()

onMounted(async () => {
  interviews.value = await getAllInterviews()
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const getAllInterviews = async <T extends IInterview>(): Promise<T[]> => {
  let getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc'),
  )

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body)

  const data: number[] = [0, 0, 0]
  interviews.value.forEach((interview: IInterview) => {
    if (interview.result === 'Offer') {
      data[0]++
    } else if (interview.result === 'Refusal') {
      data[1]++
    } else {
      data[2]++
    }
  })

  return {
    labels: ['Offer', 'Refusal', 'In progress'],
    datasets: [
      {
        data,
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
          documentStyle.getPropertyValue('--p-gray-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-400'),
          documentStyle.getPropertyValue('--p-orange-400'),
          documentStyle.getPropertyValue('--p-gray-400'),
        ],
      },
    ],
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')

  return {
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          color: textColor,
        },
      },
    },
  }
}
</script>

<template>
  <section class="statistics-container">
    <header>
      <h1>Statistics</h1>
    </header>
    <div class="card flex justify-content-center">
      <app-chart
        type="doughnut"
        :data="chartData"
        :options="chartOptions"
        class="w-full md:w-30rem"
      />
    </div>
  </section>
</template>

<style scoped>
.statistics-container {
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 2rem;
  margin: 2rem auto;
}
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}
@media (max-width: 900px) {
  .statistics-container {
    padding: 1rem;
  }
}
@media (max-width: 600px) {
  .statistics-container {
    padding: 0.5rem;
    margin: 1rem 0;
  }
  .card {
    padding: 0.5rem;
  }
}
</style>
