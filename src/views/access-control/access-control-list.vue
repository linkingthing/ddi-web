<template>
  <div class="acceccControlList">
    <table-page
      :data="list"
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

    <AclModal
      :visible.sync="visible"
      :links="paramsLinks"
      @success="getManger"
    />
  </div>
</template>

<script>
import services from "@/services";
import AclModal from "./modules/acl-modal";

export default {
  name: "accessControlList",
  components: {

    AclModal
  },
  data() {
    return {
      columns: [
        {
          title: "规则名称",
          key: "name",
          align: "center"
        },
        {
          title: "网络地址",
          key: "",
          align: "center",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.ips,
                field: row
              }
            });
          }
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          render: (h, { row }) => {
            return h("span",
              {
                style: {
                  color: row.status === "allow" ? "#40D366" : "#E54B4B"
                }
              },
              row.status === "allow" ? "允许" : "禁止");
          }
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
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
          width: 160,
          render: (h, { row }) => {
            return h("div", [
              !["any", "none"].includes(row.name) &&
              h("btn-edit", {
                on: {
                  click: () => this.handleOpenEdit(row)
                }
              }),
              !["any", "none"].includes(row.name) &&
              h("btn-del", {
                on: {
                  click: () => this.delete(row.id)
                }
              })
            ]);
          }
        }
      ],
      list: [],
      id: "",
      visible: false,
      links: {},
      paramsLinks: {}
    };
  },
  watch: {},
  mounted() {
    this.getManger();
  },
  methods: {
    handleGo(path) {
      this.$router.push({
        path
      });
    },

    getManger() {
      services
        .getAccessList()
        .then(res => {
          this.list = res.data.data;
          this.links = res.data.links;
        })
        .catch(err => {
          this.$Message.error(err.message);
        });
    },
    handleOpenCreate() {
      this.visible = true;
      this.paramsLinks = this.links;
    },
    handleOpenEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    // 删除
    delete(data) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteAccess(data)
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

