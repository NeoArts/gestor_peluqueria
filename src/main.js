import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { plugin, defaultConfig } from '@formkit/vue'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import vClickOutsideUmd from 'v-click-outside';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth'

import store from './store';

import '@fortawesome/fontawesome-free/js/all'

const firebaseConfig = {
    apiKey: "AIzaSyBb4bwk6gzM--0LJdhp6KxIEEJRjui9iBs",
    authDomain: "gestorpeluqueria.firebaseapp.com",
    projectId: "gestorpeluqueria",
    storageBucket: "gestorpeluqueria.appspot.com",
    messagingSenderId: "185778658188",
    appId: "1:185778658188:web:6fbbd5ec45d8e99dfc54a9",
    measurementId: "G-S5NJJE0T3G"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export{
    db,
    auth,
    firebaseApp
}

createApp(App).use(router).use(VueSweetalert2).use(store).use(vClickOutsideUmd).use(plugin, defaultConfig).mount('#app')
