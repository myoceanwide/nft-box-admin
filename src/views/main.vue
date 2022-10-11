<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中"
  >
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div
        class="site-content__wrapper"
        :style="{ 'min-height': documentClientHeight + 'px' }"
      >
        <main-content />
      </div>
    </template>
  </div>
</template>

<script>
import { isAuth } from '@/utils';
import MainNavbar from './main-navbar';
import MainSidebar from './main-sidebar';
import MainContent from './main-content';
export default {
  data() {
    return {
      loading: true,
    };
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainContent,
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight;
      },
      set(val) {
        this.$store.commit('common/updateDocumentClientHeight', val);
      },
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      },
    },
    userId: {
      get() {
        return this.$store.state.user.id;
      },
      set(val) {
        this.$store.commit('user/updateId', val);
      },
    },
    userName: {
      get() {
        return this.$store.state.user.name;
      },
      set(val) {
        this.$store.commit('user/updateName', val);
      },
    },
  },
  created() {
    this.getUserInfo();
    this.getCategory();
  },
  mounted() {
    this.resetDocumentClientHeight();
  },
  methods: {
    // 重置窗口可视高度
    resetDocumentClientHeight() {
      this.documentClientHeight = document.documentElement['clientHeight'];
      window.onresize = () => {
        this.documentClientHeight = document.documentElement['clientHeight'];
      };
    },
    // 获取当前管理员信息
    getUserInfo() {
      this.$http({
        url: this.$http.adornUrl('/sys/user/info'),
        method: 'get',
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        this.loading = false;
        this.userId = data.userId;
        this.userName = data.username;
      });
    },
    async getCategory() {
      let menuList = JSON.parse(sessionStorage.getItem('menuList'));
      let prod = menuList.filter((item) => item.menuId === 319);
      if (!prod.length) return console.log('no prod auth');
      const { data } = await this.$http({
        url: this.$http.adornUrl('/bbGoodsCategory/queryList'),
        method: 'post',
      });
      this.$store.commit('globalData/setCategoryList', data);
    },
  },
};
</script>
