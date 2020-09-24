<template>
  <div class="topology">
    <div class="topology-action">
      <Button type="primary">生成网络拓扑</Button>
      <Button type="primary">触发拓扑更新</Button>
    </div>
    <div
      class="topology-inner"
      id="topplogy-svg"
      ref="topplogy-svg"
    >
      <div class="tool-bar">
        <img
          src="./access_switch.png"
          alt=""
        >
        <img
          src="./access_switch.png"
          alt=""
        >
        <img
          @click="handleSavePicture"
          src="./access_switch.png"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { parseData } from "./helper";
import access_switch from "./access_switch.png";
import convergence_switch from "./convergence_switch.png";
import core_switch from "./core_switch.png";
import firewall from "./firewall.png";
import router from "./router.png";
import security_gateway from "./security_gateway.png";

const EQUIPMENT_ICON_MAP = {
  access_switch,
  convergence_switch,
  core_switch,
  firewall,
  router,
  security_gateway
}

export default {
  components: {},
  props: {
    margin: {
      type: Object,
      default: () => ({
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      })
    }
  },
  data() {
    return {
      dataList: []
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.getDataList();

  },
  methods: {
    getDataList() {
      this.$get(this.$getApiByRoute("/address/ipam/networkequipments")).then(({ data }) => {
        this.dataList = data;

        this.initTopology();

      });
    },

    initTopology() {

      const NODE_WIDTH = 180;
      const NODE_HEIGHT = 60;
      const { clientWidth, clientHeight } = d3.select("#topplogy-svg").node();
      const [width, height] = [clientWidth, clientHeight - 20];
      this.size = [width, height];
      const svg = d3.select("#topplogy-svg").append("svg").attr("width", width)
        .attr("height", height);

      this.svg = svg;

      const g = svg.append("g");

      const zoomHandler = d3.zoom().on("zoom", function () {
        g.attr("transform", d3.zoomTransform(svg.node()));
      });

      svg.call(zoomHandler);


      const { nodes, links } = parseData(this.dataList); // graph


      const simulation = d3.forceSimulation().alphaDecay(.8) // 设置alpha衰减系数
        .nodes(nodes)
        .force("link", d3.forceLink(links)
          .id(function (d) {
            return d.administrationAddress;
          })) // distance为连线的距离设置
        .force("collide", d3.forceCollide(160)) // collide 为节点指定一个radius区域来防止节点重叠。

        // .force("positioning", d3.forceX(1).strength(1))



        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", tick);


      let link = g.selectAll(".link").data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("style", "stroke: #AAB5BF")
        ;

      let node = g.selectAll(".node").data(nodes)
        .enter()
        .append("g");


      node.append("rect")
        .attr("class", "node")

        .attr("rx", NODE_HEIGHT / 2)
        .attr("ry", NODE_HEIGHT / 2)
        .attr("width", NODE_WIDTH)
        .attr("height", NODE_HEIGHT)
        .style("fill", "#fff") // transparent
        .style("stroke", "#D4DCE3");

      const nodeImage = node.append("image")
        .attr("x", 10)
        .attr("y", 6)
        .attr("xlink:href", function (d) {
          return EQUIPMENT_ICON_MAP[d.equipmentType];
        });

      const nodeName = node.append("text")
        .attr("x", 70)
        .attr("y", 22)
        .style("font-size", 14)
        .style("color", "#333")
        .style("font-weight", "bold")
        .text(function (d) {
          return d.name;
        });


      const nodeIp = node.append("text")
        .attr("x", 70)
        .attr("y", 46)
        .style("font-size", 14)
        .style("color", "#333")
        .text(function (d) {
          return d.administrationAddress;
        })

      function tick() {
        link.attr("x1", function (d) { return d.source.x; })
          .attr("y1", function (d) { return d.source.y; })
          .attr("x2", function (d) { return d.target.x; })
          .attr("y2", function (d) { return d.target.y; });

        node.attr("transform", function (d) {
          // d.fx = d.x;
          // d.fy = d.y;
          const x = d.x - NODE_WIDTH / 2;
          const y = d.y - NODE_HEIGHT / 2;
          return "translate(" + x + " " + y + ")";
        });
      }

    },

    handleSavePicture() {

      const serializer = new XMLSerializer();
      const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(this.svg.node());
      const image = new Image;
      image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      const canvas = document.createElement("canvas");
      [canvas.width, canvas.height] = this.size;

      const context = canvas.getContext("2d");
      context.fillStyle = "#fff"; // #fff设置保存后的PNG 是白色的  
      context.fillRect(0, 0, 10000, 10000);
      image.onload = function () {
        context.drawImage(image, 0, 0);
        const a = document.createElement("a");
        a.download = "topology.png";
        a.href = canvas.toDataURL("image/png");
        a.click();
      };


    }
  }
};
</script>

<style lang="less" scoped>
.topology {
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .topology-action {
    position: absolute;
    right: 26px;
    top: 14px;
  }

  .topology-inner {
    position: relative;
    flex: 1;
    border-top: 1px solid #ddd;
  }
}

.node-equipment {
  width: 100px;
  height: 60px;
  background: #f80;
}

.tool-bar {
  position: absolute;
  right: 24px;
  top: 36px;
  display: flex;
  flex-direction: column;
}
</style>