<template>
    <div class="home">
        <h1>The Book Store <button @click="outtahere">Logout</button><button>Cart</button></h1>
        <!-- add more elements to match wireframe -->
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue } from "vue-property-decorator";
import {
  getAuth,
  onAuthStateChanged,
  UserCredential,
  User,
  Auth,
  signOut,
  deleteUser,
  signInWithEmailAndPassword,
} from "firebase/auth";
import WorldTime from "@/components/world-time.vue";
import myDB from "@/App.vue";
import { DocumentReference, setDoc, doc, getFirestore } from "@firebase/firestore";
import {Firestore} from "firebase/firestore";
import { BookStoreResponse, ITBooks } from "@/datatypes";
import axios, {AxiosResponse} from "axios";

// const bookAPIUrl = "https://api.itbook.store/1.0/new";
// const todayDealBookUrl = "https://api.itbook.store/1.0/search/mongodb";


@Component
export default class HomePage extends Vue {
  
  userPhotoURL = "";
  message = "";
  auth: Auth | null = null;
  myDB: Firestore | null = null;
  userInfo = "";
  mounted(): void {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user: User | null) => {
      console.log("Auth changed", user);
      if (user) {
        this.userPhotoURL = user.photoURL ?? "";
        this.userInfo = `${user.displayName ?? "No Name"}`;
      }
    });
    this.myDB = getFirestore(); 
    this.loadBookData();
  }
  
  showMessage(txt: string) {
    this.message = txt;

    // The message will automatically disappear after 5 seconds
    setTimeout(() => {
      this.message = "";
    }, 5000);
  }

  outtahere(): void {
    if (this.auth) signOut(this.auth);

    // Back to the previous page
    this.$router.back();
  }

  loadBookData(): void {
      axios.request({
          method: "GET",
          url: "https://api.itbook.store/1.0/new",
      })
      .then((r:AxiosResponse) => r.data)
      .then((resp: BookStoreResponse) => {
          for (let k = 0; k < resp.books.length; k++) {
            const item = resp.books[k];
            console.log(`Title: ${item.title}, price: ${item.price}`); //this grabs info from api will use this to make the "cell" with book info
          }
      });
  }
}
</script>