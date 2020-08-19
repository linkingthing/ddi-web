<template>
  <div class="AddressAssignSubnetList">
    AddressAssignSubnetList

    <table-page
      :data="tableData"
      :total="tableData.length"
      :columns="columns"
    >
      <div class="AddressAssignSubnetList-header" slot="neck">
        <strong>子网列表</strong>
        <Input
          placeholder="输入子网名称查询"
          style="width: 260px;margin-right: 16px"
        />
        <btn-search />

        <Button
          class="prev-step"
          style="border-color: #333;color:#333;float:right"
          @click="handlePrevStep"
        >
          <img
            :src="require('@/assets/images/back.png')"
            class="back-img"
          >
          <span style="color:#333">上一步</span>
        </Button>
      </div>
    </table-page>

  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      tableData: [],
      columns: [{
        title: "子网",
        key: "subnet",
        align: "left",
        render: (h, { row }) => {
          return h("div", `${row.prefix}/${row.prefixLen}`);
        }
      }, {
        title: "DHCP使用",
        key: "subnet",
        align: "left",
        render: (h, { row }) => {
          return h("div", `${row.prefix}/${row.prefixLen}`);
        }
      }, {
        title: "操作",
        key: "subnet",
        align: "left",
        render: (h, { row }) => {
          return h("div", `${row.prefix}/${row.prefixLen}`);
        }
      }]
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handlePrevStep() {

    }
  }
};
</script>

<style lang="less" scoped>
.AddressAssignSubnetList-header {
  padding: 10px 0;
  strong {
    display: inline-block;
    font-size: 18px;
    line-height: 32px;
    color: #333;
    margin-right: 36px;
  }
}
</style>