<template>
    <div class="home">
        <h1 id="pageTitle">The Book Store <button @click="outtahere">Logout</button> <button @click="goToCart">Cart</button> </h1>
        <!-- add more elements to match wireframe -->
        <table id="navbar">
            <tr>
                <th><button @click="BooksAvailableNow">Books Available Now</button></th>
                <th>Filter A-Z</th>
                <th>Filter by Genre</th>
            </tr>
        </table>

        <table v-if="bookArr.length > 0 ">
            <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
            </tr>
            <tr v-for="(u,pos) in bookArr" :key="pos">
                <td><img :src="u.image"></td>
                <td>{{u.title}}</td>
                <td>{{u.price}} <button @click="saveBookToCart">Add to Cart</button></td>
            </tr>
        </table>
        <h1 id="pageTitle">For Today's Deals: <button @click="todaysDeals">Click Here</button></h1>
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
import { DocumentReference, getDoc, DocumentSnapshot, setDoc, doc, getFirestore } from "@firebase/firestore";
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
      // console.log("Auth changed", user);
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
      .then((r:BookStoreResponse) => {
          this.bookArr.push(...r.books);
      });
   
  }
  //this function should save book to "cart" when user hits button, problem is it saves all books
  saveBookToCart(): void {
    const auth = getAuth();
    const myDB = getFirestore();
    const uid = auth.currentUser?.uid;
    if (uid!== undefined) {
      const dx = doc(myDB, "bookstoreuser", uid);
      //let l: string[] = this.bookArr.map((z:ITBooks) => z.image)
      let n: string[] = this.bookArr.map((z:ITBooks) => z.title)
      let m: string[] = this.bookArr.map((z:ITBooks) => z.price)
       setDoc(dx, {title: n, price: m});
    }
  }

//ADDED HERE DOES NOT WORK 
  selectedBooks() {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        if (uid !== undefined) {
            const userColl = doc(this.myDB!, "bookstoreuser", uid);
            getDoc(userColl).then((qs:DocumentSnapshot) => {
                if(qs.exists()) {
                    let data = qs.data();
                    //this.bookArr.push({title: data.title, price: data.price});
                }else console.debug("does not exist");
            });
        }
    }

  goToCart(): void {
    this.$router.push({name: "cart"});
  }
  todaysDeals(): void {
    this.$router.push({name: "todaysdeals"});
  }
}
</script>

<style scoped>
    #pageTitle {
        margin: auto;
        width: 70%;
        border: 3px solid gray;
        border-style: dotted;
        padding: 10px;
        margin-bottom: 20px;
        text-align: center;
        font-family: cursive;
        font-style: italic;
        color: rgb(7, 127, 17);
    }

    #navbar { 
        font-family: cursive;
        margin-bottom: 15px;
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