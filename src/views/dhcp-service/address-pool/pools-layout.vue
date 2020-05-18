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
      route: "address-pdpool-list"
    }, {
      name: "pdpools",
      label: "前缀委派",
      route: "address-reservations-list"
    }];
    return {
      tab: ""
    };
  },
  computed: {},
  created() {
    const { path } = this.$route;
    const pathSplit = path.split("/");
    this.tab = pathSplit.pop();
  },
  mounted() { },
  methods: {
    handleTab(tab) {
      this.tab = tab.name;
      this.$router.push({ name: tab.route });
    }
  },
  watch: {},
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