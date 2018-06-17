<template>
  <v-layout>
    <v-flex text-xs-center xs12>
        <v-card>
            <v-card-title>
                訂單總覽
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="搜尋"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="orders"
                :search="search"
                >
                <template slot="items" slot-scope="{ item }">
                    <td class="text-xs-right" v-for="(value, key, index) in item" v-if="!key.startsWith('_')" :key="index">{{ value }}</td>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    無符合 "{{ search }}" 的搜尋結果
                </v-alert>
            </v-data-table>
        </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    middleware: 'auth',
    data () {
      return {
        search: '',
        headers: [
          { text: '預約類型', value: 'serviceType' },
          { text: '乘車日期', value: 'pickUpDate' },
          { text: '乘車時間', value: 'pickUpTime' },
          { text: '乘車地址', value: 'pickUpAddress' },
          { text: '目的地', value: 'targetAddress' },
          { text: '姓名', value: 'name' },
          { text: '手機', value: 'phone' },
          { text: '人數', value: 'totalPeople' },
          { text: '備註', value: 'remark' }
        ]
      }
    },
    computed: {
      orders () {
        return this.$store.state.orders
      }
    },
    async created () {
      await this.$store.dispatch('getOrders')
    }
  }
</script>