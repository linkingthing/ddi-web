<template>
  <div class="monitor dashboard">
    <h1>概览</h1>
    <div class="count-card-list">
      <div class="count-card-item">
        <strong>{{totalQps}}</strong>
        <span>QPS（个）</span>
        <img
          class="count-card-item-img"
          src="../../assets/images/monitor-speed.png"
          alt=""
        >
      </div>
      <div class="count-card-item">
        <strong>{{totalLps}}</strong>
        <span>LPS（个）</span>
        <img
          class="count-card-item-img"
          src="../../assets/images/monitor-line.png"
          alt=""
        >
      </div>
      <div class="count-card-item">
        <strong>{{bootTime}}</strong>
        <span>系统启动时间</span>
        <img
          class="count-card-item-img"
          src="../../assets/images/monitor-time.png"
          alt=""
        >
      </div>
      <div class="count-card-item">
        <strong>
          {{parserRunTime.days || 0}} <span>天</span>
          {{parserRunTime.hours || 0}} <span>时</span>
          {{parserRunTime.minutes || 0}} <span>分</span>
          {{parserRunTime.seconds || 0}} <span>秒</span>
        </strong>
        <span>系统运行总时长</span>
        <img
          class="count-card-item-img"
          src="../../assets/images/monitor-live.png"
          alt=""
        >
      </div>
    </div>

    <section class="node-map">
      <header class="node-map-header">
        <div>
          <h3>节点分布图</h3>
          <span>点击节点即可查看该节点的详细数据信息</span>
        </div>
        <div>
          <i class="success" />
          <span>在线</span>
          <i class="error" />
          <span>离线</span>
        </div>
      </header>
      <section
        class="node-map-content"
        v-scroll="handleScroll"
      >

        <div class="node-map-inner">
          <!-- <VueDragResize :is-resizable="false"> -->
          <svg ref="nodeMapRef">
            <path
              v-for="(item, index) in svgPathGroup"
              :key="index"
              :d="`M${item.startX} ${item.startY} Q${item.endX-30} ${item.endY} ${item.endX-10} ${item.endY} T${item.endX} ${item.endY}`"
              stroke="#7BAFFD"
              stroke-dasharray="10,10"
              fill="none"
              style="stroke-width: 2px;"
            />
          </svg>
          <div class="node-group">
            <div class="controller-box">
              <div
                class="controller-item "
                v-for="item in controllerList"
                :key="item.ip"
              >
                <div class="controller-master node-item">
                  <map-node-item
                    v-position="{ip: item.ip, end:item.controllerIP, getPosition}"
                    :value="item"
                    :key="item.ip"
                    @mouseenter="handleMouseenter"
                    @mouseleave="handleMouseleave"
                  />
                </div>
                <div class="controller-slave node-item">
                  <div class="slave-node"></div>

                </div>
              </div>
            </div>
            <div class="common-node-box">
              <div
                class="common-node-item "
                v-for="item in commonNodeList"
                :key="item.ip"
              >
                <div class="node-item">
                  <map-node-item
                    :value="item"
                    v-position="{ip: item.ip, master: item.controllerIP, getPosition}"
                    :key="item.ip"
                    @mouseenter="handleMouseenter"
                    @mouseleave="handleMouseleave"
                  />
                </div>
                <div class="common-node-item-slave node-item">
                  <div class="slave-node"></div>
                </div>
              </div>
            </div>

          </div>
          <!-- </VueDragResize> -->

        </div>

        <server-info
          :visible="visible"
          :server="server"
          :style="`left:${serverInfoLeft}px;top: ${serverInfoTop}px`"
        />
      </section>

    </section>
  </div>
</template>

<script>

import moment from "moment";
moment.locale("zh-cn");

import VueDragResize from "vue-drag-resize";

import ServerInfo from "./modules/server-info";
import MapNodeItem from "./modules/map-node-item";



