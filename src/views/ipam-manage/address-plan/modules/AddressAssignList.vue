<template>
  <div class="AddressAssignList">
    <table-page
      :columns="columns"
      :data="filterList"
    >
      <div
        class="AddressAssignList-header"
        slot="neck"
      >
        <AddressTypeTab
          :active="active"
          @change="handleIpTypeChange"
        />

        <Input
          placeholder="输入关键字查询"
          style="width: 260px;margin-right: 16px"
          v-model="query"
        />
        <btn-search @click="handleSearch" />

      </div>
    </table-page>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddressTypeTab from "./AddressTypeTab";
export default {
  components: {
    AddressTypeTab
  },
  props: {},
  data() {
    return {
      active: "IPv6",
      query: "",
      columns: [{
        title: "地址规划",
        key: "prefix",
        render: (h, { row }) => {
          const levelList = row.level.split(".");
          const depth = levelList.length;
          return h("div", {
            style: {
              marginLeft: depth * 20 + "px"
            },
            class: {
              treeStyle: depth > 1
            }
          }, row.prefix);
        }
      }, {
        title: "描述",
        key: "name"
      }, {
        title: "规划使用率",
        key: "usage"
      }, {
        title: "操作",
        key: "action"
      }],

      dataList: [],
      filterList: []
    };
  },
  computed: {
    ...mapGetters([
      "netNodes"
    ])
  },
  watch: {
    netNodes: {
      deep: true,
      immediate: true,
      handler(val) {
        this.dataList = val;
        this.filterList = this.dataList;
      }
    }
  },
  created() {

  },
  mounted() { },
  methods: {
    handleIpTypeChange(type) {
      this.active = type;
    },
    handleSearch() {
      const query = this.query.trim();
      if (query) {
        this.filterList = this.dataList.filter(item => {
          return item.name.includes(query) || item.prefix.includes(query);
        });
      } else {
        this.filterList = this.dataList;
      }
    }
  }
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
    left: -18px;
    top: -15px;
    display: block;
    height: 200%;
    width: 2px;
    background: #ccc;
  }
  &::after {
    content: "";
    position: absolute;
    left: -18px;
    top: 10px;
    display: block;
    height: 2px;
    width: 15px;
    background: #ccc;
  }
}
.AddressAssignList-header {
  display: flex;
  padding: 20px 0;
}
</style>