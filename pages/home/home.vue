<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="item in swiperList" :key="item.id">
        <navigator :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`" class="swiper-item">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <view class="nav-list">
      <view @click="navClickHandler(item.name)" class="nav-item" v-for="(item, i) in navList" :key="i">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>
    <view class="floor-list">
      <view class="floor-item" v-for="(item,index) in floorList" :key="index">
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width:`${item.product_list[0].image_width}rpx`}"
              mode="widthFix">
            </image>
          </navigator>
          <!-- 右侧 -->
          <view class="right-img-box">
            <navigator v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2!==0" :url="item2.url">
              <img :src="item2.image_src" alt="" :style="{width:`${item2.image_width}rpx`}" mode="widthFix">
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        swiperList: [],
        navList: [],
        floorList: []
      }
    },
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      async getSwiperList() {
        const { data } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // console.log(data)
        //请求失败
        if (data.meta.status !== 200) {
          return uni.$showMsg()
        }
        this.swiperList = data.message
        // uni.$showMsg('数据请求成功')
      },
      async getNavList() {
        const { data } = await uni.$http.get('/api/public/v1/home/catitems')
        // console.log(data)
        if (data.meta.status !== 200) {
          return uni.$showMsg()
        }
        this.navList = data.message
        // uni.$showMsg('数据请求成功')
      },
      navClickHandler(name) {
        if (name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      //获取首页楼层数据
      async getFloorList() {
        const { data } = await uni.$http.get('/api/public/v1/home/floordata')
        // console.log(data)
        if (data.meta.status !== 200) {
          return uni.$showMsg()
        }
        //对数据进行处理
        data.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = data.message
        // console.log(data)
        // uni.$showMsg('数据请求成功')
      },
      gotoSearch() {
        // console.log('ok');
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }

  .search-box {
    position: sticky;
    top: -1px;
    z-index: 999;
  }
</style>