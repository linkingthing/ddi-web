<template>
  <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">开发控制</span>
    </div>
    <div class="tab-select pding select2">
      <div class="pop-body">
        <i-form :label-width="260" :model="formItem">
          <Row>
            <i-col span="18">
              <form-item  label="递归并发数（个）" prop="recursiveClients" style="font-size:20px;">
                <i-input v-model="formItem.recursiveClients" style=" width:300px;"></i-input>
                <i-button type="primary" @click="primary">保存</i-button>
              </form-item>
            </i-col>
            <i-col span="18">
              <form-item label="单一域递归并发数（个）" prop="fetchesPerZone" style="font-size:20px;">
                <i-input v-model="formItem.fetchesPerZone" style="width:300px;"></i-input>
                <i-button type="primary" @click="primary">保存</i-button>
              </form-item>
            </i-col>
            <i-col span="18">
              <Form-item style="font-size:20px;margin-left:30%;margin-top:5%;"></Form-item>
            </i-col>
          </Row>
        </i-form>
      </div>
    </div>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "developmentcontrol",
  data() {
    return {
      list: [],
      recursiveClients: "",
      fetchesPerZone: "",
      formItem: {
        recursiveClients: "",
        fetchesPerZone: ""
      }
    };
  },
  mounted() {
    this.getView();
  },
  methods: {
    getView() {
      services
        .getRecursiveConcurrents()
        .then(res => {
          this.list = res.data.data;
          for (var key in this.list) {
            this.formItem.recursiveClients = this.list[key].recursiveClients;
            this.formItem.fetchesPerZone = this.list[key].fetchesPerZone;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 保存
    primary() {
      services
        .saveRecursiveConcurrents({
          recursiveClients: Number(this.formItem.recursiveClients),
          fetchesPerZone: +this.formItem.fetchesPerZone
        })
        .then(res => {
          this.$Message.success("保存成功");
          this.getView();
        })
        .catch(err => {
          this.$Message.success("保存失败");
        });
    }
  }
};
</script>

<style scoped>
</style>
