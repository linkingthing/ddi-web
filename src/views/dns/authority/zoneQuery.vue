<template>
  <div class="zoneQuery">
    <table-page
      title="区域查询"
      :data="list"
      :columns="columns"
      :total="total"
      :current.sync="current"
    >
      <template slot="top-right">
        <i-button
          type="primary"
          @click="handleOpenCreate()"
        >新建</i-button>
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
export default {
  name: "zoneQuery",
  components: {
    "zone-modal": ZoneModal
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
          key: "zonetype",
          width: 120,
          render: (h, { row }) => {
            return h("div", row.isarpa ? "反向区" : "正向区");
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
          title: "主辅区",
          key: "role",
          width: 100,
          render: (h, { row }) => {
            return h("div", row.role === "master" ? "主区" : "辅区");
          }
        },
        {
          title: "主区列表",
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
          title: "辅区列表",
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
              }),
              // h("i-switch", {
              //   style: {
              //     marginLeft: "16px"
              //   },
              //   props: {
              //     "false-color": "#F2A16B",
              //     value: row.rrsRole === "main"
              //   },
              //   on: {
              //     "on-change": (value) => this.handleToggleMaster(value, row)
              //   }
              // }, [
              //   h("span", {
              //     slot: "open"
              //   }, "主"),
              //   h("span", {
              //     slot: "close"
              //   }, "备"),

              // ])
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
      paramsLinks: {}
    };
  },
  watch: {
    current() {
      this.getArea();

    }
  },
  created() {
    this.id = this.$route.params.id;
    this.viewId = this.$route.query.id;
  },
  methods: {
    getArea() {
      const params = {
        page_num: this.current,
        page_size: 10
      };


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


