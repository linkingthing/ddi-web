<template>
  <div class="nodeManage">
    <Tabs @on-click="handleTab" value>
      <TabPane label="拓扑图" name="topology">
        <div class="parent">
          <div class="host">
            <img src="../../assets/images/host.png" alt />
            <ul class="host-info">
              <li>图层服务器类型: Controller</li>
              <li>服务器名称: Server1</li>
              <li>服务器IP:10.1.1.1</li>
              <li>服务器状态: (在线)</li>
            </ul>
          </div>
        </div>
        <div class="children">
          <div class="host-item">
            <img src="../../assets/images/dns.png" alt />
            <ul class="host-info">
              <li>图层服务器类型: Controller</li>
              <li>服务器名称: Server1</li>
              <li>服务器IP:10.1.1.1</li>
              <li>服务器状态: (在线)</li>
            </ul>
          </div>
          <div class="host-item">
            <img src="../../assets/images/dhcp.png" alt />
            <ul class="host-info">
              <li>图层服务器类型: Controller</li>
              <li>服务器名称: Server1</li>
              <li>服务器IP:10.1.1.1</li>
              <li>服务器状态: (在线)</li>
            </ul>
          </div>
        </div>
      </TabPane>
      <TabPane label="服务器列表" name="serverList">
        <div class="table-box">
          <table class="table-default">
            <thead>
              <th>服务器类型</th>
              <th>服务器名称</th>
              <th>服务器IP</th>
              <th>服务器状态</th>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    handleTab(tab) {
      console.log(tab);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.parent {
  display: flex;
  justify-content: center;
  .host-info {
  }
}
.host-info {
  display: inline-block;
  color: #252422;
  margin-left: 12px;
  li {
    margin-bottom: 20px;
  }
}
.children {
  display: flex;
  justify-content: space-around;
  .host-item {
    // flex: 1;
  }
}
</style>