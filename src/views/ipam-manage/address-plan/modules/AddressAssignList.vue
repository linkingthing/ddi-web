<template>
  <div class="AddressAssignList">
    <table-page
      :columns="columns"
      :data="filterListWithList"
      :pagination-enable="false"
      :size="filterListWithList.length"
    >
      <div
        class="AddressAssignList-header"
        slot="neck"
      >
        <AddressTypeTab
          :active="active"
          @change="handleIpTypeChange"
        />

        <!-- <Input
          placeholder="输入关键字查询"
          style="width: 260px;margin-right: 16px"
          v-model="query"
        />
        <btn-search @click="handleSearch" /> -->

      </div>
    </table-page>
  </div>
</template>

<script>
import AddressTypeTab from "@/components/AddressTypeTab";
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
        title: "名称",
        key: "name"
      }, {
        title: "规划使用率",
        key: "usage"
      }, {
        title: "操作",
        key: "action",
        width: 130,
        render: (h, { row }) => {
          // if (this.netType === "netv4") {
          //   return h("div", [
          //     h("span", {
          //       class: {
          //         "btn-line": true
          //       },
          //       on: {
          //         click: () => {
          //           this.handleDHCP(row);
          //         }
          //       }
          //     }, "DHCP")
          //   ]);
          // }
          const [, len] = row.prefix.split("/");
          return h("div", {

          }, [
            h("btn-line", {

              style: {

              },
              props: {
                disabled: row.state === "dispatch",
                title: "新建子网"
              },
              on: {
                click: () => {
                  if (len !== undefined) {
                    this.handleDelegate(row);
                  }
                }
              }
            }, "新建子网"),
            h("btn-line", {

              style: {
                display: (+len !== 64) ? "none" : "inline-block"
              },
              props: {
                disabled: row.state === "dispatch",
                title: "新建子网"
              },
              on: {
                click: () => {
                  this.handleDHCP(row);
                }
              }
            }, "新建子网")
          ]);
        }
      }],

      dataList: [],
      filterList: [],
      current: 1
    };
  },
  computed: {

    filterListWithList() {
      return this.dataList;
    }
  },
  watch: {
  },
  created() {
    const { self, action } = this.$route.query;

    this.getDataList(self, action);
    this.active = action;
  },
  mounted() { },
  methods: {

    getDataList(self, action) {
      const params = {
        page_size: 10,
        page_num: this.current

      };
      const url = `${self}?action=${action}`;
      this.$post({ url, params }).then(data => {
        this.dataList = (Array.isArray(data) ? data : []).filter(item => {
          return item.state !== "dispatch";
        });
      });
    },

    handleIpTypeChange(action) {
      const { name } = this.$route;
      const { self } = this.$route.query;
      this.$router.push({ name, query: { self, action } });
      this.getDataList(self, action);
      this.active = action;

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
        let { data } = await this.$get(this.$getApiByRoute(`/address/dhcp/subnets?subnet=${row.prefix}`));

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
        let { data } = await this.$get(this.$getApiByRoute(`/address/dhcp/subnets?subnet=${row.prefix}`));

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
  padding: 20px 26px;
  margin-top: 60px;
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