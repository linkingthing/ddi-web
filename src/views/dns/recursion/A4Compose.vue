<template>
  <div class="A4Compose">
    <table-page title="A4地址合成查询表" :data="list" :columns="columns" :paginationEnable="false">
      <template slot="top-right">
        <i-button type="success" @click="handleOpenCreate">新建</i-button>
      </template>
    </table-page>

    <createA4 ref="resRef" @onCreateSuccess="getView"></createA4>
    <editA4 ref="powerRef" @onEditSuccess="getView"></editA4>
  </div>
</template>

<script>
import createA4 from "./createA4";
import editA4 from "./editA4";
import services from "@/services";

export default {
  name: "A4Compose",
  data() {
    return {
      columns: [
        {
          title: "前缀",
          key: "prefix",
          align: "center"
        },
        {
          title: "客户IP地址",
          key: "clientaclname",
          align: "center"
        },
        {
          title: "目标IPv4地址",
          key: "addressname",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 160,
          render: (h, { row }) => {
            return h("div", [
              h("btn-edit", {
                on: {
                  click: () => this.handleOpenEdit(this.id, row.id)
                }
              }),
              h("btn-del", {
                class: "k-btn",
                on: {
                  click: () => this.delect(row.id)
                }
              })
            ]);
          }
        }
      ],
      list: [],
      id: "",
      name: "",
      remove: "",
      modal1: false,
      priority: "",
      acls: [],
      dns64s: "",
      id1: ""
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.dns64s = this.$route.query.dns64s;
  },
  components: {
    createA4,
    editA4
  },
  mounted() {
    this.getView();
  },
  methods: {
    handleOpenCreate() {
      this.$refs.resRef.openConfig(this.id);
    },
    handleOpenEdit(viewId, dnsId) {
      this.$refs.powerRef.openConfig(viewId, dnsId);
    },
    getView() {
      let _self = this;
      services
        .getDNS64sByViewId(this.id)
        .then(function(res) {
          _self.list = res.data.data;
        })
        .catch(function(err) {
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
            .deleteDNS64sByViewIdAndDnsId(this.id, data)
            .then(() => {
              this.$Message.success("删除成功");
              this.getView();
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

