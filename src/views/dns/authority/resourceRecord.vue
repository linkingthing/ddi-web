<template>
  <div class>
    <table-page
      title="资源记录"
      :data="resList"
      :columns="columns"
      :total="total"
      :current.sync="current"
    >
      <template slot="top-right">
        <i-button
          type="primary"
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
          key: "datatype"
        },
        {
          title: "记录值",
          key: "rdata"
        },
        {
          title: "TTL",
          key: "ttl"
        },
        {
          title: "操作",
          key: "action",
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
      resList: [],
      total: 0,
      current: 0
    };
  },
  watch: {
    current() {
      this.getResources();

    }
  },

  created() {
    this.viewId = this.$route.params.id;
    this.zoneId = this.$route.params.zoneId;
  },

  methods: {
    handleOpenCreate(viewId, zoneId) {
      this.$refs.configRef.openConfig(viewId, zoneId);
    },
    goAnalysis(viewId, zoneId, id) {
      this.$refs.analysisRef.openModel(viewId, zoneId, id);
    },
    getResources() {
      const params = {
        page_num: this.current,
        page_size: 10
      };
      services
        .getResourceRecord(this.viewId, this.zoneId, params)

        .then(({ data, pagination }) => {
          this.resList = data;
          this.total = pagination.total;
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
            .catch((err) => {
              this.$Message.error(err.response.data.message);
            });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
