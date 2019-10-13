<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <div class="body-2">
        恭喜您已預約成功，訂單代號為: {{ $route.query.orderId }}
        <p class="h3">
          ATM付款帳號：國泰世華銀行 (013)021035006874
          <br />
          戶名：凡亨國際租賃有限公司
        </p>
        <p>
          訂單資訊：<br />
          <span v-html="orderHTML"> </span>
        </p>
      </div>
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
