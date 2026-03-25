import IFXItemBase from '@/components/item/IFXItemBase'

export default class Subscription extends IFXItemBase {
  constructor(data = {}) {
    super(data)
    // Set default template values here
  }

  get channelId() {
    return this.data.channel_id
  }

  set channelId(channel_id) {
    this.data.channel_id = channel_id
  }

  get channelTitle() {
    return this.data.channel_title
  }

  set channelTitle(channel_title) {
    this.data.channel_title = channel_title
  }

  get organizationName() {
    return this.data.organization_name
  }

  set organizationName(organization_name) {
    this.data.organization_name = organization_name
  }

  get subscriptionId() {
    return this.data.subscription_id
  }

  set subscriptionId(subscription_id) {
    this.data.subscription_id = subscription_id
  }

  get subscribed() {
    return this.data.subscribed
  }

  set subscribed(subscribed) {
    this.data.subscribed = subscribed
  }

  get isMandatory() {
    return this.data.is_mandatory
  }
}
