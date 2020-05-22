<template>
  <div class>
    <table-page
      title="资源记录"
      :data="resList"
      :columns="columns"
      :pagination-enable="false"
    >
      <template slot="top-right">
        <i-button
          type="success"
          @click="handleOpenCreate(viewId,zoneId)"
        >新建</i-button>
      </template>
    </table-page>
    <createResource
      ref="configRef"
      @onCreateSuccess="getResources"
    />
    <editResource
      ref="analysisRef"
      @onEditSuccess="getResources"
    />
  </div>
</template>

<script>
import services from "@/services";
import createResource from "./createResource";
import editResource from "./editResource";

export default {
  name: "resourceRecord",
  components: {
    createResource,
    editResource
  },
  data() {
    return {
      columns: [
        {
          title: "名称",
          key: "name",
          align: "left"
        },
        {
          title: "类型",
          key: "datatype",
          align: "center"
        },
        {
          title: "记录值",
          key: "rdata",
          align: "center"
        },
        {
          title: "TTL",
          key: "ttl",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "right",
          render: (h, { row }) => {
            return h("div", [
              h("btn-edit", {
                class: "k-btn",
                on: {
                  click: () => {
                    this.goAnalysis(this.viewId, this.zoneId, row.id);
                  }
                }
              }),
              h("btn-del", {
                class: "k-btn",
                on: {
                  click: () => {
                    this.delect(row.id);
                  }
                }
              })
            ]);
          }
        }
      ],
      viewId: "",
      zoneId: " ",
      resList: []
    };
  },
  created() {
    this.viewId = this.$route.params.viewId;
    this.zoneId = this.$route.params.zoneId;
  },
  mounted() {
    this.getResources();
  },
  methods: {
    handleOpenCreate(viewId, zoneId) {
      this.$refs.configRef.openConfig(viewId, zoneId);
    },
    goAnalysis(viewId, zoneId, id) {
      this.$refs.analysisRef.openModel(viewId, zoneId, id);
    },
    getResources() {
      services
        .getResourceRecord(this.viewId, this.zoneId)
        .then(res => {
          this.resList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除
    delect(data) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteResourceById(this.viewId, this.zoneId, data)
            .then(() => {
              this.$Message.success("删除成功");
              this.getResources();
            })
            .catch(() => {
              this.$Message.success("删除失败");
            });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
