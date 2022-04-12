import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { FirebaseApp, initializeApp } from "firebase/app";
import {getFirestore, Firestore} from "firebase/firestore";
//import { firebaseConfig } from "./myconfig";
const firebaseConfig = {
  apiKey: "AIzaSyCQONKrF_qHa4ttNP2fAkqsczZg-_1b9Bs",
  authDomain: "semester-project-b9854.firebaseapp.com",
  projectId: "semester-project-b9854",
  storageBucket: "semester-project-b9854.appspot.com",
  messagingSenderId: "73743231027",
  appId: "1:73743231027:web:380d23a978e0b16ecb9b46"
};

Vue.config.productionTip = false;
const app = initializeApp(firebaseConfig);
const myDB = getFirestore(app);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
