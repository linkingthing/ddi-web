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
        <span
          class="tool-bar-icon"
          @click="handlePlus"
        >
          <img
            src="./icon-add.png"
            alt=""
          >
        </span>

        <span
          @click="handleReduce"
          class="tool-bar-icon"
          style="border-top: 1px solid #CCC; margin-bottom: 10px"
        >
          <img
            src="./icon-reduce.png"
            alt=""
          >
        </span>
        <span
          @click="handleSavePicture"
          class="tool-bar-icon"
        >
          <img
            src="./icon-export.png"
            alt=""
          >
        </span>
      </div>

      <div
        class="Tooltip"
        :style="tooltip.style"
      >{{tooltip.text}}</div>
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

const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;

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
      dataList: [],
      tooltip: {
        style: {},
        text: ""
      }
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
      const self = this;

      const { clientWidth, clientHeight } = d3.select("#topplogy-svg").node();
      const [width, height] = [clientWidth, clientHeight - 20];
      this.size = [width, height];
      const svg = d3.select("#topplogy-svg").append("svg").attr("width", width)
        .attr("height", height);


      var defs = svg.append("defs");

      var arrowMarker = defs.append("marker")
        .attr("id", "arrow")
        .attr("class", "arrow")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", 20)
        .attr("markerHeight", 20)
        .attr("viewBox", "0 0 12 12")
        .attr("refX", "6")
        .attr("refY", "6")
        .attr("orient", "auto")
        .attr("fill", "#AAB5BF")
        ;

      var arrow_path = "M2,2 L10,6 L2,10 L2,2";

      arrowMarker.append("path")
        .attr("d", arrow_path);


      this.svg = svg;

      const g = svg.append("g");

      function zoomTransformHandler() {
        g.attr("transform", d3.zoomTransform(svg.node()));
      }

      const zoomHandler = d3.zoom().on("zoom", zoomTransformHandler);
      this.zoomHandler = zoomHandler;

      this.g = g;

      svg.call(zoomHandler);


      const { nodes, links } = parseData(this.dataList); // graph


      const simulation = d3.forceSimulation().alphaDecay(.8) // 设置alpha衰减系数
        .nodes(nodes)
        .force("link", d3.forceLink(links)
          .id(function (d) {
            return d.administrationAddress;
          })) // distance为连线的距离设置
        .force("collide", d3.forceCollide(160)) // collide 为节点指定一个radius区域来防止节点重叠。
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", tick);


      let link = g.selectAll(".link")
        .data(links).enter().append("g");


      let path = link.append("path")
        .attr("id", function (d) {
          return `${d.source.administrationAddress}_${d.source_port}__${d.target.administrationAddress}_${d.target_port}`;
        })
        .attr("class", "link")
        .attr("style", "stroke: #AAB5BF")
        .attr("marker-end", "url(#arrow)")
        .attr("stroke-width", 2)
        ;

      let sourcePortText = link.append("text")
        .append("textPath")
        .attr("xlink:href", function (d) {
          return `#${d.source.administrationAddress}_${d.source_port}__${d.target.administrationAddress}_${d.target_port}`;
        })
        .attr("startOffset", "6%")

        .text(function (d) {
          return d.source_port;
        });

      let targetPortText = link.append("text")
        .append("textPath")
        .attr("xlink:href", function (d) {
          return `#${d.source.administrationAddress}_${d.source_port}__${d.target.administrationAddress}_${d.target_port}`;
        })
        .attr("startOffset", "95%")
        .attr("text-anchor", "end")
        .text(function (d) {
          return d.target_port;
        });



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
        .on("mouseover", (e) => nodeMouseOver(e, "name"))
        .on("mouseout", nodeMouseOut)
        .text(function (d) {
          return overEllipsis(d.name, 10);
        });

      function nodeMouseOver(e, field, offsetY = 0) {
        const transform = d3.zoomTransform(svg.node());

        const { k, x, y } = transform;

        self.tooltip = {
          style: {
            display: "block",
            transform: `translate(${x + (e.x) * k - 20}px,${y + (e.y + offsetY) * k}px)`
          },
          text: e[field]
        };
      }
      function nodeMouseOut() {
        self.tooltip = {
          style: {
            display: "none"
          },
          text: ""
        };
      }

      const nodeIp = node.append("text")
        .attr("x", 70)
        .attr("y", 46)
        .style("font-size", 14)
        .style("color", "#333")
        .on("mouseover", (e) => nodeMouseOver(e, "administrationAddress", 20))
        .on("mouseout", nodeMouseOut)
        .text(function (d) {
          return overEllipsis(d.administrationAddress, 10);
        });

      function overEllipsis(str, len) {
        return str.length > len ? `${str.slice(0, len)}...` : str;
      }

      function tick() {

        path.attr("d", function ({ source, target }) {
          const x1 = source.x;
          const y1 = source.y;
          const x2 = target.x;
          const y2 = target.y;


          let sourceX, sourceY, targetX, targetY;

          const edgeRadialX = 0; // (NODE_WIDTH - NODE_HEIGHT) / 2 + 10;
          const edgeRadialY = NODE_HEIGHT / 2;


          if (x2 > x1) {
            targetX = x2 - edgeRadialX;
            sourceX = x1 + edgeRadialX;
          } else {
            targetX = x2 + edgeRadialX;
            sourceX = x1 - edgeRadialX;
          }

          if (y2 > y1) {
            targetY = y2 - edgeRadialY;
            sourceY = y1 + edgeRadialY;
          } else {
            targetY = y2 + edgeRadialY;
            sourceY = y1 - edgeRadialY;
          }



          return `M ${sourceX} ,${sourceY} L ${targetX} ,${targetY}`;
        });

        sourcePortText
          .attr("x", function ({ source, target }) {
            const x1 = source.x;
            const y1 = source.y;
            const x2 = target.x;
            const y2 = target.y;
            return x1;
          })
          .attr("y", function ({ source, target }) {
            const x1 = source.x;
            const y1 = source.y;
            const x2 = target.x;
            const y2 = target.y;
            return y1;
          });


        node.attr("transform", function (d) {
          // d.fx = d.x;
          // d.fy = d.y;
          const x = d.x - NODE_WIDTH / 2;
          const y = d.y - NODE_HEIGHT / 2;
          return "translate(" + x + " " + y + ")";
        });
      }

    },

    handlePlus() {
      const svg = this.svg;
      this.zoomHandler.scaleTo(svg, function () {
        const transform = d3.zoomTransform(svg.node());
        const { k } = transform;
        return 1.2 * k;
      });

    },

    handleReduce() {
      const svg = this.svg;
      this.zoomHandler.scaleTo(svg, function () {
        const transform = d3.zoomTransform(svg.node());
        const { k } = transform;
        return k / 1.2;
      });

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
    .Tooltip {
      position: absolute;
      display: none;
      color: #fff;
      min-width: 200px;
      height: 30px;
      background-color: rgba(0, 0, 0, 0.7);
      padding: 0 12px;
    }
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

  .tool-bar-icon {
    display: inline-block;
    background: #ededed;
    padding: 5px;
    cursor: pointer;
    img {
      display: block;
    }
  }
}
</style>