<template>
  <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">默认4A地址合成</span>
      <div class="button-box fr">
        <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig(0)">新建</i-button>
      </div>
    </div>
    <div class="tab-select pding select2">
      <div class="table-box">
        <div class="table-s">
          <table class="table-default">
            <thead>
              <tr>
                <th width="170">前缀</th>
                <th width="250">客户IP白名单</th>
                <th width="250">客户IP黑名单</th>
                <th width="250">目标IPv4地址</th>
                <th width="250">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in this.list" :key="item.id">
                <td>{{item.prefix}}</td>
                <td>{{item.whitename}}</td>
                <td>{{item.blackname}}</td>
                <td>{{item.addressname}}</td>
                <td>
                  <i-button class="k-btn" @click="goConfig1(item.id)">修改</i-button>
                  <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <NetworkSwitch ref="networkRef"></NetworkSwitch>
      <subnet-list-config ref="subnetRef"></subnet-list-config>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NetworkSwitch from "@/components/NetworkSwitch";
import SubnetListConfig from "@/components/SubnetListConfig";
import services from "@/services";

export default {
  name: "limitingWebsiteBroadband",
  data() {
    return {
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
    NetworkSwitch,
    SubnetListConfig
  },
  mounted() {
    this.getView();
  },
  methods: {
    goConfig(type) {
      if (type == 0) {
        this.$refs.networkRef.openConfig();
      }
    },
    goConfig1(b) {
      this.$refs.subnetRef.openConfig(b);
    },
    getView() {
      let _self = this;
      services
        .getDefaultDNS64List()
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
            .deleteDefaultDNS64ById(data)
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

