<template>
    <div class="cart">
        <h1 id="pageTitle">The Book Store <button @click="outtahere">Logout</button>  <button @click="toHome">Continue Browsing</button></h1>
        <table id="navbar">
            <tr>
                <th>Cart</th>
            </tr>
        </table>
        <h3>Load in books that are saved to cart</h3>
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
        <button >Submit Payment</button>
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
import { DocumentReference, setDoc, addDoc, collection, doc, getFirestore, DocumentSnapshot, CollectionReference } from "@firebase/firestore";
import {Firestore} from "firebase/firestore";
import { BookStoreResponse, ITBooks } from "@/datatypes";
import axios, {AxiosResponse} from "axios";
 
 
@Component
export default class CheckOut extends Vue {
    message = "";
    myDB: Firestore | null = null;
    auth: Auth | null = null;
    mounted(): void {
        this.myDB = getFirestore();
        this.auth = getAuth();
        //this.selectedBooks();
    }
 
    // savePaymentInfo() {
    //     var fname = (<HTMLInputElement>document.getElementById("fname")).value;
    //     var lname =  (<HTMLInputElement>document.getElementById("lname")).value;
    //     var address = (<HTMLInputElement>document.getElementById("address")).value;
    //     var ccNum = (<HTMLInputElement>document.getElementById("ccNum")).value;
    //     var expDate = (<HTMLInputElement>document.getElementById("expDate")).value;
    //     var cvv = (<HTMLInputElement>document.getElementById("cvv")).value;
    //     console.log(fname);
    //     //add user info to collection
    //     const auth = getAuth();
    //     const myDB = getFirestore();
    //     const uid = auth.currentUser?.uid;
    //             if (uid !== undefined) {
    //         // const dx = doc(myDB, "paymentinfo", uid);
    //         const dx = doc(myDB, "paymentinfo", uid);
    //        setDoc(dx, {FirstName: fname, LastName: lname, Address: address, CreditCard: ccNum, ExpDate: expDate, CVV: cvv});
    //     }
   
    // }
 
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