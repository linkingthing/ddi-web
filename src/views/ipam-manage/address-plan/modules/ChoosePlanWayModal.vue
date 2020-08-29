<template>

  <Modal
    class="ChoosePlanWayModal"
    v-model="dialogVisible"
    :closable="false"
    :mask-closable="false"
    :width="580"
  >
    <div
      class="ChoosePlanWayModal-header"
      slot="header"
    >
      选择规划方式
    </div>

    <div class="ChoosePlanWayModal-content">
      <div class="ChoosePlanWayList">
        <strong>智能规划： </strong>
        平台以路由表最优和可行的网络策略管理为目标划分子网
      </div>
      <div class="ChoosePlanWayList">
        <strong>自定义规划：</strong>
        用户可以自定义划分子网地址
      </div>
    </div>

    <template slot="footer">

      <Button
        class="btn-f-cancel"
        @click="dialogVisible = false"
      >
        取消
      </Button>
      <Button
        type="primary"
        style="width: 150px"
        @click="handleCustom"
      >
        自定义规划
      </Button>
      <Button
        type="primary"
        style="width: 150px"
        @click="handleIntellect"
      >
        智能规划
      </Button>

    </template>
  </Modal>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { buildLayoutParams } from "./helper";

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  computed: {
    ...mapState({
      "currentLayout": state => state.layout.currentLayout
    })
  },
  watch: {
    visible: {
      deep: true,
      immediate: true,
      handler(val) {
        this.dialogVisible = val;
      }
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    currentLayout: {
      deep: true,
      immediate: true,
      handler(val) {
        // console.log(123, val)
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "nextPlanStep"
    ]),

    handleCustom() {
      this.nextPlanStep();

    },
    handleIntellect() {

      const params = buildLayoutParams(this.currentLayout);

      console.log(params, this.currentLayout)

      console.log(222, this.currentLayout.links.update)

      this.$put({ url: this.currentLayout.links.update, params }).then(res => {
        console.log("自能规划后返回的数据", res)

        // this.$get({ url: this.currentLayout.links.self }).then(res => {
        //   console.log("自能规划后再次请求的数据", res)
        // })
      });
      // this.nextPlanStep();

    }
  }
};
</script>

<style lang="less">
.ChoosePlanWayModal {
  .ivu-modal-header {
    padding: 20px 40px;
    background: #f1f1f1;
    border: none;
  }
  .ChoosePlanWayModal-header {
    font-size: 18px;
    color: #333;
  }
  .ChoosePlanWayModal-content {
    padding: 20px;
    color: #666;
    font-size: 14px;
    strong {
      color: #333;
    }
  }
  .ChoosePlanWayList {
    margin-bottom: 20px;
  }

  .ivu-modal-footer {
    border: none;
    padding: 0 36px 36px;
    .btn-f-cancel {
      float: left;
      width: 110px;
      background: #e5e5e5;
      color: #777;
      border: none;
      span {
        color: #777;
      }
    }
  }
}
</style>