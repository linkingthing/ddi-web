<template>
  <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">重定向</span>
      <div class="button-box fr"></div>
    </div>
    <div class="tab-select pding select2">
      <div class="table-box">
        <div class="table-s">
          <table class="table-default">
            <thead>
              <tr>
                <th width="170">视图</th>
                <th width="250">重定向配置数量</th>
                <th width="250">NXDOMAIN重定向配置数量</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in this.list" :key="item.id">
                <td>
                  <router-link :to="{name:'redirect',query:{id:item.id}}">{{item.name}}</router-link>
                </td>
                <td>{{item.rpzsize}}</td>
                <td>{{item.redirectsize}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "parameterSet",
  data() {
    return {
      list: [],
      id: "",
      name: "",
      remove: "",
      modal1: false,
      priority: "",
      aclids: []
    };
  },
  mounted() {
    this.getView();
  },
  methods: {
    goConfig(type) {
      if (type == 0) {
        this.$refs.deviceRef.openConfig();
      }
    },
    getView() {
      services
        .getViewList()
        .then(res => {
          this.list = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.table-box table a {
  text-decoration: none;
}
</style>
