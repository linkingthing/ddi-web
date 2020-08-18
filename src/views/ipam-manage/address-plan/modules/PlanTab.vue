<template>
  <div class="PlanTab">
    <div class="PlanTabtitle">规划名称:</div>
    <ul>
      <PlanTabItem
        v-for="item in planList"
        v-bind="item"
        :key="item.id"
        :active="active"
        @click.native="handleTab(item)"
        @remove="handleRemoveTab"
      />
    </ul>
  </div>
</template>

<script>
import PlanTabItem from "./PlanTabItem";
export default {
  components: {
    PlanTabItem
  },
  props: {},
  data() {
    return {
      active: 1,
      planList: [{
        id: 1,
        title: "计划1"
      }, {
        id: 2,
        title: "计划2"
      }, {
        id: 3,
        title: "计划3"
      }]
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handleTab({ id }) {
      this.active = id;
    },
    handleRemoveTab(id) {
      this.planList = this.planList.filter(item => item.id !== id);

      this.$nextTick().then(() => {
        if (id === this.active) {
          if (this.planList.length) {
            this.active = this.planList[0].id;
          } else {
            this.active = null;
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.PlanTab {
  display: flex;
  height: 48px;
  background: #f2f2f2;
  margin-bottom: 30px;
  border-radius: 4px;

  .PlanTabtitle {
    width: 100px;
    text-align: center;
    font-size: #333;
    font-size: 16px;
    background: #e6e6e6;
    line-height: 48px;
  }
  ul {
    display: inline-flex;
    padding: 5px 5px 0;
  }
}
</style>