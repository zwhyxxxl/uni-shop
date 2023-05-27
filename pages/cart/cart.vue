<template>
  <view>
    <view class="cart-container" v-if="cart.length !== 0">
      <!-- 购物车组件 -->
      <my-address></my-address>
      <!-- 购物车商品列表的标题区域 -->
      <view class="cart-title">
        <!-- 左侧的图标 -->
        <uni-icons type="shop" size="18"></uni-icons>
        <!-- 描述文本 -->
        <text class="cart-title-text">购物车</text>
      </view>
      <!-- 商品列表 -->
      <!-- 商品列表区域 -->
      <!-- uni-swipe-action 是最外层包裹性质的容器 -->
      <!-- 循环渲染购物车中的商品信息 -->

      <uni-swipe-action>
        <block v-for="(goods, i) in cart" :key="i">
          <uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
            <my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler"
              @num-change="numberChangeHandler"></my-goods>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>
      <!-- 空白购物车区域 -->

      <!-- 自定义结算组件 -->
      <my-settle></my-settle>

    </view>
    <view class="empty-cart" v-else>
      <image src="/static/cart_empty@2x.png" class="empty-img"></image>
      <text class="tip-text">空空如也~</text>
    </view>
  </view>

</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import { mapState, mapGetters } from 'vuex'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#C00000'
          }
        }]
      };
    },
    methods: {
      setBadge() {
        // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
        uni.setTabBarBadge({
          index: 2,
          text: this.total + '', // 注意：text 的值必须是字符串，不能是数字
        })
      },
      // ...mapMutations('m_cart', ['updateGoodsState']),
      radioChangeHandler(e) {
        console.log(e);
        this.$store.commit('m_cart/updateGoodsState', e)
      },
      numberChangeHandler(e) {
        this.$store.commit('m_cart/updateGoodsNum', e)
        // console.log(e);
      },
      swipeItemClickHandler(goods) {
        this.$store.commit('m_cart/removeGoodsById', goods.goods_id)
        console.log(goods);
      }
    },
    watch: {
      // 1. 监听 total 值的变化， 通过第一个形参得到变化后的新值
      total(newVal) {
        // 2. 通过数组的 find() 方法，找到购物车按钮的配置对象
        this.setBadge()
      }

    },
    computed: {
      ...mapState('m_cart', ['cart']),
      ...mapGetters('m_cart', ['total'])
    },
    onShow() {
      // 在页面刚展示的时候，设置数字徽标
      this.setBadge()
    },
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }

  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: start;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      margin-left: 10px;
    }
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>