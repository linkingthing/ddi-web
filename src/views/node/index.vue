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
          <!-- <span>点击节点即可查看该节点的详细数据信息</span> -->
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
        ref="nodeMapRef"
      >

        <div class="node-map-inner">
          <!-- <VueDragResize :is-resizable="false"> -->
          <svg ref="nodeMapRef">
            <g
              v-for="(item, index) in curve"
              :key="index"
            >
              <path
                :d="item.d"
                stroke="#7BAFFD"
                :data-slave="`${item.isSalve}`"
                :stroke-dasharray="item.isSalve ? '10,10': 'false' "
                fill="none"
                style="stroke-width: 2px;"
              />
              <!-- <text
                :x="item.x"
                :y="item.y"
                v-if="item.isSalve"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#333"
                font-size="12"
              >
                <tspan
                  dy="0"
                  :title="item.vip"
                >{{item.vip}}</tspan>

              </text>
              <text
                :x="item.x"
                :y="item.y"
                v-if="item.isSalve"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#333"
                font-size="12"
              >
                <tspan dy="25">VIP</tspan>

              </text> -->

            </g>
          </svg>
          <div
            class="node-group"
            :key="controllerItem.ip"
            v-for="controllerItem in controllerList"
          >
            <div class="controller-box">
              <div class="controller-item ">
                <div class="controller-master node-item">
                  <map-node-item
                    v-position="{ip: controllerItem.id, type: 'controller', node: controllerItem, getPosition}"
                    :value="controllerItem"
                    :key="controllerItem.ip"
                    @mouseenter="handleMouseenter"
                    @mouseleave="handleMouseleave"
                  />
                </div>
                <div class="controller-slave ">
                  <div
                    class="slave-node "
                    v-for="slave in controllerItem.slaveList"
                    :key="slave.ip"
                  >
                    <map-node-item
                      v-position="{ip: slave.ip, master: slave.master,type: 'slave', node: slave, getPosition}"
                      :value="slave"
                      :key="slave.ip"
                      @mouseenter="handleMouseenter"
                      @mouseleave="handleMouseleave"
                    />
                  </div>

                </div>
              </div>
            </div>
            <div
              class="common-node-box"
              v-if="controllerItem.children && controllerItem.children.length"
            >
              <div
                class="common-node-item "
                v-for="item in controllerItem.children"
                :key="item.ip"
              >
                <div class="node-item">
                  <map-node-item
                    :value="item"
                    v-position="{ip: item.ip, master: item.controllerIP, type: 'child',hasSlave: !!(item.slave&& item.slave.length),node: item, getPosition}"
                    :key="item.ip"
                    @mouseenter="handleMouseenter"
                    @mouseleave="handleMouseleave"
                  />
                </div>
                <div class="common-node-item-slave ">

                  <div
                    class="slave-node "
                    v-for="slave in item.slaveList"
                    :key="slave.ip"
                  >
                    <map-node-item
                      v-position="{ip: slave.ip, master: slave.master,type: 'slave',node: slave, getPosition}"
                      :value="slave"
                      :key="slave.ip"
                      @mouseenter="handleMouseenter"
                      @mouseleave="handleMouseleave"
                    />
                  </div>
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
import ServerInfo from "./modules/server-info";
import MapNodeItem from "./modules/map-node-item";

