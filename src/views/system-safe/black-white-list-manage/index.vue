<template>
  <div class="blancList">
    <table-page
      title="地址黑名单配置"
      :data="list"
      :columns="columns"
      :pagination-enable="false">
      <template slot="top-right">
        <i-button
          type="success"
          size="large"
          @click="handleOpenCreate">新建</i-button>
      </template>
    </table-page>

    <blacklist-config ref="blacklistRef" @onCreateSuccess="getView"/>
  </div>
</template>

<script>
import axios from "axios";
import blacklistConfig from "@/components/BlacklistConfig";
import services from "@/services";
export default {
  name: "blacklistAndwhitelist",
  components: {
    blacklistConfig
  },
  data() {
    return {
      columns: [
        {
          title: "访问控制列表",
          key: "name",
          align: "center"
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, { row }) => {
            return h(
              "i-button",
              {
                on: {
                  click: () => this.delect(row.id)
                }
              },
              "删除"
            );
          }
        }
      ],
      list: [],
      acls: [],
      name: ""
    };
  },
  mounted() {
    this.getView();
  },
  methods: {
    handleOpenCreate() {
      this.$refs.blacklistRef.openModel();
    },
    goConfig1(data) {
      this.$refs.roleRef.openModel(data);
    },
    getView() {
      services
        .getBlackList()
        .then(res => {
          this.list = res.data.data;
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
            .deleteBlackById(data)
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
a {
  text-decoration: none !important;
}
</style>
