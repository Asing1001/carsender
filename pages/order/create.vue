<template>
  <v-layout justify-center>
    <v-flex xs12 sm10 md8 style="max-width:800px">
      <order-editor></order-editor>
    </v-flex>
  </v-layout>
</template>

<script>
import OrderEditor from '~/components/OrderEditor'
export default {
  components: {
    OrderEditor
  }
}
</script>
