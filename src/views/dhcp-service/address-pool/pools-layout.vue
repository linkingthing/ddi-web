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

    return {
      tabList: [{
        name: "pools",
        label: "地址池",
        route: "address-pool-list"
      }, {
        name: "reservations",
        label: "固定地址",
        route: "address-reservations-list"
      }],
      tab: "",
      addressType: ""
    };
  },
  computed: {},
  watch: {
    addressType(value) {
      if (value === 6) {
        this.tabList.push({
          name: "pdpools",
          label: "前缀委派",
          route: "address-pdpool-list"
        });
      }
    }
  },
  created() {
    const { path } = this.$route;
    const pathSplit = path.split("/");
    this.tab = pathSplit.pop();

    this.$get(this.$getApiByRoute(pathSplit.join("/"))).then((data) => {
      console.log(data)
      this.addressType = data.version; // TODO: 等接口改造来判断ipv6，ipv6 可以 前缀委派
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