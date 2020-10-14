<template>
  <div class="AddressAssignList">
    <table-page
      :columns="columns"
      :data="filterListWithList"
      :total="filterList.length"
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
import { mapGetters, mapMutations } from "vuex";
import AddressTypeTab from "./AddressTypeTab";
export default {
  components: {
    AddressTypeTab
  },
  props: {},
  data() {
    return {
      active: "netv6",
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
        key: "action",
        align: "center",
        width: 130,
        render: (h, { row }) => {
          if (this.netType === "netv4") {
            return h("div", [
              h("span", {
                class: {
                  "btn-line": true
                },
                on: {
                  click: () => {
                    this.handleDHCP(row);
                  }
                }
              }, "DHCP")
            ]);
          }
          const [, len] = row.prefix.split("/");
          return h("div", {

          }, [
            h("span", {
              class: {
                "btn-line": true
              },
              style: {
                display: +len === 64 ? "none" : "inline-block",
                color: len === undefined ? "#999!important" : "#4686fe",
                borderColor: len === undefined ? "#999" : "#4686fe",
                cursor: len === undefined ? "default" : "pointer"
              },
              on: {
                click: () => {
                  if (len !== undefined) {
                    this.handleDelegate(row);
                  }
                }
              }
            }, "地址委派"),
            h("span", {
              class: {
                "btn-line": true
              },
              style: {
                display: (+len !== 64) ? "none" : "inline-block"
              },
              on: {
                click: () => {
                  this.handleDHCP(row);
                }
              }
            }, "DHCP")
          ]);
        }
      }],

      dataList: [],
      filterList: []
    };
  },
  computed: {
    ...mapGetters([
      "netNodes",
      "netType"
    ]),
    filterListWithList() {
      const pageSize = 10;
      const { current } = this.$route.query;
      const startIndex = (current - 1) * pageSize;
      const endIndex = current * pageSize;

      return this.filterList.slice(startIndex, endIndex);
    }
  },
  watch: {
    netNodes: {
      deep: true,
      immediate: true,
      handler(val) {
        this.dataList = val;
        this.filterList = this.dataList || [];
      }
    },
    netType: {
      immediate: true,
      handler(value) {
        this.active = value;
      }
    }
  },
  created() {

  },
  mounted() { },
  methods: {
    ...mapMutations([
      "setNetType"
    ]),
    handleIpTypeChange(type) {
      this.active = type;
      this.setNetType(type);
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
    },
    async handleDelegate(row) {
      try {
        let { data } = await this.$get(this.$getApiByRoute(`/address/dhcp/subnets?ipnet=${row.prefix}`));

        if (data.length) {
          this.$router.push({
            name: "address-pdpool-list",
            params: {
              id: data[0].id
            },
            query: {
              ipnet: row.prefix,
              tags: row.tags
            }
          });
        }
        else {
          this.$router.push({
            name: "subnet-pool-subnet",
            query: {
              ipnet: row.prefix,
              tags: row.tags
            }
          });
        }
      } catch (err) {
        this.$handleError(err);
      }
    },
    async handleDHCP(row) {
      try {
        let { data } = await this.$get(this.$getApiByRoute(`/address/dhcp/subnets?ipnet=${row.prefix}`));

        if (data.length) {
          this.$router.push({
            name: "address-pool-list",
            params: {
              id: data[0].id
            },
            query: {
              ipnet: row.prefix,
              tags: row.tags
            }
          });
        }
        else {
          this.$router.push({
            name: "subnet-pool-subnet",
            query: {
              ipnet: row.prefix,
              tags: row.tags
            }
          });
        }
      } catch (err) {
        this.$handleError(err);
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
  .table-pagination-top {
    height: 0;
    line-height: 0;
    min-height: 0;
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

.btn-line {
  display: inline-block;
  line-height: 24px;
  padding: 0 8px;
  height: 26px;
  font-size: 12px;
  color: #4686fe !important;
  border: 1px solid #4686fe;
  border-radius: 4px;
  cursor: pointer;
}
</style>