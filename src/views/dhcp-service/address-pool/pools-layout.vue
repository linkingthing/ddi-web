<template>
  <div class="pool-layout">
    <common-tab
      class="tab-box"
      @change="handleTab"
      :active="tab"
      :tab-list="tabList"
    />
    <router-view :version="addressType" />
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
      addressType: null,
      subnetLenth: 0
    };
  },
  computed: {},
  watch: {
    addressType(value) {
      if (value === 6) {
        this.tabList.push({
          id: "pdpools",
          label: "前缀委派",
          route: "address-pdpool-list"
        });
      }
      if (value === 4) {
        this.tabList.unshift({
          id: "pools",
          label: "动态地址池",
          route: "address-pool-list"
        }, {
          id: "reservations",
          label: "固定地址",
          route: "address-reservations-list"
        });
        this.tabList.push({
          id: "staticaddresses",
          label: "静态地址",
          route: "static-address"
        });
      }
    },
    subnetLenth(value) {
      if (this.addressType === 6) {
        if (Number(value) === 64) {
          this.tabList.unshift({
            id: "pools",
            label: "动态地址池",
            route: "address-pool-list"
          }, {
            id: "reservations",
            label: "固定地址",
            route: "address-reservations-list"
          });
          this.tabList.push({
            id: "staticaddresses",
            label: "静态地址",
            route: "static-address"
          });
        } else {
          this.tab = "pdpools";
          const { params } = this.$route;
          this.$router.push({ name: "address-pdpool-list", params });

        }
      }


    }
  },
  created() {
    const { path } = this.$route;
    const pathSplit = path.split("/");
    this.tab = pathSplit.pop();

    this.$get(this.$getApiByRoute(pathSplit.join("/"))).then((data) => {
      this.addressType = data.version;
      this.subnetLenth = data.subnet.split("/")[1];
    });
  },
  methods: {
    handleTab(_, tab) {
      const { params } = this.$route;
      this.tab = tab.id;
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
    z-index: 20;
  }
}
</style>