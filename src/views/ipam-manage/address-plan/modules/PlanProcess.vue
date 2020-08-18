<template>
  <div class="PlanProcess">
    <ul>
      <li
        v-for="item in planProcessList"
        :key="item.icon"
      >
        <PlanProcessItem
          v-bind="item"
          @onchange="handleChange"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import PlanProcessItem from "./PlanProcessItem";
export default {
  components: {
    PlanProcessItem
  },
  props: {},
  data() {
    return {
      planProcessList: [{
        title: "前缀设置",
        icon: "icon-process-prefix",
        type: "visited",
        id: "prefix"
      }, {
        title: "语义规划",
        icon: "icon-process-plan",
        type: "active",
        id: "semantic"
      }, {
        title: "划分地址段",
        icon: "icon-process-branch",
        type: "",
        id: "address"
      }, {
        title: "地址分配",
        icon: "icon-process-distribution",
        type: "",
        id: "assign"
      }]
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handleChange(id) {
      this.planProcessList.forEach(item => {
        if (item.id === id) {
          item.type = "active";
        } else if (item.type === "active") {
          item.type = "visited";
        }
      });
      this.$emit("onchange", id);
    }
  }
};
</script>

<style lang="less" scoped>
.PlanProcess {
  border-bottom: 1px dashed rgba(69, 134, 254, 0.3);
  ul {
    display: inline-flex;
    padding-bottom: 30px;
  }
  li {
    flex: 1;
    position: relative;
    & + li {
      padding-left: 150px;
      &::before {
        position: absolute;
        width: 150px;
        left: 0;
        top: 40px;
        content: "";
        border-bottom: 1px dashed #ccc;
      }
    }
  }
}
</style>