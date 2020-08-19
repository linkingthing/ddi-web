<template>
  <div class="PlanCreatePrefix">
    <Form
      :colon="true"
      :label-width="80"
      label-position="left"
      :model="formData"
    >
      <FormItem label="规划名称">
        <Input
          v-model="formData.description"
          size="large"
          placeholder="请填写规划名称"
        />
      </FormItem>
      <FormItem label="前缀">
        <Input
          v-model="formData.prefix"
          size="large"
          placeholder="请填写前缀"
        />
      </FormItem>
      <div>
        <Button
          size="large"
          type="primary"
          long
          @click="handleClickSubmit"
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
      formData: {
        prefix: "",
        description: "",
        maxLen: 64
      }
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handleClickSubmit() {

    }
  }
};
</script>

<style lang="less" scoped>
.PlanCreatePrefix {
  width: 310px;
  padding: 40px 0;
}
</style>