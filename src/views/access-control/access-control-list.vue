<template>
  <div class="acceccControlList">
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
            <i-button
              type="primary"
              @click="handleOpenCreate"
              v-if="$hasPermission('acl', 'POST')"
            >新建</i-button>
            <import-export-csv
              style="margin-left: 20px;"
              :links="links"
              @on-import-success="onImportSuccess"
              resource="ACL"
            />
          </template>
        </SearchBar>

      </template>
    </table-page>

    <AclModal
      :visible.sync="visible"
      :links="paramsLinks"
      @success="getManger"
    />
  </div>
</template>

<script>
import services from "@/services";
import AclModal from "./modules/acl-modal";
import _ from "lodash";
import SearchBar from "./modules/SearchBarForAcl";

export default {
  name: "accessControlList",
  components: {
    AclModal,
    SearchBar
  },
  data() {
    const ispList = [{
      label: "中国移动",
      value: "cmcc"
    }, {
      label: "中国联通",
      value: "cucc"
    }, {
      label: "中国电信",
      value: "ctcc"
    }];
    return {
      loading: false,
      columns: [
        {
          title: "规则名称",
          key: "name",
          align: "left"
        },
        {
          title: "网络地址",
          key: "",
          render: (h, { row }) => {
            if (!!row.isp) {
              return h("div", ispList.find(item => item.value === row.isp).label);
            } else {
              return h("Tags", {
                props: {
                  list: row.ips,
                  field: row
                }
              });
            }

          }
        },
        {
          title: "状态",
          key: "status",
          render: (h, { row }) => {
            return h("span",
              {
                style: {
                  color: row.status === "allow" ? "#40D366" : "#E54B4B"
                }
              },
              row.status === "allow" ? "允许" : "禁止");
          }
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          render: (h, { row }) => {
            return h("div", this.$trimDate(row.creationTimestamp))
          }
        },
        {
          title: "备注",
          key: "comment",
        },
        {
          title: "操作",
          key: "action",
          width: 160,
          className: "operate-column",
          render: (h, { row }) => {
            if (this.$hasPermission("acl", "POST")) {

              return h("div", [
                !["any", "none"].includes(row.name) &&
                h("btn-edit", {
                  on: {
                    click: () => this.handleOpenEdit(row)
                  }
                }),
                !["any", "none"].includes(row.name) &&
                h("btn-del", {
                  on: {
                    click: () => this.delete(row.id)
                  }
                })
              ]);
            } else {
              h("div");
            }
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
      services
        .getAccessList(params)
        .then(({ data, links, pagination }) => {
          this.list = data;
          this.links = links;
          this.total = pagination.total;
          this.query.current = pagination.pageNum;
        })
        .catch(err => {
          this.$Message.error(err.message);
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
    delete(data) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteAccess(data)
            .then(res => {
              this.$Message.success("删除成功");
              this.getManger();
            })
            .catch(err => {
              this.$Message.error(err.message);
            });
        }
      });
    }
  }
};
</script>

