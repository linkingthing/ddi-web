<template>
  <div class="PlanCreatePrefix">
    <Form
      :colon="true"
      :label-width="60"
      label-position="left"
    >
      <FormItem label="前缀">
        <Input
          size="large"
          placeholder="请填写前缀"
        />
      </FormItem>
      <div>
        <Button
          size="large"
          type="primary"
          long
        >确认</Button>
      </div>
    </Form>
  </div>
</template>

<script>
export default {
  components: {},
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
.PlanCreatePrefix {
  width: 310px;
  padding: 40px 0;
}
</style>