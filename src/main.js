import { createApp } from 'vue'
import App from './App.vue'
import { Quasar, QInput, QIcon } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

import router from './router'

createApp(App)
    .use(Quasar, {
        plugins: {
            iconSet: {
                iconSet: 'material-icons'
            }
        }
    })
    .use(router)
    .component('q-input', QInput)
    .component('q-icon', QIcon)
    .mount('#app')
