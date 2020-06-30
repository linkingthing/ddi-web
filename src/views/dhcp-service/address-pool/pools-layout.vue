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
      tabList: [],
      tab: "",
      addressType: "",
      subnetLenth: 0
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
    },
    subnetLenth(value) {
      if (Number(value) === 64) {
        console.log(value)
        this.tabList.unshift({
          name: "pools",
          label: "地址池",
          route: "address-pool-list"
        }, {
          name: "reservations",
          label: "固定地址",
          route: "address-reservations-list"
        });
      } else {
        this.tab = "pdpools";
        const { params } = this.$route;
        this.$router.push({ name: "address-pdpool-list", params });

      }

    }
  },
  created() {
    const { path } = this.$route;
    const pathSplit = path.split("/");
    this.tab = pathSplit.pop();

    this.$get(this.$getApiByRoute(pathSplit.join("/"))).then((data) => {
      this.addressType = data.version;
      this.subnetLenth = data.ipnet.split("/")[1];
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
    z-index: 10;
  }
}
</style>