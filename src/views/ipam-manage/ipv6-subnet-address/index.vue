<template>
  <div class="ipv4-subnet-address">
    <table-page
      :loading="loading"
      :total="total"
      :data="list"
      :columns="columns"
      :current.sync="query.current"
    >

      <template slot="neck">
        <SearchBar
          :params="query"
          @on-search="handleSearch"
        >
          <template slot="operate">
            <import-export-csv
              v-if="$hasPermission('networkv6', 'POST')"
              style="margin-left: 20px;"
              :links="links"
              @on-import-success="onImportSuccess"
              resource="Ipv6"
            />
            <i-button
              type="primary"
              @click="handleOpenCreate"
              v-if="$hasPermission('networkv6', 'POST')"
            >新建子网</i-button>
          </template>
        </SearchBar>

      </template>
    </table-page>

    <Ipv4SubnetModal
      :visible.sync="visible"
      :links="paramsLinks"
      @success="getManger"
    />
  </div>
</template>

<script>
import Ipv4SubnetModal from "./modules/ipv4-subnet-modal";
import _ from "lodash";
import SearchBar from "./modules/SearchBar";

export default {
  components: {
    Ipv4SubnetModal,
    SearchBar
  },
  data() {
    const presetSubnetTypeMap = {
      guest: "访客子网",
      management: "管理子网",
      office: "办公子网",
      server: "服务器子网",
      vpn: "VPN子网"
    }
    return {
      loading: false,
      columns: [
        {
          title: "子网",
          key: "prefix",
          align: "left"
        },
        {
          title: "子网名称",
          key: "name",
        },
        {
          title: "组织机构",
          key: "semanticName",
        },
        {
          title: "子网类型",
          key: "networkType",
          render: (h, { row }) => {
            return h("div", presetSubnetTypeMap[row.networkType] || row.networkType)
          }
        },
        {
          title: "业务",
          key: "business",
        },
        {
          title: "备注",
          key: "comment",
        },
        {
          title: "使用率",
          key: "comment",
          render: (h, { row }) => {
            return h("common-process", {
              props: {
                percent: row.usage
              }
            });
            // } else {
            //   return h("div", "--");
            // }
          }
        },
        {
          title: "操作",
          key: "action",
          width: 240,
          className: "operate-column",
          render: (h, { row }) => {
            // if (this.$hasPermission("acl", "POST")) {

            return h("div", [
              h("btn-line", {
                props: {
                  title: "地址池配置",
                },
                on: {
                  // click: () => this.handleOpenEdit(row)
                }
              }),
              h("btn-edit", {
                on: {
                  click: () => this.handleOpenEdit(row)
                }
              }),
              h("btn-del", {
                on: {
                  click: () => this.delete(row)
                }
              })
            ]);
            // } else {
            //   h("div");
            // }
          }
        }
      ],
      total: 0,
      current: 0,
      list: [],
      id: "",
      visible: false,
      links: {},
      paramsLinks: {},
      query: {
        current: 1
      }
    };
  },

  watch: {
    "$route.query": {
      deep: true,
      immediate: true,
      handler(value) {
        this.query = _.cloneDeep({
          ...value,
          current: +value.current
        });
        this.getManger(value);
      }
    }
  },

  methods: {
    handleSearch(query) {
      this.$router.replace({
        query: { ..._.cloneDeep(this.$route.query), ..._.cloneDeep(query) }
      });
    },
    onImportSuccess() {
      this.query.current = 1;
      this.getManger();
    },
    handleGo(path) {
      this.$router.push({
        path
      });
    },

    getManger(query = this.query) {
      const params = query;
      params.page_size = 10;
      params.page_num = +query.current || 1;
      this.loading = true;
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/networkv6s", params })

        .then(({ data, links, pagination }) => {
          this.list = data;
          this.links = links;
          this.total = pagination.total;
          this.query.current = pagination.pageNum;
        })
        .catch(err => {
          this.$Message.error(err.response.data.message);
        }).finally(() => this.loading = false);
    },
    handleOpenCreate() {
      this.visible = true;
      this.paramsLinks = this.links;
    },
    handleOpenEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    // 删除
    delete({ links }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          this.$delete({ url: links.remove })
            .then(() => {
              this.$Message.success("删除成功");
              this.getManger();
            })
            .catch(err => {
              this.$Message.error(err.response.data.message);
            });
        }
      });
    }
  }
};
</script>

