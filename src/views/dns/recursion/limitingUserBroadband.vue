<template>
  <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">A4地址合成</span>
    </div>
    <div class="tab-select pding select2">
      <div class="table-box">
        <div class="table-s">
          <table class="table-default">
            <thead>
              <tr>
                <th width="170">视图</th>
                <th width="250">规则数量</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in this.list" :key="item.id">
                <td>
                  <router-link
                    :to="{
                      name:'restrictWebsiteVisits',
                      query:{
                        id:item.id,
                        dns64s:item.links.dns64s
                      }
                    }"
                  >{{item.name}}</router-link>
                </td>
                <td>{{item.dns64size}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <createDefaultA4 ref="networkRef"></createDefaultA4>
      <editDefaultA4 ref="subnetRef"></editDefaultA4>
    </div>
  </div>
</template>

<script>
import services from "@/services";
import createDefaultA4 from "./createDefaultA4";
import editDefaultA4 from "./editDefaultA4";

export default {
  name: "limitingUserBroadband",
  data() {
    return {
      list: [],
      id: "",
      name: "",
      remove: "",
      modal1: false,
      priority: "",
      acls: [],
      dns64s: ""
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
    getView() {
      services
        .getViewList()
        .then(res => {
          this.list = res.data.data;
          for (var key in this.list) {
            this.dns64s = this.list[key].links.dns64s;
          }
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
