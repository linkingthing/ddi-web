<template>
  <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">区域转发</span>
    </div>
    <div class="tab-select pding select2">
      <div class="table-box">
        <div class="table-s">
          <table class="table-default">
            <thead>
              <tr>
                <th width="170">服务器地址列表</th>
                <th width="250">转发方式</th>
                <th width="250">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td v-if="this.ips==null">
                  <p>-</p>
                </td>
                <td v-else>
                  <Tags :list="this.ips"/>  
                </td>
                <td>{{this.id1 == 0 ?'-':type}}</td>
                <td>
                  <i-button
                    class="k-btn"
                    @click="goConfig(viewId, zoneId)"
                  >{{this.id1 == 0 ?'新增':'修改'}}</i-button>
                  <i-button class="k-btn" @click="delect">删除</i-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <editForward ref="alarmRef" @onSuccess="getView"></editForward>
    </div>
  </div>
</template>

<script>
import editForward from "./editForward";
import services from "@/services";

export default {
  name: "forwardList",
  data() {
    return {
      list: [],
      id: "",
      modal1: false,
      priority: "",
      acls: [],
      resList: [],
      ips: [],
      type: "",
      id1: "",
      viewId: "",
      zoneId: "",
      current: {}
    };
  },
  created() {
    this.viewId = this.$route.query.viewId;
    this.zoneId = this.$route.query.zoneId;
  },
  components: {
    editForward
  },
  mounted() {
    this.getView();
  },
  methods: {
    goConfig(viewId, zoneId) {
      this.$refs.alarmRef.openModel(viewId, zoneId, this.current);
    },
    getView() {
      services
        .getForwardList(this.viewId, this.zoneId, {
          oper: "GET"
        })
        .then(res => {
          this.type = res.data.type;
          this.id1 = res.data.id;
          this.ips = res.data.ips;
          this.current = res.data;
        })
        .catch(err => {
          this.$Message.error(err.message);
        });
    },

    // 删除
    delect(data) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteForward(this.viewId, this.zoneId, {
              oper: "DEL"
            })
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