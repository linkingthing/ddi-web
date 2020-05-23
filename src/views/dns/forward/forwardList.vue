<template>
  <div class="forwardList">
    <table-page
      title="区域转发列表"
      :data="list"
      :columns="columns"
      :pagination-enable="false"
    />
    <editForward
      ref="alarmRef"
      @onSuccess="getView"
    />
  </div>
</template>

<script>
import editForward from "./editForward";
import services from "@/services";

export default {
  name: "forwardList",
  components: {
    editForward
  },
  data() {
    return {
      columns: [
        {
          title: "服务器地址列表",
          key: "ips",
          align: "center",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.ips
              }
            });
          }
        },
        {
          title: "转发方式",
          key: "type",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 160,
          render: (h, { row }) => {
            return h("div", [
              h(
                "btn-edit",
                {
                  on: {
                    click: () => this.goConfig(this.viewId, this.zoneId)
                  }
                },
              ),
              h(
                "btn-del",
                {
                  on: {
                    click: () => this.delect()
                  }
                },
              )
            ]);
          }
        }
      ],
      list: [],
      id: "",
      modal1: false,
      priority: "",
      acls: [],
      resList: [],
      viewId: "",
      zoneId: "",
      current: {}
    };
  },
  created() {
    this.viewId = this.$route.query.viewId;
    this.zoneId = this.$route.query.zoneId;
  },

  mounted() {
    this.getView();
  },
  methods: {
    goConfig(viewId, zoneId) {
      this.$refs.alarmRef.openModel(viewId, zoneId, this.current);
    },
    getView() {
      services
        .getForwardList(this.viewId, this.zoneId, {
          oper: "GET"
        })
        .then(res => {
          if (res.data.id === "0") {
            this.list = [
              {
                type: "-",
                ips: ["-"]
              }
            ];
          } else {
            this.list = [res.data];
          }

          this.current = res.data;
        })
        .catch(err => {
          this.$Message.error(err.message);
        });
    },

    // 删除
    delect(data) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteForward(this.viewId, this.zoneId, {
              oper: "DEL"
            })
            .then(res => {
              this.$Message.success("删除成功");
              this.getView();
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

<style scoped>
</style>