<template>
  <div class="index-main columns t-box">
    <div class="content-header">
      <Select style="width:300px" @on-change="handleGo">
        <Option value="/dns/accessControl/accessControlList">访问控制列表</Option>
        <Option value="/dns/accessControl/viewManage">视图管理</Option>
      </Select>

      <div class="button-box fr">
        <i-button type="success" class="me-button add-btn" icon="md-add" @click="goConfig(0)">新建</i-button>
        <i-button
          type="primary"
          class="me-button add-btn"
          icon="md-add"
          @click="goConfig1(0, true)"
        >编辑</i-button>
        <i-button type="error" class="me-button add-btn" icon="md-add" @click="goConfig(0)">删除</i-button>
      </div>
    </div>
    <div class>
      <div class="table-box">
        <div class="table-s">
          <table class="table-default">
            <thead>
              <tr>
                <th width="60">
                  <div class="checkbox"></div>
                </th>
                <th width="170">名称</th>
                <th width="250">IP</th>
                <th width="250">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in this.list" :key="item.id">
                <td>
                  <div
                    class="checkbox"
                    :class="{checked: checkList.includes(item.id)}"
                    @click="handleCheck(item.id)"
                  ></div>
                </td>
                <td>{{item.name}}</td>
                <td>
                  <Tags :list="item.IP" :field="item" />
                </td>
                <td>
                  <i-button
                    class="k-btn"
                    @click="goConfig1(item.id)"
                    v-if="!['any','none'].includes(item.name)"
                  >修改</i-button>
                  <i-button
                    class="k-btn"
                    @click="delect(item.id)"
                    v-if="!['any','none'].includes(item.name)"
                  >删除</i-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <createAccess ref="configRef" @onSuccess="createSuccess" :accessList="list"></createAccess>
      <editAccess ref="eviceRef" @onSuccess="getManger" :accessList="list"></editAccess>
    </div>
  </div>
</template>

<script>
import services from "@/services";
import createAccess from "./createAccess";
import editAccess from "./editAccess";
export default {
  name: "accessControlList",
  data() {
    return {
      checkList: ["1"],
      list: [],
      IP: [],
      id: "",
      name: "",
      remove: "",
      modal1: false
    };
  },
  components: {
    createAccess,
    editAccess
  },
  mounted() {
    this.getManger();
  },
  methods: {
    handleGo(path) {
      this.$router.push({
        path
      });
    },
    handleCheck(id) {
      const index = this.checkList.indexOf(id);
      if (index === -1) {
        this.checkList.push(id);
      } else {
        this.checkList.splice(index, 1);
      }
    },
    getManger() {
      let _self = this;
      services
        .getAccessList()
        .then(function(res) {
          _self.list = res.data.data;
          for (var key in _self.list) {
            _self.id = _self.list[key].id;
            _self.name = _self.list[key].name;
            _self.IP = _self.list[key].IP;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    //修改
    goConfig(type) {
      if (type == 0) {
        this.$refs.configRef.openConfig();
      }
    },
    goConfig1(data, checked) {
      if (checked) {
        this.$refs.eviceRef.openConfig({ data: this.checkList[0] });
      } else {
        this.$refs.eviceRef.openConfig({ data });
      }
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
              this.$Message.success("删除失败");
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.content-header {
  height: 120px;
  padding: 20px;
  box-sizing: border-box;
}
.me-button {
  margin-top: 50px;
}

.checkbox {
  display: inline-block;
  height: 16px;
  width: 16px;
  border: 1px solid #66615b;
  cursor: pointer;
}
.checked {
  background-image: url("../../../assets/images/checked.png");
}
</style>
