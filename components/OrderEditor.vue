<template>
  <v-card class="px-3 pb-3 pt-1">
    <v-form>
      <v-select
        v-model="serviceType"
        :items="items"
        :error-messages="serviceTypeErrors"
        :disabled="isPreview"
        label="預約類型"
        required
        @change="$v.serviceType.$touch()"
        @blur="$v.serviceType.$touch()"
      ></v-select>
      <v-text-field
        v-model="planeNo"
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
      <v-layout v-if="!isPickUp" row>
        <v-flex xs5>
          <v-select
            v-model="pickUpCity"
            :items="cities"
            label="乘車縣市"
            item-text="cityName"
            :item-value="item => item"
            :disabled="isPreview"
          ></v-select>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs6>
          <v-select
            v-model="pickUpArea"
            :items="pickUpCity.areas"
            :disabled="isPreview"
            label="乘車地區"
            item-text="areaName"
            item-value="areaName"
          ></v-select>
        </v-flex>
      </v-layout>
      <v-text-field
        v-if="!isPickUp"
        v-model="pickUpAddress"
        :error-messages="pickUpAddressErrors"
        :counter="200"
        :disabled="isPreview"
        label="乘車地址"
        required
        @input="$v.pickUpAddress.$touch()"
        @blur="$v.pickUpAddress.$touch()"
      ></v-text-field>
      <v-layout v-if="isPickUp" row>
        <v-flex xs5>
          <v-select
            v-model="targetCity"
            :items="cities"
            :disabled="isPreview"
            label="目的縣市"
            item-text="cityName"
            :item-value="item => item"
          ></v-select>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs6>
          <v-select
            v-model="targetArea"
            :items="targetCity.areas"
            :disabled="isPreview"
            label="目的地區"
            item-text="areaName"
            item-value="areaName"
          ></v-select>
        </v-flex>
      </v-layout>
      <v-text-field
        v-if="isPickUp"
        v-model="targetAddress"
        :error-messages="targetAddressErrors"
        :counter="200"
        :disabled="isPreview"
        label="目的地址"
        required
        @input="$v.targetAddress.$touch()"
        @blur="$v.targetAddress.$touch()"
      ></v-text-field>
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
        v-model="totalPeople"
        :error-messages="totalPeopleErrors"
        :disabled="isPreview"
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
      <v-text-field
        v-model="remark"
        label="備註"
        :error-messages="remarkErrors"
        :counter="200"
        :disabled="isPreview"
        @input="$v.remark.$touch()"
        @blur="$v.remark.$touch()"
      ></v-text-field>
      <p style="white-space:pre-wrap">
        1. 請再次確認資訊，送出後無法更改。 2.
        懇請於48小時前預約，行程欲取消或更正，請直接致電司機。 3.
        目前暫時不提供加點、舉牌、嬰兒椅服務，敬請見諒。 4.
        行李請自行斟酌空間，若超過乘載導致無法接送，恕不退費。 5.
        所有車輛皆為2.0以上規格，請享受搭乘。
      </p>
      <v-btn v-if="isPreview" class="primary" @click="submit">送出</v-btn>
      <v-btn v-else class="secondary" @click="preview">預覽</v-btn>
    </v-form>
  </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, maxLength } from 'vuelidate/lib/validators'
import cities from '~/assets/cities'
const STEP = {
  EDIT: 'edit',
  PREVIEW: 'preview'
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
  pickUpCity: { areas: [] },
  pickUpArea: '',
  pickUpAddress: '',
  targetCity: { areas: [] },
  targetArea: '',
  targetAddress: '',
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
    planeNo: { required, maxLength: maxLength(25) },
    pickUpDate: { required },
    pickUpTime: { required },
    name: { required, maxLength: maxLength(100) },
    email: { email },
    phone: { required },
    totalPeople: { required },
    luggage: { required, maxLength: maxLength(100) },
    pickUpAddress: { required, maxLength: maxLength(200) },
    targetAddress: { required, maxLength: maxLength(200) },
    remark: { maxLength: maxLength(200) }
  },
  data: () => ({
    ...defaultData,
    dateMenu: false,
    timeMenu: false,
    isPickUp: false,
    cities,
    items: ['送機 (雙北 => 桃園機場)', '接機 (桃園機場 => 雙北)'],
    step: STEP.EDIT
  }),
  computed: {
    isPreview() {
      return this.step === STEP.PREVIEW
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
    pickUpAddressErrors() {
      const errors = []
      if (!this.$v.pickUpAddress.$dirty) return errors
      !this.$v.pickUpAddress.required && errors.push('必填欄位')
      !this.$v.pickUpAddress.maxLength && errors.push('超過限制長度')
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
  watch: {
    serviceType(value) {
      this.isPickUp = this.items.indexOf(value) === 1
      if (this.isPickUp) {
        this.pickUpCity = { areas: [] }
        this.pickUpArea = this.targetAddress = ''
        this.pickUpAddress = '桃園機場'
      } else {
        this.targetCity = { areas: [] }
        this.targetArea = ''
        this.pickUpAddress = ''
        this.targetAddress = '桃園機場'
      }
    }
  },
  methods: {
    preview() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.step = STEP.PREVIEW
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
          pickUpCity: this.pickUpCity.cityName,
          pickUpArea: this.pickUpArea,
          pickUpAddress: this.pickUpAddress,
          targetCity: this.targetCity.cityName,
          targetArea: this.targetArea,
          targetAddress: this.targetAddress,
          name: this.name,
          phone: this.phone,
          email: this.email,
          totalPeople: this.totalPeople,
          remark: this.remark,
          luggage: this.luggage,
          carType: 'normal'
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
