import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './assets/css/base.scss'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import { mdi, aliases } from 'vuetify/iconsets/mdi'
import { fa } from 'vuetify/iconsets/fa'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      fa,
      mdi,
    },
  },
})
const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(vuetify)
app.mount('#app')
