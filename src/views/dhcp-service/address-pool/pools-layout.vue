<template>
  <div class="pool-layout">
    <common-tab
      class="tab-box"
      @on-tab="handleTab"
      :value="tab"
      :tab-list="tabList"
    />
    <router-view />
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    this.tabList = [{
      name: "pools",
      label: "地址池",
      route: "address-pool-list"
    }, {
      name: "reservations",
      label: "固定地址",
      route: "address-reservations-list"
    }, {
      name: "pdpools",
      label: "前缀委派",
      route: "address-pdpool-list"
    }];
    return {
      tab: "",
      addressType: ""
    };
  },
  computed: {},
  created() {
    const { path } = this.$route;
    const pathSplit = path.split("/");
    this.tab = pathSplit.pop();

    this.$get(this.$getApiByRoute(pathSplit.join("/"))).then(res => {
      console.log(res)
      this.addressType = res.subnet; // TODO: 等接口改造来判断ipv6，ipv6 可以 前缀委派
    });
  },
  methods: {
    handleTab(tab) {
      const { params } = this.$route;
      this.tab = tab.name;
      this.$router.push({ name: tab.route, params });
    }
  }
};
</script>

<style lang="less" scoped>
.pool-layout {
  margin-top: 60px;

  .tab-box {
    position: absolute;
    padding: 20px 26px;
  }
}
</style>