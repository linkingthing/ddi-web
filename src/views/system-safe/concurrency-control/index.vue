<template>
  <div>
    <div class="divline">
      <i-form :label-width="260" :model="formItem">
        <Row>
          <i-col span="18">
            <form-item
              label="递归并发数（个）"
              prop="recursiveClients"
              style="font-size:20px;">
              <InputNumber v-model="formItem.recursiveClients" style=" width:300px;"/>
              <i-button type="primary" @click="primary">保存</i-button>
            </form-item>
          </i-col>
          <i-col span="18">
            <form-item
              label="单一域递归并发数（个）"
              prop="fetchesPerZone"
              style="font-size:20px;">
              <InputNumber v-model="formItem.fetchesPerZone" style="width:300px;"/>
              <i-button type="primary" @click="primary">保存</i-button>
            </form-item>
          </i-col>
          <i-col span="18">
            <Form-item style="font-size:20px;margin-left:30%;margin-top:5%;"/>
          </i-col>
        </Row>
      </i-form>
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
        recursiveClients: null,
        fetchesPerZone: null
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
            this.formItem.recursiveClients = +this.list[key].recursiveClients;
            this.formItem.fetchesPerZone = +this.list[key].fetchesPerZone;
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
        .then(() => {
          this.$Message.success("保存成功");
          this.getView();
        })
        .catch(() => {
          this.$Message.success("保存失败");
        });
    }
  }
};
</script>

<style scoped>
.divline {
  padding-top: 50px;
}
</style>
