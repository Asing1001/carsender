<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <div class="body-2">
        恭喜您已預約及付款成功，訂單代號為: {{ $route.query.orderId }},
        我們將於48小時內以簡訊回覆司機資料，再麻煩留意手機，謝謝您的配合！
      </div>
      <p>
        訂單資訊：<br />
        <span v-html="orderHTML"> </span>
      </p>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      orderHTML: ''
    }
  },
  async created() {
    const { data } = await axios.get(`/api/order/${this.$route.query.orderId}`)
    this.orderHTML = data
  }
}
</script>
