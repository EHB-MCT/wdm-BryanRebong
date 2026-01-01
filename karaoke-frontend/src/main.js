import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useMicrophone } from './composables/useMicrophone.js'

const app = createApp(App)
app.use(router)

const { startMicrophone } = useMicrophone()
startMicrophone()

app.mount('#app')
