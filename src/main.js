import { createApp } from "vue"
import { createPinia } from 'pinia'
import App from "./App.vue"
import router from "./router"
import "./style.css"

const app = createApp(App)
const pinia = createPinia()

// Register plugins in order
app.use(pinia)   // ✅ Pinia must be registered before router (router uses auth store)
app.use(router)  // ✅ Router registered after Pinia

app.mount("#app")