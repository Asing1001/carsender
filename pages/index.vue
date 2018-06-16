<template>
  <v-layout >
    <v-flex xs12 sm8 md6>
      <form>
        <v-select
          v-model="select"
          :items="items"
          :error-messages="selectErrors"
          label="服務類型"
          required
          @change="$v.select.$touch()"
          @blur="$v.select.$touch()"
        ></v-select>
        <v-menu
        ref="dateMenu"
        :close-on-content-click="false"
        v-model="dateMenu"
        :nudge-right="40"
        :return-value.sync="date"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <v-text-field
          slot="activator"
          v-model="date"
          label="乘車日期"
          append-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="date" @input="$refs.dateMenu.save(date)"></v-date-picker>

      </v-menu>
      <v-menu
        ref="menu"
        :close-on-content-click="false"
        v-model="timeMenu"
        :nudge-right="40"
        :return-value.sync="time"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
      >
        <v-text-field
          slot="activator"
          v-model="time"
          label="乘車時間"
          append-icon="access_time"
          readonly
        ></v-text-field>
        <v-time-picker v-model="time" format="24hr" @change="$refs.menu.save(time)"></v-time-picker>
      </v-menu>
      <v-text-field
          v-model="pickUpPlace"
          :error-messages="pickUpPlaceErrors"
          :counter="10"
          label="乘車地址"
          required
          @input="$v.pickUpPlace.$touch()"
          @blur="$v.pickUpPlace.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="targetPlace"
          :error-messages="targetPlaceErrors"
          :counter="10"
          label="目的地"
          required
          @input="$v.targetPlace.$touch()"
          @blur="$v.targetPlace.$touch()"
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
      select: { required },
      phone: { required },
      totalPeople: { required },
      pickUpPlace: { required },
      targetPlace: { required }
    },
    data: () => ({
      select: null,
      date: null,
      dateMenu: false,
      time: null,
      timeMenu: false,
      name: '',
      email: '',
      phone: null,
      totalPeople: 1,
      pickUpPlace: '',
      targetPlace: '',
      items: [
        '送機 (雙北=>桃園機場)',
        '接機 (桃園機場=>雙北)',
        '包車 (限同行政區)'
      ]
    }),
    computed: {
      selectErrors () {
        const errors = []
        if (!this.$v.select.$dirty) return errors
        !this.$v.select.required && errors.push('必填欄位')
        return errors
      },
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.required && errors.push('必填欄位')
        return errors
      },
      pickUpPlaceErrors () {
        const errors = []
        if (!this.$v.pickUpPlace.$dirty) return errors
        !this.$v.pickUpPlace.required && errors.push('必填欄位')
        return errors
      },
      targetPlaceErrors () {
        const errors = []
        if (!this.$v.targetPlace.$dirty) return errors
        !this.$v.targetPlace.required && errors.push('必填欄位')
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