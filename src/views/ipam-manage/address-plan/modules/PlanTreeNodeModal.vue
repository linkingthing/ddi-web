<template>
  <div class="PlanTreeNodeModal">
    <div class="PlanTreeNodeModal-header">
      规划编辑
    </div>
    <div class="PlanTreeNodeModal-content">

      <div class="prefix-range">
        <strong>33-64</strong>
        <span>当前规划区段</span>
      </div>

      <SegmentAxis />
      <Form
        style="padding-top: 36px"
        :label-width="60"
        label-position="left"
        :label-colon="true"
      >
        <FormItem label="起始值">
          <Input
            placeholder="请输入起始值"
            style="width: 220px;margin-right: 20px;float:left"
          />
          <Button
            type="primary"
            style="width: 110px"
          >自动生成</Button>
        </FormItem>
      </Form>

      <Form
        label-position="left"
        :label-colon="true"
      >
        <FormItem label="生成值（双击可修改）">
          <div class="branch-list">
            <ul>
              <li>
                <span v-if="1">1001</span>
                <Input v-else />
              </li>
            </ul>
          </div>
        </FormItem>
      </Form>

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

  .prefix-range {
    strong {
      display: block;
      font-size: 24px;
      color: #333;
    }
    span {
      font-size: 14px;
      color: #999;
    }
  }

  .branch-list {
    margin-top: 32px;

    li {
      display: block;
      width: 70px;
      height: 36px;
      line-height: 36px;
      border: 1px solid #ccc;
      margin-right: 16px;
      margin-bottom: 16px;
      text-align: center;
      border-radius: 4px;
    }
  }
}
</style>