<template>
  <div class="nodeManage">
    <Tabs @on-click="handleTab">
      <TabPane label="拓扑图" name="topology">
        <div class="parent tab-item">
          <div
            class="host"
            @click="handleGoDeviceInfo(item)"
            v-for="item in serverList.filter(item => item.role === 'controller') "
            :key="item.ip"
          >
            <host-node :host="item" />
          </div>
        </div>
        <div class="children">
          <host-node
            @click="handleGoDeviceInfo(item)"
            :host="item"
            :key="item.ip"
            v-for="item in serverList.filter(item => item.role !== 'controller') "
          />
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
              <tr v-for="item in serverList" :key="item.ip">
                <td>{{item.role}}</td>
                <td>{{item.hostname}}</td>
                <td>{{item.ip}}</td>
                <td>
                  <Badge :status="item.state ? 'success' : 'error'" />
                  {{item.state ? "(在线)": "(利线)" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import services from "@/services";
import HostNode from "./HostNode";
export default {
  components: {
    "host-node": HostNode
  },
  props: {},
  data() {
    return {
      topology: [],
      serverList: []
    };
  },

  mounted() {
    // this.getTopology();
    this.getList();
  },

  methods: {
    // getTopology() {
    //   services.getNodeList({}).then(res => {
    //     this.topology = res.data.data;
    //   });
    // },
    getList() {
      services.getServerList().then(res => {
        this.serverList = res.data.data;
      });
    },
    handleTab(tab) {
      console.log(tab);
    },
    handleGoDeviceInfo({ ip }) {
      this.$router.push({
        name: "DeviceInformation",
        query: { ip }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.nodeManage {
  padding: 30px;
}
.parent {
  display: flex;
  justify-content: center;
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

.children {
  text-align: center;
  margin-top: 140px;

  .host {
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