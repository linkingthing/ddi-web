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
            :host="item"
            @click="handleGoDeviceInfo(item)"
            :key="item.ip"
            v-for="item in serverList.filter(item => item.role !== 'controller') "
          />
        </div>
      </TabPane>
      <TabPane label="服务器列表" name="serverList">
        <div class="table-box tab-item">
          <Table :data="serverList" :columns="serviceColumns" />
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
      serviceColumns: [
        {
          title: "服务器类型",
          key: "role",
          align: "center"
        },
        {
          title: "服务器名称",
          key: "hostname",
          align: "center"
        },
        {
          title: "服务器IP",
          key: "ip",
          align: "center"
        },
        {
          title: "服务器状态",
          key: "state",
          align: "center",
          render: (h, { row }) => {
            return h("div", [
              h("Badge", {
                props: {
                  status: row.state ? "success" : "error"
                }
              }),
              row.state ? "(在线)" : "(利线)"
            ]);
          }
        }
      ],
      serverList: []
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      services
        .getServerList()
        .then(res => {
          this.serverList = res.data.data;
        })
        .catch(err => err);
    },
    handleTab(tab) {
      console.log(tab);
    },
    handleGoDeviceInfo({ ip, role }) {
      if (role === "controller") {
        this.$router.push({
          name: "ControllerDashboard",
          query: { ip }
        });
      }
      console.log(role);
      if (role === "dns") {
        this.$router.push({
          name: "DNSDashboard",
          query: { ip }
        });
      }

      if (role === "dhcp") {
        this.$router.push({
          name: "DHCPDashboard",
          query: { ip }
        });
      }
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