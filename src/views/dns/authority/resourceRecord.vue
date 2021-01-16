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
          v-if="showCreate"
        >新建</i-button>
      </template>
    </table-page>
    <createResource
      ref="configRef"
      :record-suffix="recordSuffix"
      @onCreateSuccess="getResources"
    />
    <editResource
      ref="analysisRef"
      :record-suffix="recordSuffix"
      @onEditSuccess="getResources"
    />
  </div>
</template>

<script>
import services from "@/services";
import createResource from "./createResource";
import editResource from "./editResource";
import { getParantData } from "@/util/request";


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
          title: "记录名称",
          key: "name",
          align: "left"
        },
        {
          title: "类型",
          key: "rrType"
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
          title: "备注",
          key: "comment",
          tooltip: true
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          render: (h, { row }) => {
            if (!this.showOperate) {
              return h("div");
            }
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
              }),
              h("btn-line", {
                props: {
                  title: !row.enabled ? "启用" : "停用"
                },
                on: {
                  click: () => this.handleToggleUse(row)
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
      current: 0,
      recordSuffix: "",
      role: "",
    };
  },

  computed: {
    isSlave() {
      return this.role === "slave";
    },
    showCreate() {
      return !this.isSlave;
    },
    showOperate() {
      return !this.isSlave;
    }
  },
  watch: {
    current() {
      this.getResources();
    }
  },

  created() {
    this.viewId = this.$route.params.id;
    this.zoneId = this.$route.params.zoneId;
    this.getZoneInfo();
  },
  methods: {
    getZoneInfo() {
      getParantData().then(({ name, role }) => {
        this.recordSuffix = name;
        this.role = role;
      });
    },
    handleOpenCreate(viewId, zoneId) {
      this.$refs.configRef.openConfig(viewId, zoneId);
    },
    goAnalysis(viewId, zoneId, id) {
      this.$refs.analysisRef.openModel(viewId, zoneId, id);
    },
    handleToggleUse({ links, enabled }) {
      this.$post({
        url: `${links.self}?action=${enabled ? "disable" : "enable"}`

      }).then(res => {
        this.$Message.success("切换成功");
        this.getResources();
      }).catch(err => err);
    },
    getResources() {
      const params = {
        page_num: this.current,
        page_size: 10
      };
      this.$get({ ...this.$getApiByRoute(), params })

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
