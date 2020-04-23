<template>
  <div class="acceccControlList">
    <table-page
      title="访问控制列表"
      :data="list"
      :columns="columns"
      :pagination-enable="false">
      <template slot="top-right">
        <i-button
          type="success"
          size="large"
          @click="goConfig(0)">新建</i-button>
      </template>
    </table-page>

    <createAccess
      ref="configRef"
      @onSuccess="createSuccess"
      :access-list="list"/>
    <editAccess
      ref="eviceRef"
      @onSuccess="getManger"
      :access-list="list"/>
  </div>
</template>

<script>
import services from "@/services";
import createAccess from "./createAccess";
import editAccess from "./editAccess";
export default {
  name: "accessControlList",
  components: {
    createAccess,
    editAccess
  },
  data() {
    return {
      columns: [
        {
          title: "名称",
          key: "name",
          align: "center"
        },
        {
          title: "IP",
          key: "",
          align: "center",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.list,
                field: row
              }
            });
          }
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
          width: 160,
          render: (h, { row }) => {
            return h("div", [
              !["any", "none"].includes(row.name) &&
                h("btn-edit", {
                  on: {
                    click: () => this.goConfig1(row.id, row)
                  }
                }),
              !["any", "none"].includes(row.name) &&
                h("btn-del", {
                  on: {
                    click: () => this.delect(row.id)
                  }
                })
            ]);
          }
        }
      ],
      list: [],
      IP: [],
      id: "",
      name: "",
      remove: "",
      modal1: false
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
      let _self = this;
      services
        .getAccessList()
        .then(function (res) {
          _self.list = res.data.data;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    // 修改
    goConfig(type) {
      if (type == 0) {
        this.$refs.configRef.openConfig();
      }
    },
    goConfig1(data) {
      this.$refs.eviceRef.openConfig({ data });
    },
    createSuccess() {
      this.getManger();
    },
    // 删除
    delect(data) {
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

