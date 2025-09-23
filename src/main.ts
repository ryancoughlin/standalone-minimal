import { createApp } from 'vue'
import { createPinia } from 'pinia'
import DemoLibrary from './components/DemoLibrary.vue'
import './style.css'

const app = createApp(DemoLibrary)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
