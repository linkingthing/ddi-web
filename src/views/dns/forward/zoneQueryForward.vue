<template>
  <div class="zoneQueryForward">
    <table-page
      title="转发区域"
      :data="dsliteList"
      :columns="columns"
      :pagination-enable="false"
    >
      <template slot="top-right">
        <i-button
          type="success"
          size="large"
          @click="handleOpenCreate"
        >新建</i-button>
      </template>
    </table-page>
    <createForwardZone
      ref="creatRef"
      @onCreateSuccess="getManger"
    />
  </div>
</template>

<script>
import services from "@/services";
import createForwardZone from "./createForwardZone";

export default {
  components: { createForwardZone },
  data() {
    return {
      columns: [
        {
          title: "域名",
          key: "name",
          align: "center",
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "forward-list",
                    query: {
                      viewId: this.viewId,
                      zoneId: row.id,
                      name: row.name
                    }
                  }
                }
              },
              row.name
            );
          }
        },
        {
          title: "转发地址数量",
          key: "forwardsize",
          algin: "center"
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          algin: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 120,
          align: "center",
          render: (h, { row }) => {
            return h("btn-del", {
              on: {
                click: () => this.delete(row.id)
              }
            });
          }
        }
      ],
      viewId: "",
      dsliteList: []
    };
  },
  created() {
    this.viewId = this.$route.query.id;
  },
  mounted() {
    this.getManger();
  },
  methods: {
    getManger() {
      services
        .getZoneByViewId(this.viewId, {
          zonetype: "forward"
        })
        .then(res => {
          this.dsliteList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleOpenCreate() {
      this.$refs.creatRef.openConfig(this.viewId);
    },
    // 删除
    delete(zoneId) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteZone(this.viewId, zoneId)
            .then(res => {
              this.$Message.success("删除成功");
              this.getManger();
            })
            .catch(err => {
              this.$Message.error("删除失败");
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
