<template>
  <div class="plan-map">

    <div style="height: 60px">
      <Select
        v-model="currentLink"
        @on-change="handleSelectPlan"
        class="top-select"
      >
        <Option
          v-for="item in planList"
          :key="item.id"
          :value="item.links.self"
        >{{item.name}}</Option>
      </Select>
    </div>
    <PlanTree
      v-if="planList.length"
      :data="treeData"
      :seat="160"
    />
  </div>
</template>

<script>
import PlanTree from "@/views/ipam-manage/address-plan/modules/PlanTree";
import { list2Tree } from "@/views/ipam-manage/address-plan/modules/helper";

export default {
  components: {
    PlanTree
  },
  props: {},
  data() {
    return {
      planList: [],
      treeData: [],
      currentLink: ""
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getPlanList();
  },
  mounted() { },
  methods: {
    getPlanList() {
      const url = "/apis/linkingthing.com/ipam/v1/plans";
      this.$get({ url }).then(({ data }) => {
        this.planList = data;

        if (data.length) {
          this.currentLink = data[0].links.self;
          this.handleSelectPlan(data[0].links.self);
        }
      });
    },
    handleSelectPlan(self) {

      this.$get({ url: self }).then((res) => {
        const { semanticnodes } = res;
        const treeData = list2Tree(semanticnodes, "0");
        this.treeData = treeData;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.top-select {
  z-index: 200;
  position: relative;
  width: 240px;
  left: 120px;
  top: 15px;
}
</style>