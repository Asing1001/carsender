<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1" :editable="step > 1"
        >乘車資訊</v-stepper-step
      >
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 2" step="2" :editable="step > 2"
        >基本資料</v-stepper-step
      >
      <v-divider></v-divider>
      <v-stepper-step step="3">付款</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-select
          v-model="serviceType"
          name="serviceType"
          :items="items"
          :error-messages="serviceTypeErrors"
          :disabled="isPreview"
          label="預約類型"
          required
          @change="$v.serviceType.$touch()"
          @blur="$v.serviceType.$touch()"
        ></v-select>
        <v-layout row>
          <v-flex xs5>
            <v-select
              v-model="targetCity"
              :items="cities"
              :disabled="isPreview"
              label="縣市"
              item-text="cityName"
              :item-value="item => item"
              :error-messages="targetAddressErrors"
            ></v-select>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs6>
            <v-select
              v-model="targetArea"
              :items="targetCity.areas"
              :disabled="isPreview"
              label="地區"
              item-text="areaName"
              item-value="areaName"
              :error-messages="targetAddressErrors"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-text-field
          v-model="targetAddress"
          :error-messages="targetAddressErrors"
          :counter="200"
          :disabled="isPreview"
          label="地址"
          required
          @input="$v.targetAddress.$touch()"
          @blur="$v.targetAddress.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="totalPeople"
          :error-messages="totalPeopleErrors"
          :disabled="isPreview"
          type="number"
          label="人數"
          required
          @input="$v.totalPeople.$touch()"
          @blur="$v.totalPeople.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="luggage"
          :error-messages="luggageErrors"
          :disabled="isPreview"
          label="行李數(可標明吋數)"
          required
          @input="$v.luggage.$touch()"
          @blur="$v.luggage.$touch()"
        ></v-text-field>
        <v-select
          v-model="carType"
          :items="carPrices"
          label="選擇車種"
          item-text="displayName"
          :item-value="item => item.carType"
          :disabled="isPreview"
        ></v-select>
        <v-btn color="primary" @click="nextStep">下一步</v-btn>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-text-field
          v-model="planeNo"
          name="planNo"
          :error-messages="planeNoErrors"
          :counter="25"
          :disabled="isPreview"
          label="航班編號 (ex: CX-123)"
          required
          @input="$v.planeNo.$touch()"
          @blur="$v.planeNo.$touch()"
        ></v-text-field>
        <v-menu
          ref="dateMenu"
          v-model="dateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="pickUpDate"
          :disabled="isPreview"
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
            :disabled="isPreview"
            :error-messages="pickUpDateErrors"
          ></v-text-field>
          <v-date-picker
            v-model="pickUpDate"
            @input="$refs.dateMenu.save(pickUpDate)"
          ></v-date-picker>
        </v-menu>
        <v-menu
          ref="menu"
          v-model="timeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="pickUpTime"
          :disabled="isPreview"
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
            :disabled="isPreview"
            :error-messages="pickUpTimeErrors"
          ></v-text-field>
          <v-time-picker
            v-model="pickUpTime"
            format="24hr"
            @change="$refs.menu.save(pickUpTime)"
          ></v-time-picker>
        </v-menu>
        <v-text-field
          v-model="name"
          name="name"
          :error-messages="nameErrors"
          :counter="100"
          :disabled="isPreview"
          label="姓名"
          required
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="phone"
          name="phone"
          :error-messages="phoneErrors"
          label="手機"
          :disabled="isPreview"
          required
          @input="$v.phone.$touch()"
          @blur="$v.phone.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="email"
          name="email"
          :error-messages="emailErrors"
          :disabled="isPreview"
          label="E-mail"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="remark"
          label="備註"
          :error-messages="remarkErrors"
          :counter="200"
          :disabled="isPreview"
          @input="$v.remark.$touch()"
          @blur="$v.remark.$touch()"
        ></v-text-field>
        <v-btn flat @click="previousStep">上一步</v-btn>
        <v-btn class="secondary" @click="nextStep">下一步</v-btn>
      </v-stepper-content>
      <v-stepper-content step="3">
        <p style="white-space:pre-wrap">{{ reminder }}</p>
        <embed src="/contract.pdf" width="100%" height="400px" />
        <v-btn flat @click="previousStep">上一步</v-btn>
        <v-btn class="primary" @click="submit">同意請點此付款</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, maxLength } from 'vuelidate/lib/validators'
import cities from '~/assets/cities'
import { FETCH_CAR_PRICE } from '@/store/types'
import { mapGetters } from 'vuex'

const formNames = {
  1: 'pickUpForm',
  2: 'basicInfoForm'
}

