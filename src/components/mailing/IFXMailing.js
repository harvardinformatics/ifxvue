import ItemBase from '@/components/item/IFXItemBase'

export default class Mailing extends ItemBase {
  get sent() {
    return this.data.sent
  }

  set sent(sent) {
    this.data.sent = sent
  }

  get message() {
    return this.data.message
  }

  set message(message) {
    this.data.message = message
  }

  get signature() {
    return this.data.signature
  }

  set signature(signature) {
    this.data.signature = signature
  }

  get subject() {
    return this.data.subject
  }

  set subject(subject) {
    this.data.subject = subject
  }

  get fromstr() {
    return this.data.fromstr
  }

  set fromstr(fromstr) {
    this.data.fromstr = fromstr
  }

  get tostr() {
    return this.data.tostr
  }

  set tostr(tostr) {
    this.data.tostr = tostr
  }

  get ccstr() {
    return this.data.ccstr
  }

  set ccstr(ccstr) {
    this.data.ccstr = ccstr
  }

  get bccstr() {
    return this.data.bccstr
  }

  set bccstr(bccstr) {
    this.data.bccstr = bccstr
  }

  get status() {
    return this.data.status
  }
}
