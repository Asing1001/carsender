<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <div class="body-2">
        恭喜您已預約成功，訂單代號為: {{ $route.query.orderId }}
        <p class="h3">
          轉帳帳號：(013) 021-03-500687-4 國泰世華銀行
          <br />
          戶名：凡亨國際租賃有限公司
        </p>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {}
</script>
