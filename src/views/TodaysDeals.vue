<template>
    <div class="deals">
        <h1 id="pageTitle">The Book Store <button @click="outtahere">Logout</button> <button @click="goToCart">Cart</button> <button @click="toHome">Continue Browsing</button></h1>
        <h2>Today's Deals</h2>
        <table v-if="bookArr.length > 0 ">
            <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Discounted Price</th>
            </tr>
            <tr v-for="(u,pos) in bookArr.slice(7,10)" :key="pos">
                
                <td><img :src="u.image"></td>
                <td>{{u.title}}</td>
                <td>Original {{u.price}}</td><td id="price"> Now $20 <button @click="saveBookToCart(pos)">Add to Cart</button></td>
                
            </tr>
           
        </table>
        
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
  bookArr: Array<ITBooks> = [];
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
  toHome(): void {
        this.$router.back();
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
      .then((r:BookStoreResponse) => {
          this.bookArr.push(...r.books);
      });
   
  }
  //saves book to user cart
  saveBookToCart(pos: number): void {
    const auth = getAuth();
    const myDB = getFirestore();
    const uid = auth.currentUser?.uid;
    const book = this.bookArr[pos];
    if (uid!== undefined) {
      const dx = doc(myDB, "bookstoreuser", uid);
      //let l: string[] = this.bookArr.map((z:ITBooks) => z.image)
      // let n: string[] = this.bookArr.map((z:ITBooks) => z.title)
      // let m: string[] = this.bookArr.map((z:ITBooks) => z.price)
       setDoc(dx, {title: book.title, price: book.price});
    }
  }

  goToCart(): void {
    this.$router.push({name: "cart"});
  }
 
}
</script>


<style scoped>
h2 {
  text-align: center;
  font-family: cursive; 
  /* color: rgb(255, 255, 255);  */
  color: rgb(116, 75, 0);
}
    #pageTitle {
        margin: auto;
        width: 50%;
        border: 3px solid gray;
        padding: 10px;
        margin-bottom: 25px;
        text-align: center;
    }


    table {
      margin: auto;
      text-align: center;
    }

    #price  {
      color: brown;
    }

   #pageTitle { 
        width: 70%;
        border: 3px solid gray;
        border-style: dotted;
        padding: 10px;
        margin-bottom: 25px;
        text-align: center;
        font-family: cursive;
        font-style: italic;
        color: rgb(7, 127, 17);
    }

 
    div{
        background-color: rgb(235, 225, 194);
    }

    button{
      font-family: 'Courier New', Courier, monospace;
      border-radius: 20cm;
    }

     button:hover {
      background-color: rgb(91, 179, 74);
      font-style: italic; 
      font-family: 'Courier New', Courier, monospace;
      border-radius: 20cm;
      cursor: pointer;
    }  
    
    table {
      text-align: center; 
      border-collapse: collapse;
      width: 75%;
      margin: auto;
      text-align: center;
      font-family: 'Courier New', Courier, monospace;
    }

    table td, table th {
      text-align: center;
      margin: auto;
      border: 1px solid rgb(138, 105, 45);
      padding: 8px;
    }

    table tr:nth-child(even){
      text-align: center;
      background-color: #abb478; 
      }

        table tr:nth-child(odd){
      text-align: center;
      background-color: #a4afcf; 
      }

    table tr:hover {
      background-color: rgb(206, 196, 169);
      } 

    table th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: rgb(116, 75, 0);
      color: white; 
    }

    
</style>