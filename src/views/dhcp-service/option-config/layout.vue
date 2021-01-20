<template>
  <div class="dhcp-config-layout">
    <common-tab
      class="tab-box"
      @change="handleTab"
      :active="tab"
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
      id: "dhcpconfigs",
      label: "全局参数",
      route: "option-dhcpconfigs"
    }, {
      id: "clientclasses",
      label: "option60",
      route: "option-clientclasses"
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
    handleTab(_, tab) {
      this.tab = tab.id;
      this.$router.push({ name: tab.route });
    }
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.dhcp-config-layout {
  margin-top: 60px;

  .tab-box {
    position: absolute;
    padding: 20px 26px;
    z-index: 20;
  }
}
</style>