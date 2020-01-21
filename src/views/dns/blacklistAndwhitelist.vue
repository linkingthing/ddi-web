<template>
  <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">地址黑名单配置</span>
      <div class="button-box fr">
        <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig">新建</i-button>
      </div>
    </div>
    <div class="table-box">
      <div class="table-s">
        <table class="table-default" ref="ele">
          <thead>
            <tr>
              <th width="220">访问控制列表</th>
              <th width="240">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in this.list" :key="item.id">
              <td>{{item.name}}</td>
              <td>
                <i-button class="k-btn" @click="goConfig1(item.id)">修改</i-button>
                <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- <blacklist-config ref="blacklistRef"></blacklist-config> -->
    <role-config ref="roleRef"></role-config>
  </div>
</template>

<script>
import axios from "axios";
import blacklistConfig from "@/components/BlacklistConfig";
import RoleConfig from "@/components/RoleConfig";
import services from "@/services";
export default {
  name: "blacklistAndwhitelist",
  data() {
    return {
      list: [],
      acls: [],
      name: ""
    };
  },
  mounted() {
    this.getView();
  },
  methods: {
    goConfig() {
      this.$refs.blacklistRef.openModel();
    },
    goConfig1(data) {
      // this.$refs.roleRef.openModel(data);
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
  },
  components: {
    blacklistConfig,
    RoleConfig
  }
};
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
