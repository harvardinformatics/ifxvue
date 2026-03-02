import IFXItemBase from '@/components/item/IFXItemBase'

export default class IFXLogSubscription extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    // Set default template values here
  }

  get channel() {
    return this.data.channel
  }

  set channel(channel) {
    this.data.channel = channel
  }

  get user() {
    return this.data.user
  }

  set user(user) {
    this.data.user = user
  }

  get sendEmail() {
    return this.data.send_email || false
  }

  set sendEmail(sendEmail) {
    this.data.send_email = sendEmail
  }

  get sendEmailDigest() {
    return this.data.send_email_digest || false
  }

  set sendEmailDigest(sendEmailDigest) {
    this.data.send_email_digest = sendEmailDigest
  }

  get preferredEmail() {
    return this.data.preferred_email || ''
  }

  set preferredEmail(preferredEmail) {
    this.data.preferred_email = preferredEmail
  }

  get showInApp() {
    return this.data.show_in_app || false
  }

  set showInApp(showInApp) {
    this.data.show_in_app = showInApp
  }

  get subscribed() {
    return this.data.subscribed || false
  }

  set subscribed(subscribed) {
    this.data.subscribed = subscribed
  }

  get created() {
    return this.data.created
  }
}
