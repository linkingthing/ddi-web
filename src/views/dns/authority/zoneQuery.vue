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
          type="success"
          size="large"
          @click="handleOpenCreate()"
        >新建</i-button>
      </template>
    </table-page>
    <zone-modal
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
          align: "center",
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "resource-record",
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
          title: "资源记录数量",
          key: "rrsize",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 120,
          align: "center",
          render: (h, { row }) => {
            return h("btn-del", {
              on: {
                click: () => this.delect(row.id)
              }
            });
          }
        }
      ],
      id: "",
      viewId: "",
      name: "",
      list: []
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
          this.list = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新建
    handleOpenCreate() {
      
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


