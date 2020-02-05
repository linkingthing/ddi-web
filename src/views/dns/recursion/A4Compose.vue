<template>
  <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">A4地址合成查询表</span>
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
                <th width="170">前缀</th>
                <th width="250">客户IP地址</th>
                <th width="250">目标IPv4地址</th>
                <th width="250">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in this.list" :key="item.id">
                <td>{{item.prefix}}</td>
                <td>{{item.clientaclname}}</td>
                <td>{{item.addressname}}</td>
                <td>
                  <i-button class="k-btn" @click="handleOpenEdit(id,item.id)">修改</i-button>
                  <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <createA4 ref="resRef" @onCreateSuccess="getView"></createA4>
      <editA4 ref="powerRef" @onEditSuccess="getView"></editA4>
    </div>
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
  created(id, dns64s) {
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

