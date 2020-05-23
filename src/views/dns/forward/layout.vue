<template>
  <div class="layout">
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
      name: "views_forwards",
      label: "转发规则",
      route: "forward-view"
    }, {
      name: "forwards",
      label: "转发组",
      route: "forward-group"
    }];
    return {
      tab: this.$route.path.split("/").pop(),
      addressType: ""
    };
  },
  computed: {},
  created() {
 
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
.layout {
  margin-top: 60px;

  .tab-box {
    position: absolute;
    padding: 20px 26px;
  }
}
</style>