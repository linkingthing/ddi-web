<template>
  <div class="viewManage">
    <table-page
      :data="list"
      :columns="columns"
      :total="list.length"
    >
      <template slot="top-right">
        <i-button
          v-if="$store.getters.hasPermissionToCreate"
          type="primary"
          @click="handleOpenCreate"
        >新建</i-button>
      </template>
    </table-page>

    <ViewModal
      :visible.sync="visible"
      :links="paramsLinks"
      @success="getView"
    />
  </div>
</template>

<script>

import services from "@/services";

import ViewModal from "./modules/view-modal";

export default {
  name: "deviceMonitor",
  components: {

    ViewModal
  },
  data() {
    return {
      columns: [
        {
          title: "视图名称",
          key: "name",
          align: "left"
        },
        {
          title: "优先级",
          key: "priority",
          align: "center"
        },
        {
          title: "访问控制",
          key: "acls",
          align: "center",

          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.acls
              }
            });
          }
        },
        {
          title: "DNS64",
          key: "dns64",
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
          align: "right",
          width: 220,
          render: (h, { row }) => {
            if (this.$store.getters.hasPermissionToCreate) {
              return h("div", [
                h("btn-edit", {
                  on: {
                    click: () => this.handleEdit(row)
                  }
                }),
                row.name !== "default" &&
                h("btn-del", {
                  on: {
                    click: () => this.delect(row.id)
                  }
                }),
                h("btn-move", {
                  props: {
                    type: "up",
                    disabled: row.name === "default" || row.priority === 1
                  },
                  on: {
                    click: () => this.handleMove(row, "up")
                  }
                }),
                h("btn-move", {
                  props: {
                    type: "down",
                    disabled: row.name === "default" || ((row.priority + 1) === this.default.priority)
                  },
                  on: {
                    click: () => this.handleMove(row, "down")
                  }
                })
              ]);
            } else {
              h("div");
            }

          }
        }
      ],
      list: [],
      visible: false,
      links: {},
      paramsLinks: {},
      default: {}
    };
  },
  mounted() {
    this.getView();
  },
  methods: {
    handleOpenCreate() {
      this.visible = true;
      this.paramsLinks = this.links;
    },
    handleEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    getView() {
      services
        .getViewList()
        .then(res => {
          this.list = res.data.data;
          this.links = res.data.links;

          this.default = this.list.find(item => item.id === "default") || {};
        })
        .catch(function (err) {
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
            .deleteViewById(data)
            .then(res => {
              this.$Message.success("删除成功");
              this.getView();
            })
            .catch(err => {
              this.$Message.error(err.response.data.message);
            });
        }
      });
    },
    handleMove({ priority, links, ...rest }, type) {
      let count = priority;
      if (type === "up") {
        count -= 1;
        count = count || 1;
      } else {
        count += 1;
      }
      this.$put({
        url: links.update,
        params: { priority: count, ...rest }
      }).then(() => {
        this.$Message.success("更新成功");
        this.getView();
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    }
  }
};
</script>

<style scoped>
</style>
