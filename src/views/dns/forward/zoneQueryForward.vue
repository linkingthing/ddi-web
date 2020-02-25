<template>
  <div class="index-main t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="table-box">
      <div class="table-s">
        <table class="table-default">
          <thead>
            <tr>
              <th width="345">域名</th>
              <th width="335">转发地址数量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in this.dsliteList" :key="item.id">
              <td>
                <router-link
                  :to="{name:'forwardList',query:{viewId,zoneId: item.id,name:item.name}}"
                >{{item.name}}</router-link>
              </td>
              <td>{{item.forwardsize}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "dsliteAnalysis",
  data() {
    return {
      viewId: "",
      dsliteList: []
    };
  },
  created() {
    this.viewId = this.$route.query.id;
  },
  mounted() {
    this.getManger();
  },
  methods: {
    getManger() {
      services
        .getZoneByViewId(this.viewId)
        .then(res => {
          this.dsliteList = res.data.data;
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