export default {
  components: {
    VueDragResize,
    "server-info": ServerInfo,
    "map-node-item": MapNodeItem
  },
  props: {},
  data() {
    return {
      timer: null,
      parserRunTime: {},

      nodeList: [
        // {
        //   ip: "10.0.0.20",
        //   roles: ["controller"]
        // },
        // {
        //   roles: ["dns"]
        // },
        // {
        //   roles: ["dhcp"]
        // },
        // {
        //   roles: ["dns"]
        // },
        // {
        //   roles: ["dhcp"]
        // },
        // {
        //   roles: ["dns"]
        // },
        // {
        //   ip: "10.0.0.1",
        //   controllerIP: "10.0.0.20",
        //   roles: ["dhcp"]
        // },
        // {
        //   ip: "10.0.0.10",
        //   controllerIP: "10.0.0.20",

        //   roles: ["dns"]
        // },
        // {
        //   ip: "10.0.0.12",
        //   controllerIP: "10.0.0.20",
        //   roles: ["dhcp"]
        // },
        // {
        //   roles: ["controller"]
        // }, {
        //   roles: ["controller"]
        // }
      ],
      totalQps: 0,
      totalLps: 0,
      bootTimestamp: "",
      bootTime: "0000.00.00",
      runTime: "",

      visible: false,
      serverInfoLeft: 0,
      serverInfoTop: 0,
      server: {},

      nodeMapRef: null,

      svgPathGroup: [],

      positionMap: []
    };
  },
  computed: {

    controllerList() {
      const result = this.nodeList.filter(item => item.roles.includes("controller"));
      return result;
    },
    commonNodeList() {
      const result = this.nodeList.filter(item => !item.roles.includes("controller"));
      return result;
    }

  },
  watch: {
    positionMap: {
      deep: true,
      handler(value) {
        // 杯子算法
        let startXPointMap = {};
        let lineGroup = [];

        console.log(value)
        value.forEach(item => {
          if (!item.master) {
            startXPointMap[item.ip] = item;
          } else {
            const endPoint = item;
            const startPoint = startXPointMap[item.master];
            lineGroup.push({ startPoint, endPoint });
          }
        });

        console.log(lineGroup)
        this.svgPathGroup = this.point2Path(lineGroup)

      }
    }

  },

  mounted() {


    this.getNodeInfo();
    this.timer = setInterval(() => {
      this.parserRunTime = this.excuteRunTime();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    async getNodeInfo() {
      let requestCount = 0;
      let totalQps = 0;
      let qpsTime = 0;
      let totalLps = 0;
      let lpsTime = 0;

      const { data } = await this.$get(this.$getApiByRoute("/monitor/metric/nodes"));

      this.nodeList = data;

      Array.isArray(data) && data.forEach(async ({ creationTimestamp, roles, links }) => {
        if (roles.includes("controller")) {

          this.bootTime = moment(creationTimestamp).format("YYYY.MM.DD HH:mm");
          this.bootTimestamp = creationTimestamp;

        }

        const { data: dnsData } = await this.$get({ url: links.dnses });

        const qpsList = dnsData.find(item => item.id === "qps").qps.values;

        const lastQps = Array.isArray(qpsList) ? qpsList[qpsList.length - 1] : 0;

        // console.log(dnsData)
        console.log(1)
        // const lastQps = { timestamp: "2020-06-10T09:57:39+08:00", value: 3 }

        if (typeof lastQps.value === "number") {
          totalQps += lastQps.value;
          qpsTime++;
        }


        const { data: dhcpData } = await this.$get({ url: links.dhcps });

        const lpsList = dhcpData.find(item => item.id === "lps").lps.values;
        const lastLps = Array.isArray(lpsList) ? lpsList[lpsList.length - 1] : {};

        // console.log(lpsList, "lpsList", lastLps)

        if (typeof lastLps.value === "number") {
          totalLps += lastLps.value;
          lpsTime++;
        }

        requestCount++;

        if (requestCount === data.length) {
          console.log(2)
          this.totalQps = totalQps / qpsTime || 0;
          this.totalLps = totalLps / lpsTime || 0;
        }

      });

    },

    excuteRunTime() {
      const createMoment = moment(this.bootTime);
      const secondCount = moment().unix() - createMoment.unix();

      const days = parseInt(secondCount / (3600 * 24));
      const hours = parseInt((secondCount - days * 3600 * 24) / 3600);
      const minutes = parseInt((secondCount - days * 3600 * 24 - hours * 3600) / 60);
      const seconds = parseInt((secondCount - hours * 3600) % 60);

      return { days, hours, minutes, seconds }; // 2*3600*24+17*3600+55*60+44 237344
    },

    handleMouseenter(server, e) {
      this.visible = true;
      this.server = server;
      const { clientWidth, offsetLeft, offsetTop } = e.target;
      this.serverInfoLeft = offsetLeft + clientWidth + 24;
      this.serverInfoTop = offsetTop - 24;
    },

    handleMouseleave() {
      this.visible = false;
    },

    handleScroll(direction, el, e) {
      const zoom = el.dataset.transform || 1;
      if (direction === "down") {
        if (zoom > 0.4) {
          el.style.transform = `scale(${Number(zoom) - 0.2})`;
          el.dataset.transform = Number(zoom) - 0.2;
        }

      } else {
        el.style.transform = `scale(${Number(zoom) + 0.2})`;
        el.dataset.transform = Number(zoom) + 0.2;
      }
    },

    getPosition(position) {
      this.positionMap.push(position);
      // 下一步要不要排个序
    },

    point2Path(pointList) {
      const pathList = pointList.map(({ startPoint, endPoint }) => {
        console.log(startPoint)

        return {
          startX: startPoint.offsetLeft + startPoint.offsetWidth,
          startY: startPoint.offsetTop + startPoint.offsetHeight / 2,
          endX: endPoint.offsetLeft,
          endY: endPoint.offsetTop + endPoint.offsetHeight / 2
        };
      });

      console.log(pathList)
      return pathList;
    }
  }
};

</script>
<style lang="less" scoped>
@import url("./index.less");

.monitor {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background: #f6f6f6;
  z-index: 10;
  padding-right: 0;
  h1 {
    font-size: 20px;
    color: #333;
    margin-top: 20px;
    line-height: 1;
  }
}

.count-card-list {
  display: flex;
  justify-content: space-evenly;
  padding: 20px 0;

  .count-card-item {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 138px;
    border-radius: 4px;
    padding: 20px;
    margin: 0 10px;
    color: #fff;
    strong {
      display: block;
      font-size: 36px;
      margin-bottom: 5px;
    }
    span {
      font-size: 16px;
    }

    .count-card-item-img {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 100px;
      height: 100px;
    }

    &:first-child {
      background-image: linear-gradient(180deg, #4089f0, #5aa3f2);
      margin-left: 0;
    }
    &:nth-child(2) {
      background-image: linear-gradient(180deg, #6561d9, #7361e4);
    }
    &:nth-child(3) {
      background-image: linear-gradient(180deg, #4cc96d, #66d681);
    }
    &:last-child {
      margin-right: 0;
      background-image: linear-gradient(180deg, #d8854d, #d7a153);
    }
  }
}

.node-map {
  background: #fff;
  box-shadow: 0px 0px 21px 3px rgba(120, 120, 120, 0.09);
  border-radius: 6px;
  flex: 1;
  display: flex;
  flex-direction: column;
  .node-map-header {
    display: flex;
    justify-content: space-between;
    padding: 24px;
    line-height: 1;
    border-bottom: 1px solid #f6f6f6;
    & > * {
      display: flex;
      justify-content: space-between;
    }
    h3 {
      display: inline-block;
      font-size: 18px;
      color: #333;
    }
    span {
      font-size: 14px;
      line-height: 18px;
      color: #999;
      padding-left: 8px;
    }

    i {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: 3px;
      margin-left: 30px;
      &.success {
        background: #4ad66c;
      }
      &.error {
        background: #f15e5e;
      }
    }
  }
  .node-map-content {
    position: relative;
    flex: 1;
    overflow: hidden;

    .node-map-inner {
      position: absolute;
      width: 100%;
      height: 100%;
      // background: #ddd;

      svg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
}

.node-group {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .node-item {
    padding: 40px;
  }
  .controller-box,
  .common-node-box {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .controller-item {
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-evenly;
    // margin: 40px;
    & > .controller-master,
    & > .controller-slave {
      // padding: 40px;
    }
  }
  .controller-master {
    // flex: 1;
  }
  .controller-slave,
  .common-node-item-slave {
    // flex: 1;

    width: 300px;
  }

  .common-node-item {
    flex: 1;
    display: flex;
    justify-content: space-evenly;
  }

  .slave-node {
    height: 104px;
    // background: #f20;
  }
}

@media screen and (max-width: 1800px) {
  .count-card-list {
    .count-card-item {
      strong {
        font-size: 24px;
      }
    }
  }
}
</style>