<template>
  <div class="node-controll">
    <Select
      class="select-node"
      v-model="currentNode"
      style="width:200px"
    >
      <Option
        v-for="item in serverList"
        :value="`${item.role}-${item.ip}`"
        :key="`${item.role}-${item.ip}`"
      >{{ `${item.role} - ${item.ip}`}}</Option>
    </Select>

    <component
      :is="role"
      :ip="currentIp"
    />
  </div>
</template>

<script>
import services from "@/services";
import DHCPDashboard from "./DHCPDashboard";
import DNSDashboard from "./DNSDashboard";

export default {
  components: {
    DHCPDashboard,
    DNSDashboard
  },
  props: {},
  data() {
    return {
      role: "DNSDashboard",
      currentIp: "",
      currentNode: "",
      serverList: []
    };
  },
  computed: {},
  watch: {
    currentNode(value) {
      const [role, ip] = value.split("-");
      this.currentIp = ip;
      if (role === "dhcp") {
        this.role = "DHCPDashboard";
      } else {
        this.role = "DNSDashboard";
      }
    }
  },
  created() {
    this.getList();
  },
  mounted() { },
  methods: {
    getList() {
      services
        .getServerList()
        .then(res => {
          this.serverList = res.data.data.filter(item => item.role !== "controller");
          const firstNode = this.serverList[0];
          this.currentNode = `${firstNode.role}-${firstNode.ip}`;
          this.currentIp = firstNode.ip;
        })
        .catch(err => err);
    },
  }
};
</script>

<style lang="less" scoped>
.node-controll {
  position: relative;
  height: 240px;
  .select-node {
    position: absolute;
    left: 200px;
    top: 12px;
    padding: 20px;
  }
}
</style>