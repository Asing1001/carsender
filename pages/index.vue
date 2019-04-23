<template>
  <div>
    <v-parallax :src="backgroundImg" :height="windowHeight">
      <v-container d-flex align-center fluid="true">
        <div class="text-xs-center primary--text">
          <h1>凡亨國際租賃有限公司</h1>
          <p>選擇凡亨，凡事亨通</p>
          <p>
            機場接送、包車旅遊、醫療接駁、<br />企業長租、個人短租、新舊車買賣
          </p>
          <v-btn slot="activator" color="primary" dark to="/order/create">
            開始預約
          </v-btn>
        </div>
      </v-container>
    </v-parallax>
    <!-- <section class="blue-grey darken-4 pa-3">
      <h3 class="text-xs-center font-weight-bold white--text pa-3 display-2">
        簡介
      </h3>
      <p>
        本著對服務的熱誠，致力於提供安全、專業、合法的接送服務，亦有企業長租、個人短租、新舊車買賣等的整合服務。
      </p>
      <p>
        在機場接送、包車旅遊、醫療接駁、企業長租、個人短租、新舊車買賣等領域扎根多年，秉持以客為尊的精神，結合優質舒適的車輛、耐心熱誠的司機，打造專業且合法的接駁團隊，絕對是您最值得信賴的合作夥伴。
      </p>
    </section> -->
    <section class="pa-3 primary--text features">
      <h3 class="text-xs-center font-weight-bold  pa-4 features__title">
        車輛及服務優勢
      </h3>
      <v-layout justify-center wrap>
        <v-flex
          v-for="(feature, index) in features"
          :key="index"
          md2
          xs12
          class="pa-2"
        >
          <p class="text-xs-center">
            <v-icon class="teal--text features__icon"
              >fas fa-{{ feature.icon }}</v-icon
            >
          </p>
          <p class="text-xs-center font-weight-bold features__subtitle">
            {{ feature.name }}
          </p>
          <p class="text-xs-center">{{ feature.description }}</p>
        </v-flex>
      </v-layout>
    </section>
    <section class="blue lighten-5 pa-4 primary--text cartypes">
      <h3 class="text-xs-center font-weight-bold pa-4 cartypes__title">
        豐富車型
      </h3>
      <v-layout class="">
        <v-flex md6 xs12>
          <img src="~/assets/img/car_inside.jpg" class="px-5" />
        </v-flex>
        <v-flex md6 xs12="px-3" class="cartypes__carname">
          <p v-for="(car, index) in cars" :key="index">
            <v-icon class="teal--text px-2">fas fa-angle-right</v-icon>
            {{ car.name }}
          </p>
        </v-flex>
      </v-layout>
    </section>
    <section class="text-xs-center pa-1">
      <a href="https://line.me/R/ti/p/%40mdb4272l"
        ><img
          height="36"
          border="0"
          alt="加入好友"
          src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
      /></a>
    </section>
  </div>
</template>
<script>
import backgroundImg from '~/assets/img/car.jpg'
export default {
  layout: 'home',
  data() {
    return {
      windowHeight: this.$isServer ? 500 : window.innerHeight,
      backgroundImg,
      features: [
        {
          icon: 'lock',
          name: '合法租賃牌',
          description: '車輛皆為政府核准特許之合法租賃牌。'
        },
        {
          icon: 'fas fa-user-shield',
          name: '責任險1000萬元',
          description: '全車每位乘客體傷責任險1000萬元。'
        },
        {
          icon: 'fas fa-map-marker-alt',
          name: '定位系統',
          description: '車輛衛星定位系統，隨時掌握車輛動向。'
        },
        {
          icon: 'fas fa-car',
          name: '五年內新車',
          description: '轎車、廂型等五年內新車，提供舒適品質。'
        },
        {
          icon: 'fas fa-users',
          name: '調派便利',
          description: '資源豐富，依照需求調派便利。'
        }
      ],
      cars: [
        {
          image: '',
          name: 'VW T6'
        },
        {
          image: '',
          name: 'VW T5'
        },
        {
          image: '',
          name: 'BENZ'
        },
        {
          image: '',
          name: 'TOYOTA WISH'
        },
        {
          image: '',
          name: 'TOYOTA ALTIS'
        },
        {
          image: '',
          name: 'TOYOTA VIOS'
        }
      ]
    }
  }
}
</script>
<style lang="stylus" scoped>
.features{

  .features__title{
    font-size 24px

  }
 .features__icon{
   font-size 40px
 }
  .features__subtitle{
    font-size 16px
  }
}
.cartypes{
  .cartypes__title{
    font-size 24px
  }
  .cartypes__carname{
    font-size 16px
  }
}
</style>
