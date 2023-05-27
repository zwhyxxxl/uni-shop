export default {
  // 为当前模块开启命名空间
  namespaced: true,
  // 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count,      goods_small_logo, goods_state    }
    cart: JSON.parse(uni.getStorageSync('cart') || "[]")
  }),
  // 模块的 mutations 方法
  mutations: {
    addToCart(state, goods) {
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        // 如果购物车中有这件商品，则只更新数量即可
        findResult.goods_count++
      }
      this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    updateGoodsState(state, goods) {
      state.cart.forEach(item => {
        if (item.goods_id === goods.goods_id) {
          item.goods_state = goods.goods_state
        }
      })
      this.commit('m_cart/saveToStorage')
    },
    removeGoodsById(state, id) {
      state.cart = state.cart.filter(item => item.goods_id !== id)
      this.commit('m_cart/saveToStorage')
    },
    updateGoodsNum(state, goods) {
      // console.log('4');
      state.cart.forEach(item => {
        if (item.goods_id === goods.goods_id) {
          item.goods_count = goods.goods_count
        }
      })
      this.commit('m_cart/saveToStorage')

    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(x => x.goods_state = newState)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  },
  // 模块的 getters 属性
  getters: {
    // 统计购物车中商品的总数量
    total(state) {
      let c = 0
      // 循环统计商品的数量，累加到变量 c 中
      state.cart.forEach(goods => c += goods.goods_count)
      return c
    },
    checkedCount(state) {
      return state.cart.filter(item => item.goods_state).reduce((total, item) => total + item.goods_count, 0)
    },
    checkedGoodsAmount(state) {
      return state.cart.filter(item => item.goods_state).reduce((total, item) => total + item.goods_count * item
        .goods_price, 0).toFixed(2)
    }
  }
}