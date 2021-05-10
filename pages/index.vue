<template>
  <b-container class="text-center">
    <b-overlay
      :show="busy"
      rounded
      opacity="0.6"
      spinner-big
      spinner-variant="primary"
      class="d-inline-block w-75"
    >
      <b-form method="post" class="text-left">
        <b-col class="pl-0 pr-0">
          <label for="email">Email address / 信箱</label>
          <b-form-input
            type="email"
            class="form-control"
            name="email"
            placeholder="Email"
            v-model="form.email"
            :state="valEmailState"
            ref="em"
          />
        </b-col>
        <b-col class="mt-3 pl-0 pr-0">
          <label for="exampleInputName"
            >Card Holder Name / 信用卡持卡人姓名</label
          >
          <b-form-input
            type="text"
            class="form-control"
            name="name"
            placeholder="Card Holder Name / 信用卡持卡人姓名"
            v-model="form.name"
            :state="valNameState"
            ref="nm"
          />
        </b-col>
        <b-col class="mt-3 pl-0 pr-0">
          <label for="contactNumber">Contact Number / 聯絡電話</label>
          <b-form-input
            type="text"
            class="form-control"
            name="phoneNumber"
            placeholder="Contact Number"
            v-model="form.phoneNumber"
            :state="valPhoneState"
            ref="ph"
          />
        </b-col>
        <b-form-row class="hide">
          <b-col class="mt-3 pl-0 pr-0">
            <b-form-input
              type="text"
              class="form-control"
              name="amt"
              v-model="form.amt"
            />
          </b-col>
          <b-col class="mt-3 pl-0 pr-0">
            <b-form-input
              type="text"
              class="form-control"
              name="orderNumber"
              v-model="form.orderNumber"
            />
          </b-col>
        </b-form-row>
        <b-col class="mt-4 p-0">
          <b-alert show variant="success">
            <h3>Detail / 訂單資訊</h3>
            <hr />
            Order （訂單編號）: {{ form.orderNumber }} <br />
            Adult (成人): {{ adultNum }}<br />
            Kid (小孩): {{ kidNum }}<br /><br />
            <h5>
              Total Price （總額）:
              {{
                form.amt.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,')
              }}
              TWD
            </h5>
          </b-alert>
        </b-col>
        <b-col class="mt-4 p-0 text-right">
          <b-button
            variant="warning"
            type="submit"
            formaction="https://www.taiwanviptravel.com/payment/newwebpay/"
            >Submit / 送出</b-button
          >
        </b-col>
      </b-form>
    </b-overlay>
  </b-container>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {
      busy: true,
      adultNum: 0,
      kidNum: 0,
      form: {
        email: '',
        name: '',
        phoneNumber: '',
        orderNumber: '',
        amt: 0,
      },
    }
  },
  computed: {
    ...mapMutations(['SET_TOKEN', 'SET_ORDERNUMBER']),
    ...mapGetters([
      'GET_TOKEN',
      'GET_ORDERNUMBER',
      'GET_USERNAME',
      'GET_PASSWORD',
    ]),
    valEmailState() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(this.form.email)
    },
    valNameState() {
      return this.form.name.length >= 2
    },
    valPhoneState() {
      return this.form.phoneNumber.length >= 6
    },
  },
  mounted() {
    this.$store.commit('SET_ORDERNUMBER', this.$route.query.orderNumber)
    this.getToken()
  },
  methods: {
    getToken() {
      const config = {
        method: 'POST',
        url:
          'https://ofc.taiwanviptravel.com/fmi/data/v1/databases/TVT/sessions',
        headers: {
          Authorization:
            `Basic ` + btoa(`${this.GET_USERNAME}:${this.GET_PASSWORD}`),
          'Content-Type': 'application/json',
        },
        data: {},
      }
      const apiGetToken = async () => {
        const res = await this.$axios(config)
        const data = await res.data.response
        this.$store.commit('SET_TOKEN', data.token)
        this.getOrder()
      }
      apiGetToken()
    },
    getOrder() {
      const query = JSON.stringify({
        query: [
          {
            RS_salesNumber: this.GET_ORDERNUMBER,
          },
        ],
      })
      const config = {
        method: 'POST',
        url:
          'https://ofc.taiwanviptravel.com/fmi/data/v1/databases/TVT/layouts/DATA_API_SALESORDER/_find',
        headers: {
          Authorization: `Bearer ${this.GET_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: query,
      }
      const apiGetPackage = async () => {
        const res = await this.$axios(config)
        const data = await res.data.response.data[0].fieldData
        // console.log(data)
        const json = JSON.parse(data.json_byNumber)
        this.form.email = json.register.email
        this.form.phoneNumber =
          json.register.phoneCode + json.register.phoneNumber
        this.form.orderNumber = data.RS_salesNumber
        this.adultNum = data.no_of_adult
        this.kidNum = data.no_of_kid
        this.form.amt = data.accountReceivable
        this.busy = false
      }
      apiGetPackage()
    },
    // onSubmit() {
      // const data= JSON.stringify(this.form)
      // const config = {
      //   methods:'POST',
      //   url: 'http://localhost/paynewebpay/',
      //   headers: {'Content_type': 'application/json'},
      //   data: data
      // }
      // const runApi = async () => {
      //   const res = await this.$axios(config)
      //   const data = res.data
      //   console.log(data)
      // }
      // runApi()
    //   const data = JSON.stringify(this.form)

    //   runApi().then((response) => {
    //     // const json = JSON.parse(response)
    //     console.log(response)
    //   })

    //   function runApi() {
    //     return fetch('https://www.taiwanviptravel.com/payment/newwebpay/', {
    //       method: 'post',
    //       body: data,
    //     })
    //       .then((res) => res.json())
    //       .then(function (data) {
    //         return data
    //       })
    //       .catch((error) => {
    //         console.error('Error:', error)
    //       })
    //   }
    // },
  },
}
</script>

<style scoped>
.hide {
  display: none;
}
/* @media screen and (max-width: 720px){
  .d-inline-block{
    width: 100%;
  }
}
@media screen and (min-width: 720px){
  .d-inline-block{
    width: 75%;
  }
} */
</style>
