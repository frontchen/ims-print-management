import Vue from 'vue'
import Vuetify from 'vuetify/lib'
// eslint-disable-next-line
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#E83B31' // wistar logo color
        // secondary: colors.red.lighten4, // #FFCDD2
        // accent: colors.indigo.base // #3F51B5
      }
    }
  }
})
