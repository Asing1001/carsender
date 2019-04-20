<template>
  <div>
    <v-carousel class="carousel" height="200">
      <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src">
      </v-carousel-item>
    </v-carousel>
    <div class="content">
      <h1>凡亨國際租賃有限公司</h1>
      <p>選擇凡亨，凡事亨通</p>
      <p>機場接送、包車旅遊、醫療接駁、<br />企業長租、個人短租、新舊車買賣</p>
      <v-btn slot="activator" color="primary" dark to="/order/create">
        開始預約
      </v-btn>
    </div>
    <section>
      <h5 class="text-md-center">簡介</h5>
    </section>
    <section>
      <h5 class="text-md-center">車輛及服務優勢</h5>
      <v-layout justify-center wrap>
        <v-flex v-for="(feature, index) in features" :key="index" md2 xs12>
          <v-icon>fas fa-{{ feature.icon }}</v-icon>
          <p>{{ feature.name }}</p>
          <p>{{ feature.description }}</p>
        </v-flex>
      </v-layout>
      <h5 class="text-md-center">豐富車型</h5>
      <v-layout justify-center wrap>
        <v-flex v-for="(car, index) in cars" :key="index" md2 xs6>
          <p>{{ car.name }}</p>
        </v-flex>
      </v-layout>
    </section>
  </div>
</template>
<script>
export default {
  layout: 'home',
  data() {
    return {
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
      ],
      items: [
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
        }
      ]
    }
  }
}
</script>
<style lang="stylus" scoped></style>
