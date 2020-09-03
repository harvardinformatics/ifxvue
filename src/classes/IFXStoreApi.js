/**
 * Exposes the vuex store from the installing IFX application to all extending classes
 * @param  {object} store the vuex store of the installing IFX application
 */
export class IFXStoreAPIService {
  constructor(store) {
    this._store = store
  }

  get store() {
    return this._store
  }
  get state() {
    return this.store.state
  }
  get getters() {
    return this.store.getters
  }
  get actions() {
    return this.store.actions
  }
  get constants() {
    return this.state.constants
  }
}