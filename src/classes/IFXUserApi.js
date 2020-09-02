/**
 * Base User class for use on the frontend of IFX applications
 * @param  {object} urls all of the static urls used by the installing ifx application
 */
export class IFXUserAPIService {
  constructor(urls) {
    this.urls = urls
  }
  // getUsers(username) {
  //   let url = `${API_ROOT}/users/`
  //   if (!username) {
  //     // return axios.get(url, {headers: {Authorization: `${store.getters.authHeaderValue}`}})
  //     return new Promise(resolve => resolve(this.users))
  //   }
  //   url = url + `${username}/`
  //   // return axios.get(url, {headers: {Authorization: `${store.getters.authHeaderValue}`}})
  // }

  // getGroups(name) {
  //   let url = `${API_ROOT}/groups/`
  //   if (!name) {
  //     // return axios.get(url, {headers: {Authorization: `${store.getters.authHeaderValue}`}})
  //     return new Promise(resolve => resolve(this.groups))
  //   }
  //   url = url + `${name}/`
  //   // return axios.get(url, {headers: {Authorization: `${store.getters.authHeaderValue}`}})
  // }

  async testIfxUser(username) {
    return `Called from IFXUserApi in IFXVue. API_ROOT is: ${this.urls.API_ROOT} and username is: ${username}!`
  }
}