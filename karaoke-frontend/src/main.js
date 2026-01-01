import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useMicrophone } from './composables/useMicrophone.js'
import './style.css'

const app = createApp(App)
app.use(router)

// Auto-start microphone on app load
const { startMicrophone } = useMicrophone()
startMicrophone()

app.mount('#app')
