<template>
  <v-layout>
    <v-flex text-xs-center>
        <v-card>
            <v-card-title>
                訂單總覽
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="orders"
                :search="search"
                >
                <template slot="items" slot-scope="props">
                    <td class="text-xs-right">{{ props.item.name }}</td>
                    <td class="text-xs-right">{{ props.item.calories }}</td>
                    <td class="text-xs-right">{{ props.item.fat }}</td>
                    <td class="text-xs-right">{{ props.item.carbs }}</td>
                    <td class="text-xs-right">{{ props.item.protein }}</td>
                    <td class="text-xs-right">{{ props.item.iron }}</td>
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
          { text: '人數', value: 'totalPeople' }
        ],
        orders: [
        //   {
        //     value: false,
        //     name: 'Eclair',
        //     calories: 262,
        //     fat: 16.0,
        //     carbs: 23,
        //     protein: 6.0,
        //     iron: '7%'
        //   },
        //   {
        //     value: false,
        //     name: 'Cupcake',
        //     calories: 305,
        //     fat: 3.7,
        //     carbs: 67,
        //     protein: 4.3,
        //     iron: '8%'
        //   },
        //   {
        //     value: false,
        //     name: 'Gingerbread',
        //     calories: 356,
        //     fat: 16.0,
        //     carbs: 49,
        //     protein: 3.9,
        //     iron: '16%'
        //   },
        //   {
        //     value: false,
        //     name: 'Jelly bean',
        //     calories: 375,
        //     fat: 0.0,
        //     carbs: 94,
        //     protein: 0.0,
        //     iron: '0%'
        //   }
        ]
      }
    }
  }
</script>