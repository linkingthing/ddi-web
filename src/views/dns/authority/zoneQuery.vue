<template>
  <div class="zoneQuery">
    <table-page
      title="区域查询"
      :data="list"
      :columns="columns"
      :pagination-enable="false"
    >
      <template slot="top-right">
        <i-button
          type="primary"
          size="large"
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
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: this.$getRouteByLink(row.links.rrs, "dns")
                }
              },
              row.name
            );
          }
        },
        {
          title: "区类型",
          key: "zonetype",
          align: "center",
          render: (h, { row }) => {
            return h("div", row.isarpa ? "反向区" : "正向区");
          }
        },
        {
          title: "TTL",
          key: "rrsize",
          align: "center"
        },

        {
          title: "记录数",
          key: "rrsize",
          align: "center"
        },
        {
          title: "备注",
          key: "comment",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 160,
          align: "right",
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
      list: [],
      visible: false,
      links: {},
      paramsLinks: {}
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.viewId = this.$route.query.id;
  },
  mounted() {
    this.getArea();
  },
  methods: {
    getArea() {
      services
        .getZoneByViewId(this.id)
        .then(res => {
          const { links, data } = res.data;
          this.list = data;
          this.links = links;
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
              this.$Message.success("删除失败");
            });
        }
      });
    }
  }
};
</script>


