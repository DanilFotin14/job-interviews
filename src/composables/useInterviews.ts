import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
  where,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview, IStage } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid'

export function useInterviews() {
  const userStore = useUserStore()
  const db = getFirestore()
  const router = useRouter()

  const interviews = ref<IInterview[]>([])
  const interview = ref<IInterview>({} as IInterview)
  const isLoading = ref(false)
  const selectedFilterResult = ref('')

  const getAllInterviews = async (isFilter?: boolean) => {
    let getData
    if (isFilter) {
      getData = query(
        collection(db, `users/${userStore.userId}/interviews`),
        orderBy('createdAt', 'desc'),
        where('result', '==', selectedFilterResult.value),
      )
    } else {
      getData = query(
        collection(db, `users/${userStore.userId}/interviews`),
        orderBy('createdAt', 'desc'),
      )
    }
    const listDocs = await getDocs(getData)
    return listDocs.docs.map((doc) => doc.data() as IInterview)
  }

  const addNewInterview = async (payload: Omit<IInterview, 'id' | 'createdAt'>) => {
    isLoading.value = true
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined),
    )
    const interviewData: IInterview = {
      ...cleanedPayload,
      id: uuidv4(),
      createdAt: new Date(),
      result: 'Refusal',
    } as IInterview
    if (userStore.userId) {
      await setDoc(doc(db, `users/${userStore.userId}/interviews`, interviewData.id), interviewData)
      router.push('/list')
    }
    isLoading.value = false
  }

  const getInterviewById = async (id: string) => {
    isLoading.value = true
    const docref = doc(db, `users/${userStore.userId}/interviews`, id)
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

  const saveInterview = async (id: string, data: IInterview) => {
    isLoading.value = true
    const docref = doc(db, `users/${userStore.userId}/interviews`, id)
    const cleanedData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
    await updateDoc(docref, cleanedData)
    await getInterviewById(id)
    isLoading.value = false
  }

  const submitFilter = async () => {
    isLoading.value = true
    interviews.value = await getAllInterviews(true)
    isLoading.value = false
  }
  const clearFilter = async () => {
    isLoading.value = true
    interviews.value = await getAllInterviews()
    isLoading.value = false
  }

  const removeInterview = async (id: string) => {
    isLoading.value = true
    await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
    interviews.value = await getAllInterviews()
    isLoading.value = false
  }

  return {
    interviews,
    interview,
    isLoading,
    selectedFilterResult,
    getAllInterviews,
    addNewInterview,
    getInterviewById,
    saveInterview,
    submitFilter,
    clearFilter,
    removeInterview,
  }
}
