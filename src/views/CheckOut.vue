<template>
    <div class="cart">
        <h1 id="pageTitle">The Book Store <button @click="outtahere">Logout</button>  <button @click="toHome">Continue Browsing</button></h1>
        <h2>Cart</h2>
        <table id="navbar">
            <tr>
                <th>Cart Summary</th>
                <th>Title</th>
                <th>Price</th>
            </tr>
            <tr id="row1" v-for="(u, pos) in book" :key="pos">
                <td><img :src="u.image"></td>
                <td>{{u.title}}</td>
                <td>{{u.price}} <button @click="removeItem(pos)">Remove Item</button></td>
            </tr>
            <tr>
                <td></td>
                <td>Total:</td>
                <td>$</td>
            </tr>
        </table> 
        
        
        
    <div class="payment">
        <h2>Payment Information</h2>
        <form>
            <label for="fname">First name:</label><br>
            <input type="text" id="fname" name="fname"><br><br>
            <label for="lname">Last name:</label><br>
            <input type="text" id="lname" name="lname"><br><br>
            <label for="address">Address:</label><br>
            <input type="text" id="address" name="address"><br><br>
            <label for="ccNum">Credit Card Number:</label><br>
            <input type="text" id="ccNum" name="ccNum"><br><br>
            <label for="expDate">Expiration Date:</label><br>
            <input type="text" id="expDate" name="expDate"><br><br>
            <label for="cvv">CVV:</label><br>
            <input type="text" id="cvv" name="cvv"><br><br>
        </form>
        <button @click="savePaymentInfo">Submit Order</button>
    </div>
    </div>
</template>
 
<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
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
import { DocumentReference, setDoc, addDoc,deleteDoc, collection, doc, getFirestore, DocumentSnapshot, CollectionReference, getDoc, QuerySnapshot, QueryDocumentSnapshot, updateDoc, deleteField } from "@firebase/firestore";
import {Firestore} from "firebase/firestore";
import { BookStoreResponse, ITBooks } from "@/datatypes";
import axios, {AxiosResponse} from "axios";
import HomePage from "@/views/HomePage.vue";

 
 
@Component
export default class CheckOut extends Vue {
    message = "";
    myDB: Firestore | null = null;
    auth: Auth | null = null;
    book: Array<ITBooks> = [];
    cart: any[] = [];
    
    mounted(): void {
        this.myDB = getFirestore();
        this.auth = getAuth();
        this.findItemsInCart();
    }
 
    savePaymentInfo() {
        //saves user's personal info to firestore
        let str1 = (document.getElementById("fname") as HTMLInputElement).value;
        let str2 = (document.getElementById("lname") as HTMLInputElement).value;
        let str3 = (document.getElementById("address") as HTMLInputElement).value;
        let str4 = (document.getElementById("ccNum") as HTMLInputElement).value;
        let str5 = (document.getElementById("expDate") as HTMLInputElement).value;
        let str6 = (document.getElementById("cvv") as HTMLInputElement).value;
        console.log(str1, str2, str3, str4, str5, str6);
        //add user info to collection
        const auth = getAuth();
        const myDB = getFirestore();
        const uid = auth.currentUser?.uid;
        if (uid !== undefined) {
           const dx = doc(myDB, "paymentinfo", uid);
           setDoc(dx, {FirstName: str1, LastName: str2, Address: str3, CreditCard: str4, ExpDate: str5, CVV: str6});
        }
    }

    removeItem(): void {
    document.getElementById("row1")?.remove();

    const auth = getAuth();
    const myDB = getFirestore();
    const uid = auth.currentUser?.uid;
    deleteDoc(doc(myDB, `bookstoreusertest/${uid}`))
    .then(() => { console.debug("Fields deleted") });
  
  }


 //Could not get this to work
    findItemsInCart(): void {
        const auth = getAuth();
        const myDB = getFirestore();
        const uid = auth.currentUser?.uid;
    
        if (uid !== undefined) {
            const dx = doc(myDB, "bookstoreusertest", uid);

            getDoc(dx).then((qs:DocumentSnapshot) => {
                if(qs.exists()) {

                    let data = qs.data();
                    
                    //this.cart.push(data);
                    //const {title, price} = qs.data();
                    //console.log(title, price);
                    //this.cart.push(title, price);
                    this.book.push({title: data.title, subtitle: data.subtitle, image: data.image, price: data.price})
                    console.log(this.book); //creates an object with price and title properly fetched
                }else console.debug("does not exsist"); 
            }) 
        }

    }

    toHome(): void {
        this.$router.back();
    }
    outtahere(): void {
    if (this.auth) signOut(this.auth);

    // Back to the previous page
    this.$router.back();
  }

}
</script>
 
<style scoped>



h2 {
  text-align: center;
  font-family: cursive; 
  color: rgb(116, 75, 0);
}
h3 {
    text-align: center;
    font-weight: normal;
}
div{
    background-color: rgb(235, 225, 194);
}
#navbar { 
    font-family: cursive;
    margin-bottom: 15px;
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
table th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: center;
      background-color: rgb(116, 75, 0);
      color: white; 
    }
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
.payment{
    margin: auto;
    width: 20%;
    border: 2px solid grey;
    padding: 10px;
    text-align: center;
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
</style>