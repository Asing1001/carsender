<template>
  <v-layout>
    <v-flex text-xs xs12>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout>
                  <order-editor></order-editor>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card>
            <v-card-title>
                <v-btn slot="activator" color="primary" dark class="mb-2" to="/order/create">新增預約</v-btn>              
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
                rows-per-page-text="每頁筆數"
                >
                <template slot="items" slot-scope="{ item }">
                    <td class="text-xs" v-for="(value, key, index) in item" v-if="!key.startsWith('_')" :key="index">{{ value }}</td>
                    <td class="justify-center layout px-0">
                      <v-btn icon class="mx-0" @click="editItem(item)">
                        <v-icon color="teal">edit</v-icon>
                      </v-btn>
                      <v-btn icon class="mx-0" @click="deleteItem(item)">
                        <v-icon color="pink">delete</v-icon>
                      </v-btn>
                    </td>
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
import OrderEditor from '~/components/OrderEditor'

export default {
  middleware: 'auth',
  components: {
    OrderEditor
  },
  data () {
    return {
      dialog: false,
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
        { text: '備註', value: 'remark' },
        { text: '', value: 'action', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        serviceType: null,
        pickUpDate: null,
        pickUpTime: null,
        name: '',
        email: '',
        phone: null,
        totalPeople: 1,
        pickUpAddress: '',
        targetAddress: '',
        remark: ''
      },
      defaultItem: {
        serviceType: null,
        pickUpDate: null,
        pickUpTime: null,
        name: '',
        email: '',
        phone: null,
        totalPeople: 1,
        pickUpAddress: '',
        targetAddress: '',
        remark: ''
      }
    }
  },
  computed: {
    orders () {
      return this.$store.state.orders
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  async created () {
    await this.$store.dispatch('getOrders')
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.orders.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.orders.indexOf(item)
      confirm('確定移除?') && this.orders.splice(index, 1)
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
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