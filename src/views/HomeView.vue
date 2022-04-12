<template>
  <div class="home">
    <h2>This is the main page. I got here via {{byWayOf}}</h2>
    <p>{{userInfo}}</p>
    <img :src="userPhotoURL" v-if="userPhotoURL.length > 0" width="64">
    <button @click="outtahere">Logout</button>
    <button @click="outtahere2">Delete Account</button>
    <span id="msgbox" v-show="message.length > 0">{{message}}</span>
    <world-time></world-time>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
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

@Component({
components: {
  WorldTime
}}
)
export default class HomeView extends Vue {
  @Prop() readonly byWayOf!: string;

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
  //deletes user and goes back to loginview.vue
  outtahere2(): void {
     this.auth = getAuth();
     const user = this.auth.currentUser;
        if (user !== null) {
          deleteUser(user).then(() => {
            //user deleted
            this.showMessage("User successfully deleted");
          }).catch(() => {
            //an error occurred
            this.showMessage("unable to delete user");
          });
        }
    this.$router.back();
  }

  
}
</script>
