<template>
  <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">默认转发</span>
    </div>
    <div class="tab-select pding select2">
      <div class="table-box">
        <div class="table-s">
          <table class="table-default">
            <thead>
              <tr>
                <th width="170">服务器地址列表</th>
                <th width="250">转发方式</th>
                <th width="250">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in this.resList" :key="item.id">
                <td v-if="item.ip== undefined || item.ip.length <= 0">
                  <p>-</p>
                </td>
                <td v-else>
                  <Tags :list=" item.ip" />
                </td>
                <td>{{item.id == 0 ?'-':item.type}}</td>
                <td>
                  <i-button class="k-btn" @click="goConfig()">修改</i-button>
                  <i-button class="k-btn" @click="delect()">删除</i-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <network-security-config ref="networkRef"></network-security-config>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NetworkSecurityConfig from "@/components/NetworkSecurityConfig";
import services from "@/services";

export default {
  name: "networkSecurity",
  data() {
    return {
      list: [],
      id: "",
      name: "",
      remove: "",
      modal1: false,
      priority: "",
      acls: [],
      resList: [],
      ip: [],
      type: ""
    };
  },
  components: {
    NetworkSecurityConfig
  },
  mounted() {
    this.getView();
  },
  methods: {
    goConfig() {
      this.$refs.networkRef.openConfig();
    },
    getView() {
      services
        .getDefaultForward()
        .then(res => {
          this.resList = res.data.data;
          for (var key in this.resList) {
            this.id = this.resList[key].id;
            this.ip = this.resList[key].ip;
          }
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
            .deleteForwardById(data)
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