const defaultData = {
  serviceType: null,
  planeNo: '',
  pickUpDate: null,
  pickUpTime: null,
  name: '',
  email: '',
  phone: null,
  totalPeople: 1,
  luggage: '',
  targetCity: { areas: [] },
  targetArea: '',
  targetAddress: '',
  carType: 'normal',
  remark: ''
}
export default {
  mixins: [validationMixin],
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  validations: {
    serviceType: { required },
    targetAddress: { required, maxLength: maxLength(200) },
    targetCity: { required },
    targetArea: { required },
    luggage: { required, maxLength: maxLength(100) },
    totalPeople: { required },
    pickUpForm: [
      'serviceType',
      'targetAddress',
      'targetCity',
      'targetArea',
      'luggage',
      'totalPeople'
    ],

    planeNo: { required, maxLength: maxLength(25) },
    pickUpDate: { required },
    pickUpTime: { required },
    name: { required, maxLength: maxLength(100) },
    email: { email },
    phone: { required },
    remark: { maxLength: maxLength(200) },
    basicInfoForm: [
      'planeNo',
      'pickUpDate',
      'pickUpTime',
      'name',
      'phone',
      'email',
      'remark'
    ]
  },
  data: () => ({
    ...defaultData,
    dateMenu: false,
    timeMenu: false,
    cities,
    items: ['送機 (雙北 => 桃園機場)', '接機 (桃園機場 => 雙北)'],
    step: 1,
    reminder: `1. 請再次確認資訊，送出後無法更改。\n2. 懇請於48小時前預約，行程欲取消或更正，請直接致電司機。\n3. 目前暫時不提供加點、舉牌、嬰兒椅服務，敬請見諒。\n4. 行李請自行斟酌空間，若超過乘載導致無法接送，恕不退費。\n5. 所有車輛皆為2.0以上規格，請享受搭乘。`
  }),
  computed: {
    ...mapGetters(['carPrices']),
    isPickUp() {
      return this.items.indexOf(this.serviceType) === 1
    },
    isPreview() {
      return false
    },
    serviceTypeErrors() {
      const errors = []
      if (!this.$v.serviceType.$dirty) return errors
      !this.$v.serviceType.required && errors.push('請選擇一種類型')
      return errors
    },
    planeNoErrors() {
      const errors = []
      if (!this.$v.planeNo.$dirty) return errors
      !this.$v.planeNo.required && errors.push('必填欄位')
      !this.$v.planeNo.maxLength && errors.push('超過限制長度')
      return errors
    },
    pickUpDateErrors() {
      const errors = []
      if (!this.$v.pickUpDate.$dirty) return errors
      !this.$v.pickUpDate.required && errors.push('請選擇日期')
      return errors
    },
    pickUpTimeErrors() {
      const errors = []
      if (!this.$v.pickUpTime.$dirty) return errors
      !this.$v.pickUpTime.required && errors.push('請選擇時間')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('必填欄位')
      !this.$v.name.maxLength && errors.push('超過限制長度')
      return errors
    },
    targetAddressErrors() {
      const errors = []
      if (!this.$v.targetAddress.$dirty) return errors
      !this.$v.targetAddress.required && errors.push('必填欄位')
      !this.$v.targetAddress.maxLength && errors.push('超過限制長度')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('必須為有效的email')
      return errors
    },
    phoneErrors() {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.required && errors.push('必填欄位')
      return errors
    },
    totalPeopleErrors() {
      const errors = []
      if (!this.$v.totalPeople.$dirty) return errors
      !this.$v.totalPeople.required && errors.push('必填欄位')
      return errors
    },
    luggageErrors() {
      const errors = []
      if (!this.$v.luggage.$dirty) return errors
      !this.$v.luggage.required && errors.push('必填欄位')
      return errors
    },
    remarkErrors() {
      const errors = []
      if (!this.$v.remark.$dirty) return errors
      !this.$v.remark.maxLength && errors.push('超過限制長度')
      return errors
    }
  },
  async created() {
    await this.$store.dispatch(FETCH_CAR_PRICE)
  },
  methods: {
    previousStep() {
      this.step--
    },
    nextStep() {
      const formName = formNames[this.step]
      this.$v[formName].$touch()
      if (this.$v[formName].$invalid) {
        return
      }
      this.step++
    },
    async submit() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      try {
        const response = await this.$store.dispatch('createOrder', {
          serviceType: this.serviceType,
          planeNo: this.planeNo,
          pickUpDate: this.pickUpDate,
          pickUpTime: this.pickUpTime,
          targetCity: this.targetCity.cityName,
          targetArea: this.targetArea,
          targetAddress: this.targetAddress,
          name: this.name,
          phone: this.phone,
          email: this.email,
          totalPeople: this.totalPeople,
          remark: this.remark,
          luggage: this.luggage,
          carType: this.carType
        })
        location.href = response.paymentUrl
        Object.assign(this.$data, this.$options.data.apply(this))
        this.$v.$reset()
      } catch (err) {
        alert(err)
      }
    }
  }
}
</script>
