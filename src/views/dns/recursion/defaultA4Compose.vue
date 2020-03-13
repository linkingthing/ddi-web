<template>
  <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">默认4A地址合成</span>
      <div class="button-box fr">
        <i-button
          type="success"
          icon="md-add"
          @click="handleOpenCreate(0)"
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
                  <i-button class="k-btn" @click="handleOpenEdit(item.id)">修改</i-button>
                  <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <createDefaultA4 ref="createRef" @createSuccess="onCreateSuccess"></createDefaultA4>
      <editDefaultA4 ref="subnetRef" @createSuccess="onCreateSuccess"></editDefaultA4>
    </div>
  </div>
</template>

<script>
import createDefaultA4 from "./createDefaultA4";
import editDefaultA4 from "./editDefaultA4";
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
    createDefaultA4,
    editDefaultA4
  },
  mounted() {
    this.getView();
  },
  methods: {
    handleOpenCreate(type) {
      if (type == 0) {
        this.$refs.createRef.openConfig();
      }
    },
    onCreateSuccess() {
      this.getView();
    },
    handleOpenEdit(b) {
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

