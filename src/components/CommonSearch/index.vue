<template>
  <div class="CommonSearch">
    <Form
      ref="form"
      label-position="left"
      :label-width="100"
      :label-colon="true"
      :model="formModel"
    >
      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
        :show-fields="isEdit ? ['name'] : []"
      />

    </Form>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    config: {
      type: Array,
      default: () => ([])
    },
    search: {
      type: Object,
      default: () => ({})
    }
  },
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
</style>