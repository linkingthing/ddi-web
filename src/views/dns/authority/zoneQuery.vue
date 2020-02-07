<template>
  <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">区域查询</span>
      <div class="button-box fr">
        <i-button
          type="primary"
          class="me-button add-btn"
          icon="md-add"
          @click="handleOpenCreate(id)"
        >新建</i-button>
      </div>
    </div>
    <div class="tab-select pding select2">
      <div class="table-box">
        <div class="table-s">
          <table class="table-default">
            <thead>
              <tr>
                <th width="170">区名称</th>
                <th width="250">资源记录数量</th>
                <th width="250">是否启用</th>
                <th width="250">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in this.arealist" :key="item.id">
                <td>
                  <router-link
                    :to="{name:'resourceRecord',query:{viewId, zoneId:item.id,}}"
                  >{{item.name}}</router-link>
                </td>
                <td>{{item.rrsize}}</td>
                <td>{{item.isused === 0?'否':'是'}}</td>
                <td>
                  <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <area-app-config ref="areaRef" @onCreateSuccess="getArea"></area-app-config>
    </div>
  </div>
</template>

<script>
import services from "@/services";
import AreaAppConfig from "./AreaAppConfig";
export default {
  name: "zoneQuery",
  data() {
    return {
      id: "",
      viewId: "",
      id1: "",
      name: "",
      remove: "",
      modal1: false,
      arealist: [],
      file: "",
      self: "",
      number: "",
      list: [],
      isused: "",
      data1: "",
      obj: ""
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.viewId = this.$route.query.id;
  },
  mounted() {
    this.getArea();
  },
  methods: {
    getArea() {
      services
        .getZoneByViewId(this.id)
        .then(res => {
          this.data1 = res.data;
          this.arealist = res.data.data;
          this.self = res.data.links.self;
          for (var key in this.arealist) {
            this.id1 = this.arealist[key].id;
            this.name = this.arealist[key].name;
            this.isused = this.arealist[key].isused;
            this.rrsize = this.arealist[key].rrsize;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //新建
    handleOpenCreate(id2) {
      this.$refs.areaRef.openConfig(id2);
    },
   
    // 删除
    delect(zoneId) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteZone(this.id, zoneId)
            .then(res => {
              this.$Message.success("删除成功");
              this.getArea();
            })
            .catch(err => {
              this.$Message.success("删除失败");
            });
        }
      });
    }
  },
  components: {
    AreaAppConfig,
  }
};
</script>

<style scoped>
.table-box table a {
  text-decoration: none;
}
</style>
