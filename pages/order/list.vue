<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-card-title class="align-baseline py-2 pl-2">
          <v-btn slot="activator" color="primary" dark to="/order/create"
            >新增預約</v-btn
          >
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
          :pagination.sync="pagination"
          rows-per-page-text="每頁筆數"
          :rows-per-page-items="[10, 20, 50, 100]"
        >
          <template slot="items" slot-scope="{ item }">
            <td class="text-xs-left px-2">{{ item.createdAt }}</td>
            <td class="text-xs-left px-2">{{ item.status }}</td>
            <td class="text-xs-left px-2">{{ item.serviceType }}</td>
            <td class="text-xs-left px-2">{{ item.planeNo }}</td>
            <td class="text-xs-left px-2 nowrap">{{ item.pickUpDate }}</td>
            <td class="text-xs-left px-2">{{ item.pickUpTime }}</td>
            <td class="text-xs-left px-2">
              {{ item.targetCity + item.targetArea + item.targetAddress }}
            </td>
            <td class="text-xs-left px-2">{{ item.name }}</td>
            <td class="text-xs-left px-2">{{ item.phone }}</td>
            <td class="text-xs-left px-2">{{ item.identity }}</td>
            <td class="text-xs-left px-2">{{ item.email }}</td>
            <td class="text-xs-left px-2">{{ item.totalPeople }}</td>
            <td class="text-xs-left px-2">{{ item.luggage }}</td>
            <td class="text-xs-left px-2">{{ item.remark }}</td>
            <td class="justify layout px-0">
              <!-- <v-btn icon class="mx-0" @click="editItem(item)">
                        <v-icon color="teal">edit</v-icon>
              </v-btn>-->
              <v-btn icon class="mx-0" @click="deleteItem(item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning"
            >無符合 "{{ search }}" 的搜尋結果</v-alert
          >
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'auth',
  components: {},
  data() {
    return {
      dialog: false,
      search: '',
      pagination: { descending: true },
      headers: [
        {
          text: '訂單成立時間',
          value: 'createdAt',
          class: 'text-xs-left px-2'
        },
        { text: '狀態', value: 'status', class: 'text-xs-left px-2' },
        { text: '預約類型', value: 'serviceType', class: 'text-xs-left px-2' },
        { text: '航班編號', value: 'planeNo', class: 'text-xs-left px-2' },
        { text: '乘車日期', value: 'pickUpDate', class: 'text-xs-left px-2' },
        { text: '時間', value: 'pickUpTime', class: 'text-xs-left px-2' },
        { text: '地址', value: 'targetAddress', class: 'text-xs-left px-2' },
        { text: '姓名', value: 'name', class: 'text-xs-left px-2' },
        { text: '手機', value: 'phone', class: 'text-xs-left px-2' },
        { text: '身份證後四碼', value: 'identity', class: 'text-xs-left px-2' },
        { text: 'email', value: 'email', class: 'text-xs-left px-2' },
        { text: '人數', value: 'totalPeople', class: 'text-xs-left px-2' },
        { text: '行李數', value: 'totalPeople', class: 'text-xs-left px-2' },
        { text: '備註', value: 'remark', class: 'text-xs-left px-2' },
        { text: '', value: 'action', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        serviceType: null,
        planeNo: '',
        pickUpDate: null,
        pickUpTime: null,
        name: '',
        email: '',
        phone: null,
        totalPeople: 1,
        targetAddress: '',
        remark: ''
      },
      defaultItem: {
        serviceType: null,
        planeNo: '',
        pickUpDate: null,
        pickUpTime: null,
        name: '',
        email: '',
        phone: null,
        totalPeople: 1,
        luggage: null,
        targetAddress: '',
        remark: ''
      }
    }
  },
  computed: {
    orders() {
      return this.$store.state.orders
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  async mounted() {
    await this.$store.dispatch('getOrders')
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      if (confirm('確定移除?')) {
        try {
          await this.$store.dispatch('deleteOrder', item)
        } catch (err) {
          alert(err)
        }
      }
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.orders[this.editedIndex], this.editedItem)
      } else {
        this.orders.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>
