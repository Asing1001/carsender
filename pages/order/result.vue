<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <div class="body-2">
        恭喜您已預約及付款成功，訂單代號為: {{ $route.query.orderId }},
        我們將於48小時內以簡訊回覆司機資料，再麻煩留意手機，謝謝您的配合！
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {}
</script>
