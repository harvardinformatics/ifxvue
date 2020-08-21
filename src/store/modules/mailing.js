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
        message: `Morbi condimentum lorem luctus orci vestibulum, vitae maximus justo vehicula.
        Ut a condimentum arcu. Nam vitae sapien pretium, pellentesque purus sit amet, eleifend ligula.
        Curabitur porta quam eget viverra suscipit. Nulla facilisi. Phasellus dignissim, quam vitae
        consectetur tincidunt, ante elit egestas magna, vel feugiat turpis dolor nec orci.
        Pellentesque quam elit, vehicula at commodo in, sodales sit amet purus. Praesent pellentesque
        elit vitae nisl blandit tincidunt. Donec eget risus lacinia, mollis libero vestibulum, porta massa.`
      },

      // tostr = models.TextField(blank=False, null=False, default=None)
      // fromstr = models.CharField(max_length=100, blank=False, null=False, default=None)
      // ccstr = models.TextField(null=True, blank=True)
      // bccstr = models.TextField(null=True, blank=True)
      // replyto = models.CharField(max_length=100, blank=True, null=True)
      // subject = models.CharField(max_length=1000, blank=False, null=False, default=None)
      // message = models.TextField(blank=False, null=False, default=None)
      // created = models.DateTimeField(auto_now_add=True)
      // updated = models.DateTimeField(auto_now=True)
      // sent = models.DateTimeField(blank=True, null=True, default=None)
      // status = models.CharField(max_length=20, blank=False, default='READY')
      // ifxmessage = models.ForeignKey(IfxMessage, blank=True, null=True, default=None, on_delete=models.CASCADE)
      // application = models.CharField(max_length=20, blank=False, null=False, default='nice')
      {
        id: '54321',
        date_sent: new Date('2015-02-19').toISOString(),
        recipients: {
          to: ['michael@harvard.edu', 'janice@harvard.edu', 'terrance@harvard.edu'],
          cc: ['ramesh@harvard.edu'],
          bcc: ['leonard@harvard.edu'],
        },
        message: `Nulla facilisi. Phasellus dignissim, quam vitae
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
      message: '',
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
      const mailing = state.allMail.filter(m => m.id === id)[0]
      commit('loadMail', mailing)
    }
  }
}

const mutations = {
  loadMail(state, mailing) {
    Vue.set(state.activeMail, 'id', mailing.id)
    Vue.set(state.activeMail, 'date_sent', mailing.date_sent)
    Vue.set(state.activeMail, 'message', mailing.message)
    Vue.set(state.activeMail, 'signature', mailing.signature)
    Vue.set(state.activeMail, 'recipients', mailing.recipients)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}