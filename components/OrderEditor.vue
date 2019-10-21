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
    <div class="text-xs-right px-4 pt-4 teal--text font-weight-bold carprice">
      費用試算：{{ orderPrice }}元
    </div>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-select
          v-model="serviceType"
          name="serviceType"
          :items="serviceItems"
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
              :error-messages="targetCityErrors"
            ></v-select>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs5>
            <v-select
              v-model="targetArea"
              :items="targetAreas"
              :disabled="isPreview || !targetAreas"
              label="地區"
              item-text="areaName"
              item-value="areaName"
              :error-messages="targetAreaErrors"
            ></v-select>
          </v-flex>
          <v-tooltip v-model="showTooltip" top>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" @click="showTooltip = !showTooltip"
                >help</v-icon
              >
            </template>
            <span
              >偏遠行政區暫不開放接送服務，含：淡水/汐止/深坑/石碇/瑞芳/坪林/烏來/萬里/三芝/金山/平溪/石門/雙溪/貢寮/新店花園新城/楊梅/龍潭/新屋/大溪/復興/芎林/橫山/北埔/峨眉/五峰/香山/尖石</span
            >
          </v-tooltip>
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
          :items="carPrices(serviceType)"
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
          v-model="identity"
          name="identity"
          :error-messages="identityErrors"
          :disabled="isPreview"
          label="身份證後四碼 (應交通法規需要)"
          @input="$v.identity.$touch()"
          @blur="$v.identity.$touch()"
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
        <v-radio-group v-model="payment" label="付款方式" row>
          <v-radio label="LINE PAY" value="LINE"></v-radio>
          <v-radio label="ATM轉帳" value="ATM"></v-radio>
        </v-radio-group>
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
import { required, email, maxLength, minLength } from 'vuelidate/lib/validators'
import cities from '@/assets/cities'
import { FETCH_CAR_PRICE, FETCH_REMINDER } from '@/store/types'
import { mapGetters } from 'vuex'
const { getCarPrice } = require('../api/utils/getCarPrice')

const formNames = {
  1: 'pickUpForm',
  2: 'basicInfoForm'
}

const serviceItems = [
  '送機 (雙北 => 桃園機場)',
  '接機 (桃園機場 => 雙北)',
  '送機 (雙北 => 松山機場)',
  '接機 (松山機場 => 雙北)'
]

const defaultData = {
  serviceType: serviceItems[0],
  planeNo: '',
  pickUpDate: null,
  pickUpTime: null,
  name: '',
  email: '',
  identity: '',
  phone: null,
  totalPeople: 1,
  luggage: '',
  targetCity: null,
  targetArea: '',
  targetAddress: '',
  carType: 'normal',
  remark: '',
  payment: 'line'
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
    targetCity: { required },
    targetArea: { required },
    targetAddress: { required, maxLength: maxLength(200) },
    luggage: { required, maxLength: maxLength(100) },
    totalPeople: { required },
    pickUpDate: { required },
    pickUpTime: { required },
    pickUpForm: [
      'serviceType',
      'targetCity',
      'targetArea',
      'targetAddress',
      'luggage',
      'totalPeople',
      'pickUpDate',
      'pickUpTime'
    ],
    planeNo: { required, maxLength: maxLength(25) },
    name: { required, maxLength: maxLength(100) },
    email: { email },
    identity: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(4)
    },
    phone: { required },
    remark: { maxLength: maxLength(200) },
    basicInfoForm: ['planeNo', 'name', 'phone', 'email', 'identity', 'remark']
  },
  data: () => ({
    ...defaultData,
    showTooltip: false,
    dateMenu: false,
    timeMenu: false,
    cities,
    serviceItems,
    step: 1
  }),
  computed: {
    ...mapGetters(['carPrices', 'reminder']),
    targetAreas() {
      return this.targetCity ? this.targetCity.areas : null
    },
    orderPrice() {
      if (!this.pickUpTime) {
        return 0
      }
      return getCarPrice({
        car: this.carPrices(this.serviceType).find(
          car => car.carType === this.carType
        ),
        pickUpTime: this.pickUpTime
      })
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
    targetCityErrors() {
      const errors = []
      if (!this.$v.targetCity.$dirty) return errors
      !this.$v.targetCity.required && errors.push('必填欄位')
      return errors
    },
    targetAreaErrors() {
      const errors = []
      if (!this.$v.targetArea.$dirty) return errors
      !this.$v.targetArea.required && errors.push('必填欄位')
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
    identityErrors() {
      const errors = []
      if (!this.$v.identity.$dirty) return errors
      !this.$v.identity.required && errors.push('必填欄位')
      !this.$v.identity.minLength && errors.push('低於限制長度')
      !this.$v.identity.maxLength && errors.push('超過限制長度')
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
  async mounted() {
    await Promise.all([
      this.$store.dispatch(FETCH_CAR_PRICE),
      this.$store.dispatch(FETCH_REMINDER)
    ])
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
          identity: this.identity,
          email: this.email,
          totalPeople: this.totalPeople,
          remark: this.remark,
          luggage: this.luggage,
          carType: this.carType,
          payment: this.payment
        })

        location.href = response.redirectUrl

        Object.assign(this.$data, this.$options.data.apply(this))
        this.$v.$reset()
      } catch (err) {
        alert(err)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.carprice {
  font-size: 24px;
}
</style>
