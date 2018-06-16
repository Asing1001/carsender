<template>
  <v-layout >
    <v-flex xs12 sm8 md6>
      <form>
        <v-select
          v-model="serviceType"
          :items="items"
          :error-messages="serviceTypeErrors"
          label="預約類型"
          required
          @change="$v.serviceType.$touch()"
          @blur="$v.serviceType.$touch()"
        ></v-select>
        <v-menu
          ref="dateMenu"
          :close-on-content-click="false"
          v-model="dateMenu"
          :nudge-right="40"
          :return-value.sync="pickUpDate"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="pickUpDate"
            label="乘車日期*"
            append-icon="event"
            readonly
          ></v-text-field>
        <v-date-picker v-model="pickUpDate" @input="$refs.dateMenu.save(pickUpDate)"></v-date-picker>
      </v-menu>
      <v-menu
        ref="menu"
        :close-on-content-click="false"
        v-model="timeMenu"
        :nudge-right="40"
        :return-value.sync="pickUpTime"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
      >
        <v-text-field
          slot="activator"
          v-model="pickUpTime"
          label="乘車時間*"
          append-icon="access_time"
          readonly
        ></v-text-field>
        <v-time-picker v-model="pickUpTime" format="24hr" @change="$refs.menu.save(pickUpTime)"></v-time-picker>
      </v-menu>
      <v-text-field
          v-model="pickUpAddress"
          :error-messages="pickUpAddressErrors"
          :counter="10"
          label="乘車地址"
          required
          @input="$v.pickUpAddress.$touch()"
          @blur="$v.pickUpAddress.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="targetAddress"
          :error-messages="targetAddressErrors"
          :counter="10"
          label="目的地址"
          required
          @input="$v.targetAddress.$touch()"
          @blur="$v.targetAddress.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="name"
          :error-messages="nameErrors"
          :counter="10"
          label="姓名"
          required
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
        ></v-text-field>
        <!-- <v-text-field
          v-model="email"
          :error-messages="emailErrors"
          label="E-mail"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field> -->
        <v-text-field
          v-model="phone"
          :error-messages="phoneErrors"
          label="手機"
          required
          @input="$v.phone.$touch()"
          @blur="$v.phone.$touch()"
        ></v-text-field>
         <v-text-field
          v-model="totalPeople"
          :error-messages="totalPeopleErrors"
          label="人數"
          required
          @input="$v.totalPeople.$touch()"
          @blur="$v.totalPeople.$touch()"
        ></v-text-field>
        <v-btn @click="submit" class="primary">送出</v-btn>
      </form>
    </v-flex>
  </v-layout>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'
  export default {
    mixins: [validationMixin],
    validations: {
      name: { required },
      email: { email },
      serviceType: { required },
      phone: { required },
      totalPeople: { required },
      pickUpAddress: { required },
      targetAddress: { required }
    },
    data: () => ({
      serviceType: null,
      pickUpDate: null,
      dateMenu: false,
      pickUpTime: null,
      timeMenu: false,
      name: '',
      email: '',
      phone: null,
      totalPeople: 1,
      pickUpAddress: '',
      targetAddress: '',
      items: [
        '送機 (雙北 => 桃園機場)',
        '接機 (桃園機場 => 雙北)',
        '包車 (限同行政區)'
      ]
    }),
    computed: {
      serviceTypeErrors () {
        const errors = []
        if (!this.$v.serviceType.$dirty) return errors
        !this.$v.serviceType.required && errors.push('必填欄位')
        return errors
      },
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.required && errors.push('必填欄位')
        return errors
      },
      pickUpAddressErrors () {
        const errors = []
        if (!this.$v.pickUpAddress.$dirty) return errors
        !this.$v.pickUpAddress.required && errors.push('必填欄位')
        return errors
      },
      targetAddressErrors () {
        const errors = []
        if (!this.$v.targetAddress.$dirty) return errors
        !this.$v.targetAddress.required && errors.push('必填欄位')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('必須為有效的email')
        return errors
      },
      phoneErrors () {
        const errors = []
        if (!this.$v.phone.$dirty) return errors
        !this.$v.phone.required && errors.push('必填欄位')
        return errors
      },
      totalPeopleErrors () {
        const errors = []
        if (!this.$v.totalPeople.$dirty) return errors
        !this.$v.totalPeople.required && errors.push('必填欄位')
        return errors
      }
    },
    methods: {
      submit () {
        this.$v.$touch()
        fetch('/api/xxx')
      }
    }
  }
</script>