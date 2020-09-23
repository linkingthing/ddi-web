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
    />
  </div>
</template>

<script>
import * as d3 from "d3";
import { parseData } from "./helper";
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
      console.log(d3)
      const [width, height] = [800, 600]
      const svg = d3.select("#topplogy-svg").append("svg").attr("width", width)
        .attr("height", height);

      const { nodes, links } = parseData(this.dataList); // graph


      const simulation = d3.forceSimulation().alphaDecay(0.1) // 设置alpha衰减系数
        .nodes(nodes)

        .force("link", d3.forceLink(links).id(function (d) {
          return d.administrationAddress;
        })) // distance为连线的距离设置
        .force("collide", d3.forceCollide().radius(() => 100)) // collide 为节点指定一个radius区域来防止节点重叠。
        .force("charge", null)  // 节点间的作用力
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", tick);


      let link = svg.selectAll(".link").data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("style", "stroke: #AAB5BF")
        ;

      let node = svg.selectAll(".node").data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 12);


      function tick() {
        link.attr("x1", function (d) { return d.source.x; })
          .attr("y1", function (d) { return d.source.y; })
          .attr("x2", function (d) { return d.target.x; })
          .attr("y2", function (d) { return d.target.y; });

        node.attr("cx", function (d) { d.fx = d.x; return d.x; })
          .attr("cy", function (d) { d.fy = d.y; return d.y; });
      }

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
    flex: 1;
    border-top: 1px solid #ddd;
    background: #e7eeef;
  }
}
</style>