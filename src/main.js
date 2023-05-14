import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import 'quasar/dist/quasar.css'

import router from './router'

createApp(App)
    .use(Quasar)
    .use(router)
    .mount('#app')
