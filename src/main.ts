import './assets/main.css'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { initializeApp } from 'firebase/app'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ProgressSpinner from 'primevue/progressspinner'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyDUVWx5IpIrE_oYiLDl20BORicY38XKdT0',
  authDomain: 'interviews-8a384.firebaseapp.com',
  projectId: 'interviews-8a384',
  storageBucket: 'interviews-8a384.firebasestorage.app',
  messagingSenderId: '1084908862147',
  appId: '1:1084908862147:web:78fc53ed1b26c96ab28076',
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(ToastService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)

app.mount('#app')
