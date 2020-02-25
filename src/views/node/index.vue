<template>
  <div class="nodeManage">
    <Tabs @on-click="handleTab" value>
      <TabPane label="拓扑图" name="topology">
        <div class="parent tab-item">
          <div class="host" @click="handleGoDeviceInfo">
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
        <div class="table-box tab-item">
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
    },
    handleGoDeviceInfo() {
      this.$router.push({
        name: "DeviceInformation"
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.nodeManage {
  padding: 30px;
}
.parent {
  display: flex;
  justify-content: center;
  .host-info {
  }
  .host {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -60px;
      height: 80px;
      width: 2px;
      border-left: 2px dotted #006fe4;
    }
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
  text-align: center;
  margin-top: 140px;

  .host-item {
    position: relative;
    display: inline-block;
    text-align: left;
    margin: 0 20px;
    width: 300px;

    &::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -80px;
      height: 80px;
      width: 0;
      border-left: 2px dotted #006fe4;
    }
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      top: -80px;
      width: 340px;
      border-top: 2px dotted #006fe4;
    }
    &:last-child::after {
      border: 0;
    }
  }
}
.tab-item {
  padding-top: 60px;
}
</style>