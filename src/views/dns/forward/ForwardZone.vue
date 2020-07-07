<template>
  <div class="zoneQueryForward">
    <table-page
      title="转发区域"
      :data="dsliteList"
      :columns="columns"
      :total="dsliteList.length"
    >
      <template slot="top-right">
        <i-button
          type="primary"
          size="large"
          @click="handleOpenCreate"
        >新建</i-button>
      </template>
    </table-page>
    <zoneModal
      :links="paramsLinks"
      :visible.sync="visible"
      @success="getDataList"
    />
  </div>
</template>

<script>
import services from "@/services";
import zoneModal from "./modules/zone-modal";

export default {
  components: { zoneModal },
  data() {
    return {
      columns: [
        {
          title: "域名",
          key: "name",
          align: "left",
          render: (h, { row }) => {
            return h("div", row.name === "." ? "根区" : row.name);
          }
        },

        {
          title: "转发组",
          key: "forwards",
          align: "center",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.forwards
              }
            });
          }
        },

        {
          title: "转发类型",
          key: "forwardtype",
          align: "center"
        },

        {
          title: "创建时间",
          key: "creationTimestamp",
          algin: "center",
          render: (h, { row }) => {
            return h("div", this.$trimDate(row.creationTimestamp));
          }
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
                  click: () => this.handleEdit(row)
                }
              }), h("btn-del", {
                on: {
                  click: () => this.delete(row)
                }
              })
            ]);
          }
        }
      ],
      viewId: "",
      dsliteList: [],
      visible: false,
      links: {},
      paramsLinks: {}
    };
  },
  created() {
    this.viewId = this.$route.params.viewsId;
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$getData().then(({ data, links }) => {
        console.log(data, links)
        this.dsliteList = data;
        this.links = links;
      }).catch(err => {
        this.$Message.error(err.message);
      });
      // services
      //   .getZoneByViewId(this.viewId, {
      //     zonetype: "forward"
      //   })
      //   .then(res => {
      //     this.dsliteList = res.data.data;
      //     this.links = res.data.links;
      //   })
      //   .catch(err => {
      //     this.$Message.error(err.message);
      //   });
    },
    handleOpenCreate() {
      this.visible = true;
      this.paramsLinks = this.links;
    },
    handleEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    // 删除
    delete({ links }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(res => {
            this.$Message.success("删除成功");
            this.getDataList();
          }).catch(err => {
            this.$$error(err.response.data.message);
          });

        }
      });
    }
  }
};
</script>

<style scoped>
.table-box table a {
  text-decoration: none;
}
</style>
