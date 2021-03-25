export default class ItemBase {
  constructor(data = {}) {
    this._data = data
  }

  get data() {
    return this._data
  }

  set data(data) {
    this._data = data
  }

  get id() {
    return this.data.id
  }

  get dateCreated() {
    return this.data.date_created
  }

  get dateModified() {
    return this.data.date_modified
  }
}
