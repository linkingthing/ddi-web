<template>
  <div class="index-main appUpgrade t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">资源记录</span>
      <div class="button-box fr">
        <i-button
          type="primary"
          class="me-button add-btn"
          icon="md-add"
          @click="handleOpenCreate(viewId,zoneId)"
        >新建</i-button>
      </div>
    </div>
    <div class="table-box">
      <div class="table-s">
        <vue-scroll :style="{minHeight:tableHeight+'px'}">
          <table class="table-default" ref="ele">
            <thead>
              <tr>
                <th width="140">名称</th>
                <th width="140">类型</th>
                <th width="160">记录值</th>
                <th width="95">TTL</th>
                <th width="230">是否启用</th>
                <th width="240">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in this.resList" :key="item.id">
                <td>{{item.name}}</td>
                <td>{{item.type}}</td>
                <td>{{item.value}}</td>
                <td>{{item.ttl+'s'}}</td>
                <td>{{item.isused === 0?'否':'是'}}</td>
                <td>
                  <i-button class="k-btn" @click="goAnalysis(viewId, zoneId, item.id)">修改</i-button>
                  <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                </td>
              </tr>
            </tbody>
          </table>
        </vue-scroll>
      </div>
    </div>
    <createResource ref="configRef" @onCreateSuccess="getResources"></createResource>
    <editResource ref="analysisRef" @onEditSuccess="getResources"></editResource>
  </div>
</template>

<script>
import services from "@/services";
import createResource from "./createResource";
import editResource from "./editResource";

export default {
  name: "resourceRecord",
  data() {
    return {
      viewId: "",
      zoneId: " ",
      resList: []
    };
  },
  created() {
    this.viewId = this.$route.query.viewId;
    this.zoneId = this.$route.query.zoneId;
  },
  mounted() {
    this.getResources();
  },
  methods: {
    handleOpenCreate(viewId, zoneId) {
      this.$refs.configRef.openConfig(viewId, zoneId);
    },
    goAnalysis(viewId, zoneId, id) {
      this.$refs.analysisRef.openModel(viewId, zoneId, id);
    },
    getResources() {
      services
        .getResourceRecord(this.viewId, this.zoneId)
        .then(res => {
          this.resList = res.data.data;
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
            .deleteResourceById(this.viewId, this.zoneId, data)
            .then(res => {
              this.$Message.success("删除成功");
              this.getResources();
            })
            .catch(err => {
              this.$Message.success("删除失败");
            });
        }
      });
    }
  },
  components: {
    createResource,
    editResource
  }
};
</script>

<style scoped>
</style>
