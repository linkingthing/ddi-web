<template>
  <div class="PlanTreeNodeModal">
    <div class="PlanTreeNodeModal-header">
      规划编辑
    </div>
    <div class="PlanTreeNodeModal-content">

      <SegmentAxis />
      <Button
        type="primary"
        long
      >确定</Button>
    </div>
  </div>
</template>

<script>
import SegmentAxis from "@/components/SegmentAxis";
export default {
  components: {
    SegmentAxis
  },
  props: {},
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>
.PlanTreeNodeModal {
  width: 460px;
  border-radius: 4px;
  box-shadow: 0px 0px 16px 0px rgba(67, 67, 67, 0.1);

  .PlanTreeNodeModal-header {
    height: 54px;
    line-height: 24px;
    padding: 15px;
    font-size: 18px;
    color: #333;
    font-weight: bold;
    background: #e6e6e6;
  }
  .PlanTreeNodeModal-content {
    padding: 30px 24px;
  }
}
</style>