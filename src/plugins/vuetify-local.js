/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
import { createVuetify } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#C62828',
          secondary: '#90A4AE',
          accent: '#5C6BC0',
          error: '#db564c',
          warning: '#fcf3a1',
          info: '#2196f3',
          success: '#4caf50',
        },
      },
      dark: {
        colors: {
          primary: '#C62828',
          secondary: '#90A4AE',
          accent: '#5C6BC0',
          error: '#db564c',
          warning: '#fcf3a1',
          info: '#2196f3',
          success: '#4caf50',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
  components: {
    VCalendar,
  }
})
