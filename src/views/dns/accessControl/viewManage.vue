<template>
  <div class="index-main columns t-box">
    <div class="header-title">
      <span class="tit">视图管理</span>
      <div class="button-box fr">
        <i-button
          type="primary"
          class="me-button add-btn"
          icon="md-add"
          @click="handleOpenCreate"
        >新建</i-button>
      </div>
    </div>

    <div class="tab-select pding select2">
      <div class="table-box">
        <div class="table-s">
          <table class="table-default">
            <thead>
              <tr>
                <th>名称</th>
                <th width="250">访问控制列表</th>
                <th width="250">优先级</th>
                <th width="250">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in this.list" :key="item.id">
                <td>{{item.name}}</td>
                <td>
                  <Tags :list="item.acls" :field="name" />
                </td>
                <td>{{item.priority}}</td>
                <td>
                  <i-button class="k-btn" @click="goConfig1(item.id, item)">修改</i-button>
                  <i-button class="k-btn" @click="delect(item.id)" v-if="item.name !== 'default'">删除</i-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <createView ref="deviceRef" @onCreateSuccess="getView" :maxPriority="list.length"></createView>
      <editView ref="analysis2Ref" @onEditSuccess="getView" :maxPriority="list.length"></editView>
    </div>
  </div>
</template>

<script>
import createView from "./createView";
import editView from "./editView";
import services from "@/services";

export default {
  name: "deviceMonitor",
  data() {
    return {
      columns: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "访问控制列表",
          key: "acls",
          render: (h, params) => {
            return h("Tags", {
              props: {
                list: params.row.acls
              }
            });
          }
        },
        {
          title: "优先级",
          key: "priority"
        },
        {
          title: "操作",
          key: "action"
        }
      ],
      list: [],
      id: "",
      name: "",
      remove: "",
      modal1: false,
      priority: "",
      acls: []
    };
  },
  components: {
    createView,
    editView
  },
  mounted() {
    this.getView();
  },
  methods: {
    handleOpenCreate() {
      this.$refs.deviceRef.openConfig();
    },
    goConfig1(a, b) {
      this.$refs.analysis2Ref.openConfig(a, b);
    },
    getView() {
      let _self = this;
      services
        .getViewList()
        .then(function(res) {
          _self.list = res.data.data;
          for (var key in _self.list) {
            _self.id = _self.list[key].id;
            _self.name = _self.list[key].name;
            _self.priority = _self.list[key].priority;
            _self.acls = _self.list[key].acls;
          }
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
            .deleteViewById(data)
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
