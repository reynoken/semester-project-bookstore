<template>
  <div>
    <p>This sample requires an API Key from <a
        href="https://timezonedb.com">TimeZoneDB</a>.
      Once you sign up and get your API key, save it in
      <code>.env.local</code> (in the same directory with
      <code>package.json</code>) in the following format:

    <pre>
        VUE_APP_TIMEZONE_API_KEY=xxxxxxxx
    </pre>
    </p>

    <div>
      <WorldMap @map-clicked="what" />
    </div>
    <input type="text" :value="geoPosition">
    <button @click="searchCity">Add</button>
    <div id="clocks">
      <Clock v-for="(c,pos) in selectedCities" :key="pos"
        :time-zone="c.timeZone" :label="c.name">
      </Clock>
    </div>
    <button @click="saveLocs">Save</button>
    <span id="msgbox" v-show="message.length > 0">{{message}}</span>
  </div>
</template>

<script lang="ts">
// import ChildComponent from "./60-props-child.vue";
import axios, { AxiosResponse } from "axios";
import Clock from "./clock.vue";
import WorldMap from "./world-map.vue";
import { Vue, Component } from "vue-property-decorator";
import { DocumentReference, setDoc, doc, getFirestore, QueryDocumentSnapshot, QuerySnapshot, getDoc, collection, DocumentSnapshot, getDocs } from "@firebase/firestore";
import {Firestore} from "firebase/firestore";
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
const firstSelected = true;
const regionSelected = "";
const locationSelected = "";

const timezoneDBUrl = "http://api.timezonedb.com/v2.1";
type City = {
  name: string;
  timeZone: string;
};

type TimeZoneData = {
  countryName: string;
  gmtOffset: number;
  regionName: string;
  zoneName: string;
};
@Component({ components: { Clock, WorldMap } })
export default class Sample extends Vue {
  geoPos: { lat?: number; lng?: number } = {};
  selectedCities: Array<City> = [];
  apiKey = "";
  message = "";
  myDB: Firestore | null = null;
  auth: Auth | null = null;
  mounted(): void {
    this.apiKey = process.env.VUE_APP_TIMEZONE_API_KEY;
    this.myDB = getFirestore();
    this.auth = getAuth();
    this.selectAllFromCollections();
    
  }
  get geoPosition(): string {
    if (this.geoPos.lat && this.geoPos.lng)
      return `${this.geoPos.lat.toPrecision(5)},${this.geoPos.lng.toPrecision(
        5
      )}`;
    else return "N/A";
  }
  searchCity(): void {
    const param = new URLSearchParams();
    param.append("key", this.apiKey);
    param.append("format", "json");
    param.append("by", "position");
    param.append("lat", this.geoPos.lat!.toString());
    param.append("lng", this.geoPos.lng!.toString());
    const tzUrl = `${timezoneDBUrl}/get-time-zone?` + param.toString();
    // Use a Web Proxy Server to get around CORS issue
    // since timezonedb.com does not allow CORS
    axios
      .request({
        method: "GET",
        url: "https://api.allorigins.win/get",
        params: {
          url: tzUrl,
        },
      })
      .then((r: AxiosResponse) => {
        return r.data;
      })
      .then((r: any) => JSON.parse(r.contents))
      .then((r: TimeZoneData) => {
        // Add the selected location to our array    
        // this.selectedCities.push({ name: r.regionName, timeZone: r.zoneName });
       if (this.selectedCities.some(prevSelectRegion => prevSelectRegion.name === r.regionName)) {
         this.showMessage("This region has already been selected. Please choose a different location.");
       }else {
         this.selectedCities.push({ name: r.regionName, timeZone: r.zoneName });
       }
        
      });
      
  }

  showMessage(txt: string) {
    this.message = txt;

    // The message will automatically disappear after 5 seconds
    setTimeout(() => {
      this.message = "";
    }, 5000);
  }

  what(geoPos: { lat: number; lng: number }): void {
    // When the user pans the map left/right the longitude
    // angle can be out of the [-180,+180] range
    while (geoPos.lng > 180) geoPos.lng -= 360;
    while (geoPos.lng < -180) geoPos.lng += 360;
    this.geoPos = { ...geoPos };
  }

  saveLocs(): void {
    const auth = getAuth();
    const myDB = getFirestore();
    const uid = auth.currentUser?.uid;
    if (uid !== undefined) {
     const dx = doc(myDB, "worltimeuser", uid);
      let n: string[] = this.selectedCities.map((z:City) =>  z.name)
      let t: string[] = this.selectedCities.map((z:City) => z.timeZone)   
       setDoc(dx, {name: n, timeZone: t});    
    }
  }
  selectAllFromCollections() {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    // console.log("this is for line 152", uid);
    // console.log("myDb", this.myDB);
    if (uid !== undefined) {
      const userColl = doc(this.myDB!, "worltimeuser", uid);
      //console.log("userColl is:", userColl);
      getDoc(userColl).then((qs:DocumentSnapshot) => {
        if(qs.exists()) {
          let data = qs.data(); 
          this.selectedCities.push({name: data.name, timeZone: data.timeZone});
        }else console.debug("does not exsist");
      });
    }
    
  }
  
}
</script>

<style scoped>
#clocks {
  margin-top: 1em;
}
pre {
  white-space: normal;
  padding: 0.5em;
  border: 2px solid gray;
}
</style>