<template>
  <v-layout >
    <v-flex xs12 sm8 md6>
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