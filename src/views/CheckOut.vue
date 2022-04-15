<template>
    <div class="cart">
        <h1 id="pageTitle">The Book Store <button @click="outtahere">Logout</button> <button @click="goToCart">Cart</button> <button @click="toHome">Continue Browsing</button></h1>
        <h2>Cart</h2>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";


@Component
export default class CheckOut extends Vue {

    toHome(): void {
        this.$router.back();
    }
}
</script>

<style scoped>
h2 {
    text-align: center;
}
 #pageTitle {
        margin: auto;
        width: 55%;
        border: 3px solid gray;
        padding: 10px;
        margin-bottom: 25px;
        text-align: center;
    }
</style>