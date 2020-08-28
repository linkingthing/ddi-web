<template>
  <div class="AddressAssignList">
    <table-page
      :columns="columns"
      :data="dataList"
    >
      1
    </table-page>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      columns: [{
        title: "地址规划",
        key: "prefix",
        render: (h, { row }) => {
          return h("div", {
            style: {
              marginLeft: row.depth * 20 + "px"
            },
            class: {
              treeStyle: row.depth
            }
          }, row.prefix);
        }
      }, {
        title: "描述",
        key: "description"
      }, {
        title: "规划使用率",
        key: "useRatioes"
      }, {
        title: "操作",
        key: "action"
      }],
      dataList: [{
        prefix: "3200:1600::/32",
        description: "设计开发不会涉及到",
        useRatioes: "52.25%",
        id: 1,
        depth: 1
      }, {
        prefix: "3200:1600::/32",
        description: "设计开发不会涉及到",
        useRatioes: "52.25%",
        id: 1,
        depth: 2
      }, {
        prefix: "3200:1600::/32",
        description: "设计开发不会涉及到",
        useRatioes: "52.25%",
        id: 1,
        depth: 3
      }, {
        prefix: "3200:1600::/32",
        description: "设计开发不会涉及到",
        useRatioes: "52.25%",
        id: 1,
        depth: 3
      }, {
        prefix: "3200:1600::/32",
        description: "设计开发不会涉及到",
        useRatioes: "52.25%",
        id: 1,
        depth: 2
      }, {
        prefix: "3200:1600::/32",
        description: "设计开发不会涉及到",
        useRatioes: "52.25%",
        id: 1,
        depth: 2
      },]
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" >
.AddressAssignList {
  .ivu-table-cell {
    overflow: visible;
  }
}
.treeStyle {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 6px;
    top: 10px;
    display: block;
    height: 240%;
    width: 2px;
    background: #ddd;
  }
  &::after {
    content: "";
    position: absolute;
    left: -14px;
    top: 10px;
    display: block;
    height: 2px;
    width: 15px;
    background: #ddd;
  }
}
</style>