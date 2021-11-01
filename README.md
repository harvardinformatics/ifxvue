# Harvard FAS Informatics User Interface Library

This user interface library is built and maintained by the Harvard FAS Informatics group. It includes many reusable components, mixins, and filters, as well as an API for use throughout any host application built with Vue CLI (Vue 2), Vuex, and Vuetify 2 installed.

## Installation

Using NPM:
```
npm i ifxvue
```

In main.js (or wherever Vue is instantiated):

```
import vuexStore from './store'
import APIStore from '@/API/APIStore'
import ifxvue from 'ifxvue'

Vue.use(ifxvue, { vuexStore, APIStore })
```

In the above code, the vuexStore can be empty, but it must be instantated by the host applcation.

The APIStore is an object with the following attributes (i.e. any urls and vars to be used by the API).

```
const appName = 'hers'
const appNameFormatted = 'HeRS'

const vars = {
  appName,
  appNameFormatted,
  appKey: `ifx_${appName}`
}

const APIStore = {
  urls,
  vars,
  ui: {}
}
```

To make use of the API throughout the application, it must be made reactive, like so:

```
const api = new APIService(APIStore)
Vue.prototype.$api = Vue.observable(api)
api.auth.initAuthUser()
```

This API can then be used to inialize the authUser (for authentication purposes, e.g. logging in and out).

## Components
Some components in this library are installed by default. This can be configured by adding to the ifxcomponents variable in the entrypoint file, as can the specifics of any default import/export. This is true of Vuex modules, mixins, classes, etc.

#### IFXMessageDisplay `<IFXDisplayMessage/>`
This is a simple component that renders a message on top of the current page, using the Snackbar component from Vuetify. To use, place Message component at the top level of the application and activate using the showMessage action. This accepts strings or error objects. If an error object is passed, the Message component requires action from the user to be dismissed. Otherwise, the component persists for a period of time that is proportional to the length of the message being passed.

```
import {mapActions} from 'vuex'

<script>
    methods: {
        getData () {
            api.getUserData()
                .then(response => {
                    const message = 'This action was successful.'
                    this.showMessage(message)
                })
                .catch(error => {
                    this.showMessage(error)
                })
            },
        testMessage () {
          const message = "This is a test message."
          this.showMessage(message)
        },
        ...mapActions([
            'showMessage',
        ]),
    }
</script>

<template>
    <Message/>
    <v-btn @click.prevent="testMessage">
</template>

```
Optional parameters:
- vertical (stacks message content vertically for mobile)
- top, bottom, left, right (message will be fixed to the top, bottom, left, or right of screen)
- color (applies specified color to the message window - works with standard material color scheme, such as 'success' or 'primary', as well as standard css colors)
- multiline (makes message taller)
- timeout (time in milliseconds for message to be displayed - default is 3000)

Example (in App.js or any other top-level component):
```
<IFXDisplayMessage :top=true :color="success" :timeout=5000/>
```
## Local app development
 `IFXVue` to be used as a standalone app for development/testing purposes. To use this, you should copy `src/AppTemplate.vue` to `src/App.vue` and issue the `make serve` or `npm run serve` command in a terminal. This will start a development server that will do hot reloading. `src/App.vue` should be `.gitignore`d so you shouldn't been to revert changes before checking things in but it can't hurt.

 If you navigate to [localhost](http://localhost:8080/) (or whereever the development server tells you to go), you should see the instructions card. Start editting `src/App.vue` with the code you want to develop/test. For example, develop a new component and "instantiate" it in `src/App.vue`.

Note that there is no back-end so all data will need to be mocked.
