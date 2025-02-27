import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'
import '@quasar/extras/eva-icons/eva-icons.css'
import '@quasar/extras/themify/themify.css'
import '@quasar/extras/line-awesome/line-awesome.css'
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css'

import 'quasar/src/css/index.sass'

import {
  Quasar,
  QLayout,
  QHeader,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QDrawer,
  QList,
  QItem,
  QItemSection,
  QPageContainer,
  QToggle,
  Ripple
} from 'quasar'
import quasarLang from 'quasar/lang/ru'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(pinia)

app.use(Quasar, {
  lang: quasarLang,
  config: {},
  components: {
    QLayout,
    QHeader,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QDrawer,
    QList,
    QItem,
    QItemSection,
    QPageContainer,
    QToggle
  },
  directives: {
    Ripple
  }
})

app.mount('#app')
