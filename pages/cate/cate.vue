<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <my-search></my-search>
    <view class="scroll-view-container">
      <!-- 左侧的滑动区域 -->
      <scroll-view scroll-y="true" :style="{height: wh+'px'}" class="left-scroll-view">
        <view v-for="item in cateList" :key="item.cat_id" @click="activeChanged(item.cat_id)"
          :class="['left-scroll-view-item', item.cat_id === active ? 'active' : '']">
          {{item.cat_name}}
        </view>
      </scroll-view>

      <!-- 右侧的滚动视图区域 -->
      <scroll-view :scroll-top="scrollTop" class="right-scroll-view" scroll-y :style="{height: wh +
     'px'}">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 动态渲染三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 Item 项 -->
            <view @click="gotoGoodsList(item3)" class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3">
              <!-- 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        wh: 0, //当前设备可用高度
        cateList: [],
        // 二级分类列表
        cateLevel2: [],
        active: 1,
        scrollTop: 0
      };
    },
    onLoad() {
      this.getCateList()
      const info = uni.getSystemInfoSync()
      this.wh = info.windowHeight - 50
      // console.log(info);
    },
    methods: {
      async getCateList() {
        // 发起请求
        const { data: res } = await
        uni.$http.get('/api/public/v1/categories')
        // 判断是否获取失败
        if (res.meta.status !== 200) return uni.$showMsg()
        // 转存数据
        this.cateList = res.message
        this.cateLevel2 = res.message[0].children
      },
      activeChanged(id) {
        this.active = id
        this.cateList.forEach(item => {
          if (item.cat_id === id) {
            this.cateLevel2 = item.children
          }
        })
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      //点击跳转商品页面
      gotoGoodsList(item) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #fff;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background-color: red;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }

    .cate-lv2-title {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 15px 0;

    }

    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;

      .cate-lv3-item {
        width: 33.33%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        image {
          width: 60px;
          height: 60px;
        }

        text {
          font-size: 12px;
        }
      }
    }

  }
</style>