<template>
  <v-layout align-center justify-center>
    <v-flex sm8 md8>
      <v-card class="elevation-12 ma-3">
        <v-toolbar dark color="blue lighten-1">
          <v-toolbar-title>後台登入</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="username"
              :error-messages="usernameErrors"
              prepend-icon="person"
              required
              name="login"
              label="帳號"
              type="text"
              @input="formError = null"
              @blur="$v.username.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="password"
              :error-messages="passwordErrors"
              prepend-icon="lock"
              required
              name="password"
              label="密碼"
              type="password"
              @input="formError = null"
              @blur="$v.password.$touch()"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark="" color="blue lighten-1" @click="login">登入</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
  layout: 'default',
  mixins: [validationMixin],
  validations: {
    username: { required },
    password: { required }
  },
  data: () => ({
    drawer: null,
    formError: null,
    username: '',
    password: ''
  }),
  computed: {
    usernameErrors() {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push('必填欄位')
      if (this.formError) errors.push(this.formError)
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('必填欄位')
      if (this.formError) errors.push(this.formError)
      return errors
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        })
        this.formError = null
        this.$router.push('/order/list')
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>
