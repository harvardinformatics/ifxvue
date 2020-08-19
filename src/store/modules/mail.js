import Vue from 'vue'

const getDefaultState = () => {
  return {
    allMail: [
      {
        id: '12345',
        date_sent: new Date('2018-02-19').toISOString(),
        recipients: {
          to: ['aaronk@harvard.edu', 'meghanc@harvard.edu', 'grace@harvard.edu'],
          cc: ['nathanw@harvard.edu', 'annette@harvard.edu'],
          bcc: ['andyb@harvard.edu'],
        },
        body: `Morbi condimentum lorem luctus orci vestibulum, vitae maximus justo vehicula.
        Ut a condimentum arcu. Nam vitae sapien pretium, pellentesque purus sit amet, eleifend ligula.
        Curabitur porta quam eget viverra suscipit. Nulla facilisi. Phasellus dignissim, quam vitae
        consectetur tincidunt, ante elit egestas magna, vel feugiat turpis dolor nec orci.
        Pellentesque quam elit, vehicula at commodo in, sodales sit amet purus. Praesent pellentesque
        elit vitae nisl blandit tincidunt. Donec eget risus lacinia, mollis libero vestibulum, porta massa.`
      },
      {
        id: '54321',
        date_sent: new Date('2015-02-19').toISOString(),
        recipients: {
          to: ['michael@harvard.edu', 'janice@harvard.edu', 'terrance@harvard.edu'],
          cc: ['ramesh@harvard.edu'],
          bcc: ['leonard@harvard.edu'],
        },
        body: `Nulla facilisi. Phasellus dignissim, quam vitae
        consectetur tincidunt, ante elit egestas magna, vel feugiat turpis dolor nec orci.
        Pellentesque quam elit, vehicula at commodo in, sodales sit amet purus. Praesent pellentesque
        elit vitae nisl blandit tincidunt. Donec eget risus lacinia, mollis libero vestibulum, porta massa. Nulla facilisi.
        Morbi condimentum lorem luctus orci vestibulum, vitae maximus justo vehicula. Ut a condimentum arcu.
        Nam vitae sapien pretium, pellentesque purus sit amet, eleifend ligula. Curabitur porta quam eget viverra suscipit.`
      }
    ],
    activeMail: {
      id: '',
      date_sent: '',
      body: '',
      signature: '',
      recipients: {
        to: [],
        cc: [],
        bcc: []
      }
    }
  }
}

const state = getDefaultState()

const getters = {
  allMail: state => state.allMail,
  activeMail: state => state.activeMail
}

const actions = {
  async fetchMail({commit, state}, id) {
    if (!id) {
      // Just get all of them
    } else {
      const mail = state.allMail.filter(m => m.id === id)[0]
      commit('loadMail', mail)
    }
  }
}

const mutations = {
  loadMail(state, mail) {
    Vue.set(state.activeMail, 'id', mail.id)
    Vue.set(state.activeMail, 'date_sent', mail.date_sent)
    Vue.set(state.activeMail, 'body', mail.body)
    Vue.set(state.activeMail, 'signature', mail.signature)
    Vue.set(state.activeMail, 'recipients', mail.recipients)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}