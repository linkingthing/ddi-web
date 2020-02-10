<template>
  <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">区转发</span>
    </div>
    <div class="tab-select pding select2">
      <div class="table-box">
        <div class="table-s">
          <table class="table-default">
            <thead>
              <tr>
                <th width="170">视图</th>
                <th width="170">域名数量</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in this.list" :key="item.id">
                <td>
                  <router-link
                    :to="{
                      name:'zoneQueryForward',
                      query:{id:item.id,name:item.name}
                    }"
                  >{{item.name}}</router-link>
                </td>
                <td>{{item.zonesize}}</td>
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
  name: "applicationFirewall",
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
  mounted() {
    this.getManger();
  },
  methods: {
    getManger() {
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
