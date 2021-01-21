<template>
  <div class="zoneQuery">
    <table-page
      title="区域查询"
      :data="list"
      :columns="columns"
      :total="total"
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
              @click="handleOpenCreate()"
            >新建</i-button>
          </template>
        </SearchBar>

      </template>
    </table-page>
    <zone-modal
      :links="paramsLinks"
      :visible.sync="visible"
      @success="getArea"
    />
  </div>
</template>

<script>
import services from "@/services";
import ZoneModal from "./modules/zone-modal";
import SearchBar from "./modules/SearchBar";
import _ from "lodash";

import { zoneType } from "@/config/dns";

export default {
  name: "zoneQuery",
  components: {
    "zone-modal": ZoneModal,
    SearchBar
  },
  data() {
    return {
      columns: [
        {
          title: "区名称",
          key: "name",
          align: "left",
          width: 160,
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: this.$getRouteByLink(row.links.authrrs, "dns")
                }
              },
              row.name
            );
          }
        },
        {
          title: "区类型",
          key: "zoneType",
          width: 120,
          render: (h, { row }) => {
            return h("div", zoneType[row.zoneType]);
          }
        },
        {
          title: "TTL",
          key: "ttl",
          width: 100
        },

        {
          title: "记录数",
          key: "rrCount",
          width: 100

        },
        {
          title: "区角色",
          key: "role",
          width: 100,
          render: (h, { row }) => {
            return h("div", row.role === "master" ? "主区" : "辅区");
          }
        },
        {
          title: "主区服务器",
          key: "role",
          width: "300",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.role === "slave" ? row.masters : []
              }
            });
          }
        },
        {
          title: "辅区服务器",
          key: "role",
          width: "300",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.role === "master" ? row.slaves : []
              }
            });
          }
        },
        {
          title: "备注",
          key: "comment",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "操作",
          key: "action",
          width: 220,
          fixed: "right",
          render: (h, { row }) => {
            return h("div", [
              h("btn-edit", {
                on: {
                  click: () => this.edit(row)
                }
              }),
              h("btn-del", {
                on: {
                  click: () => this.delect(row.id)
                }
              })
            ]);
          }
        }
      ],
      id: "",
      viewId: "",
      name: "",
      total: 0,
      current: 0,
      list: [],
      visible: false,
      links: {},
      paramsLinks: {},
      query: { current: 1 }
    };
  },

  watch: {
    "$route.query": {
      deep: true,
      immediate: true,
      handler(value) {
        this.query = _.cloneDeep(value);
        this.getArea(value);
      }
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.viewId = this.$route.query.id;

    const { query } = this.$route;
    this.query = _.cloneDeep(query);
    if (query.current) {
      this.query.current = Number(query.current);
    }
  },
  methods: {
   
    handleSearch(query) {
      this.$router.replace({
        query: { ..._.cloneDeep(this.$route.query), ..._.cloneDeep(query) }
      });
    },
    getArea(query = this.query) {
      const params = query;
      params.page_size = 10;
      params.page_num = query.current || 1;

      this.$get({ ...this.$getApiByRoute(), params })
        .then(({ links, data, pagination }) => {
          this.list = data;
          this.links = links;
          this.total = pagination.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新建
    handleOpenCreate() {
      this.paramsLinks = this.links;
      this.visible = true;
    },

    edit({ links }) {
      this.paramsLinks = links;
      this.visible = true;
    },
    // 删除
    delect(zoneId) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteZone(this.id, zoneId)
            .then(res => {
              this.$Message.success("删除成功");
              this.getArea();
            })
            .catch(err => {
              this.$Message.error(err.response.data.message);
            });
        }
      });
    },
    handleToggleMaster(value, row) {
      const url = `${row.links.self}?action=changingRRs`;
      const enumRoles = {
        [true]: "main",
        [false]: "backup"
      };
      const params = {
        role: enumRoles[value]
      };

      this.$post({ url, params }).then(res => {
        this.$Message.success("切换成功");
        this.getArea();
      }).catch(() => {
        this.$Message.error("切换失败");
        this.getArea();
      });
    }
  }
};
</script>


