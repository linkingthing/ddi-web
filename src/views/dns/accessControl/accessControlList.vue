<template>
  <div class="index-main columns t-box">
    <div class="content-header">
      <div class="bread">
        
      </div>

      <div class="button-box fr">
        <i-button type="success" class="me-button add-btn" icon="md-add" @click="goConfig(0)">新建</i-button>
      </div>
    </div>
    <div>
      <div class="table-box">
        <div class="table-s">
          <table class="table-default">
            <thead>
              <tr>
                <th width="170">名称</th>
                <th width="250">IP</th>
                <th width="250">创建时间</th>
                <th width="250">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in this.list" :key="item.id">
                <td>{{item.name}}</td>
                <td>
                  <Tags :list="item.IP" :field="item" />
                </td>
                <td>{{item.creationTimestamp}}</td>
                <td>
                  <!-- <i-button
                    class="k-btn"
                    @click="goConfig1(item.id)"
                    v-if="!['any','none'].includes(item.name)"
                  >修改</i-button>-->
                  <Icon
                    class="btn-icon btn-edit"
                    type="ios-create-outline"
                    @click="goConfig1(item.id)"
                    v-if="!['any','none'].includes(item.name)"
                  />
                  <Icon
                    class="btn-icon btn-del"
                    type="md-close"
                    @click="delect(item.id)"
                    v-if="!['any','none'].includes(item.name)"
                  />
                  <!-- <i-button
                    class="k-btn"
                    @click="delect(item.id)"
                    v-if="!['any','none'].includes(item.name)"
                  >删除</i-button>-->
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
              this.$Message.success("删除失败");
            });
        }
      });
    },
    
  },
  watch: {
  
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

.bread {
  float: left;
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
.btn-icon {
  font-size: 20px;
  cursor: pointer;
}
.btn-edit {
  color: #68b3c8;
}
.btn-del {
  color: #eb5e28;
}
</style>