export default {
  components: {
    "server-info": ServerInfo,
    "map-node-item": MapNodeItem
  },
  props: {},
  data() {
    return {
      timer: null,
      parserRunTime: {},

      nodeList: [],
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

      positionMap: [],
      zoom: 1
    };
  },
  computed: {

    controllerList() {
      const tree = this.nodeList2Tree(this.nodeList);
      return tree;
    },

    curve() {
      const svgCurveList = this.svgPathGroup.map(item => {

        const qox = item.startX + (item.endX - item.startX) / 2;
        const qoy = item.startY + (item.endY - item.startY) / 4;

        const qtx = item.endX - (item.endX - item.startX) * 3 / 8;
        const qty = item.endY - (item.endY - item.startY) / 4;

        const d = `M${item.startX} ${item.startY} Q${qox} ${qoy} ${qtx} ${qty} T${item.endX} ${item.endY}`;
        return {
          d,
          isSalve: item.slave,
          vip: item.vip,
          x: (item.startX + item.endX) / 2,
          y: (item.startY + item.endY) / 2 - 10
        };
      });

      return svgCurveList;
    }

  },
  watch: {
    positionMap: {
      deep: true,
      handler(value) {

        let startXPointMap = {};
        let lineGroup = [];

        value.forEach(item => {
          if (item.type === "child") {
            startXPointMap[item.ip] = item;
          }
          if (item.type === "controller") {
            startXPointMap[item.ip] = item;
          } else {
            const endPoint = item;
            const startPoint = startXPointMap[item.master];

            if (startPoint && endPoint) {
              lineGroup.push({ startPoint, endPoint, slave: item.type === "slave" });

            } else {
              throw new Error(`positionMap 方法构造连线失败，${startPoint},${JSON.stringify(endPoint)}`);
            }
          }
        });

        this.svgPathGroup = this.point2Path(lineGroup);

      }
    }

  },

  mounted() {

    this.nodeMapRef = this.$refs.nodeMapRef;

    this.getNodeInfo();
    this.timer = setInterval(() => {
      this.parserRunTime = this.excuteRunTime();
    }, 1000);

    addEventListener("resize", this.reDrawLine);

  },
  destroyed() {
    clearInterval(this.timer);
    removeEventListener("resize", this.reDrawLine);
  },

  methods: {
    nodeList2Tree(list) {
      let tree = [];

      let map = {};
      list.forEach(item => {
        map[item.id] = item;
      });


      list.forEach(item => {
        const master = map[item.master];
        const controller = map[item.controllerIP];

        if (item.controllerIP === item.id ) {
          tree.push(item);
        } else {
          if (item.master) {
            if (Array.isArray(master.slaveList)) {
              if (!master.slaveList.find(slave => slave.id === item.id)) {
                master.slaveList.push(item);
              }
            } else {
              master.slaveList = [item];
            }

          } else if (item.controllerIP) {

            if (Array.isArray(controller.children)) {
              if (!controller.children.find(child => child.id === item.id)) {
                controller.children.push(item);
              }
            } else {
              controller.children = [item];
            }

          }

        }
      });

      return tree;

    },

    findNodeFromTree(tree, id, catogary) {

      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.id === id) {
          return node;
        } else {
          if (Array.isArray(node[catogary])) {
            return this.findNodeFromTree(node[catogary], id, catogary)
          }
        }
      }
      return null;

    },
    getNodeInfo() {

      let requestCount = 0;
      let totalQps = 0;
      let totalLps = 0;

      this.$get(this.$getApiByRoute("/monitor/metric/nodes")).then(({ data }) => {
        this.nodeList = data;

        Array.isArray(data) && data.forEach(async ({ startTime, roles, links }) => {
          if (roles.includes("controller")) {

            this.bootTime = moment(startTime).format("YYYY.MM.DD HH:mm");
            this.bootTimestamp = startTime;

          }

          const { data: dnsData } = await this.$get({ url: links.dnses });

          const qpsList = dnsData.find(item => item.id === "qps").qps.values;

          const lastQps = Array.isArray(qpsList) ? qpsList[qpsList.length - 1] : 0;


          if (typeof lastQps.value === "number") {
            totalQps += lastQps.value;
          }


          const { data: dhcpData } = await this.$get({ url: links.dhcps });

          const lpsList = dhcpData.find(item => item.id === "lps").lps.values;
          const lastLps = Array.isArray(lpsList) ? lpsList[lpsList.length - 1] : {};


          if (typeof lastLps.value === "number") {
            totalLps += lastLps.value;
          }

          requestCount++;

          if (requestCount === data.length) {
            this.totalQps = totalQps;
            this.totalLps = totalLps;
          }

        });
      }).catch(err => {
        console.log(err, "node");
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


      const maxWidth = this.nodeMapRef.clientWidth;
      const maxHeight = this.nodeMapRef.clientHeight;
      let serverInfoLeft = offsetLeft + clientWidth + 24;
      if (serverInfoLeft + clientWidth > maxWidth) {
        serverInfoLeft = offsetLeft - clientWidth + 24;
      }

      let serverInfoTop = offsetTop;
      if (serverInfoTop + 225 > maxHeight) {
        serverInfoTop = maxHeight - 250;
      }

      this.serverInfoLeft = serverInfoLeft;
      this.serverInfoTop = serverInfoTop;
    },

    handleMouseleave() {
      this.visible = false;
    },

    handleScroll(direction, el) {
      const zoom = el.dataset.transform || 1;
      if (direction === "down") {
        if (zoom > 0.4) {
          const newZoom = Number(zoom) - 0.2;
          el.style.transform = `scale(${newZoom})`;
          el.dataset.transform = newZoom;
          this.zoom = newZoom;
        }

      } else {
        const newZoom = Number(zoom) + 0.2;
        el.style.transform = `scale(${newZoom})`;
        el.dataset.transform = newZoom;
        this.zoom = newZoom;
      }
    },

    getPosition(position) {
      // console.log("position", position)
      this.positionMap.push(position);
      // 下一步要不要排个序
    },

    point2Path(pointList) {
      const pathList = pointList.map(({ startPoint, endPoint, slave }) => {

        let startX = 0;
        let endX = 0;

        if (startPoint.offsetLeft > endPoint.offsetLeft) {
          startX = startPoint.offsetLeft;
          endX = endPoint.offsetLeft + endPoint.offsetWidth;
        } else {
          startX = startPoint.offsetLeft + startPoint.offsetWidth;
          endX = endPoint.offsetLeft;
        }
        return {
          startX,
          startY: startPoint.offsetTop + startPoint.offsetHeight / 2,
          endX,
          endY: endPoint.offsetTop + endPoint.offsetHeight / 2,
          slave,
          vip: startPoint.node.vip || endPoint.node.vip
        };
      });

      return pathList;
    },

    reDrawLine() {
      const nodeList = this.nodeList;
      this.nodeList = [];
      this.positionMap = [];
      this.$nextTick().then(() => {
        this.nodeList = nodeList;
      });

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
  z-index: 80;
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
      background-image: linear-gradient(45deg, #5568f9, #8094f9);
      margin-left: 0;
    }
    &:nth-child(2) {
      background-image: linear-gradient(45deg, #3b7cff, #749efd);
    }
    &:nth-child(3) {
      background-image: linear-gradient(45deg, #32adf4, #74bcfa);
    }
    &:last-child {
      margin-right: 0;
      background-image: linear-gradient(45deg, #27c0e6, #61d1ed);
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
      text-align: center;
      // background: #ddd;

      svg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 500%;
      }
    }
  }
}

.node-group {
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  .node-item {
    padding: 40px 60px;
    text-align: left;
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
    align-items: center;
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

    // width: 300px;
  }

  .common-node-item {
    flex: 1;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .slave-node {
    // height: 104px;
    // background: #f20;
    margin: 20px 30px;
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