export default class IFXRequestAPIService {
  constructor(store) {
    this._store = store
  }

  get store() {
    return this._store
  }
}
