<template>
  <div class="tree" ref="tree" id="tree">
    <div class="tree-pop" ref="pop" :class="{active: activePop}">
      <slot name="pop" :props="current"></slot>
    </div>
    <div class="tree-node-active"></div>
    <div class="toolTip" ref="toolTip">{{toolTipInfo}}</div>
  </div>
</template>

<script>
import * as d3 from "d3";
import _ from "lodash";

const currentNodeRecord = {
  x: 0,
  y: 0,
  id: 0
};

export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => {
        return {
          radius: 4,
          margin: {
            left: 100,
            top: 100,
            right: 50,
            bottom: 50
          },
          commonNodeBackgroundColor: "#f5f5f5",
          healthNodeBackgroundColor: "#008000"
        };
      }
    }
  },
  data() {
    return {
      activePop: false,
      svg: "",
      current: {},
      toolTipInfo: ""
    };
  },

  mounted() {
    const self = this;
    // this.init(); 外面数据获取后促发data监听自然就可以初始化，注释掉这句可以少执行一次init
    this.$refs.tree.addEventListener(
      "click",
      function(e) {
        if (e.target.tagName === "svg") {
          self.hidePop();
        }
      },
      false
    );
    window.addEventListener("resize", this.listenResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.listenResize);
  },
  methods: {
    listenResize() {
      this.idiotUpdate(this.data);
    },
    getWidthHeight() {
      let { width, height } = getComputedStyle(this.$refs.tree);
      width = parseInt(width);
      height = parseInt(height);
      return {
        width,
        height
      };
    },
    init(dataSet = this.data) {
      console.log("init");
      const self = this;
      const { width, height } = this.getWidthHeight();
      const { margin } = this.options;

      var svg = d3
        .select("#tree")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(
          d3.zoom().on("zoom", function() {
            self.movePop(d3.event.transform);
            svg.attr("transform", d3.event.transform);
          })
        )
        .append("g");

      this.svg = svg;
      const g = svg.append("g");
      this.g = g;
      g.attr("transform", function() {
        if (currentNodeRecord.x) {
          return (
            "translate(" +
            (+width / 3 - currentNodeRecord.x) +
            "," +
            (+height / 3 - currentNodeRecord.y) +
            ")"
          );
        } else {
          return "translate(" + margin.left + "," + margin.top + ")";
        }
      });

      // console.log(d3);
      const tree = d3
        .tree()
        .separation(function(a, b) {
          return a.parent == b.parent ? 1 : 1;
        })

        .size([
          (width - margin.left - margin.right) * 1,
          (height - margin.top - margin.bottom) * 1
        ]);

      var root = d3.hierarchy(dataSet);
      this.root = root;
      this.tree = tree;

      const linkData = tree(root).links();

      this.drawNode(g, root);
      this.drawLink(g, linkData);
    },
    drawNode(g, root) {
      const self = this;
      const {
        radius,
        commonNodeBackgroundColor,
        healthNodeBackgroundColor
      } = this.options;
      const node = g
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")

        .attr("class", function(d) {
          return "node" + (d.children ? " node--internal" : " node--leaf");
        })
        .attr("style", function(d) {
          if (currentNodeRecord.id === d.data.id) {
            return "outline: solid 3px #458CE9";
          }
        });

      node
        .append("rect")
        .attr("width", "200")
        .attr("height", "48")
        .attr("x", "-4")
        .attr("y", "-24")
        .attr(
          "style",
          `cursor: pointer;
          fill:${commonNodeBackgroundColor};
          stroke-width:0;
          stroke:rgb(0,0,0)`
        )
        .attr("style", function(d) {
          let style = `
            cursor: pointer;
            stroke-width:0;
          `;
          if (d.data.type === "surplusNode") {
            style += `
              stroke: #fff;
              fill:${healthNodeBackgroundColor};
            `;
          } else {
            style += `
              fill:${commonNodeBackgroundColor};
              stroke:rgb(0,0,0)
            `;
          }
          return style;
        });

      node
        .append("image")
        .attr("width", "20")
        .attr("height", "20")
        .attr("xlink:href", function(d) {
          if (d.data.usedfor) {
            return require("@/assets/images/info.png");
          }
        })
        .attr("x", "5")
        .attr("y", "-10")
        .attr("style", `cursor: pointer;`)
        .on("mouseover", function(d) {
          self.showToolTip(d);
        })
        .on("mouseout", function() {
          self.hideToolTip();
        });

      node
        .append("circle")
        .attr("r", radius)
        .attr("stroke", "#97ca5e")
        .attr("fill", "#fff")
        .on("mouseover", function() {
          d3.select(this)
            .attr("fill", "orange")
            .attr("r", radius * 2);
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("fill", "#fff")
            .attr("r", radius);
        });

      const text = node
        .append("text")
        .attr("class", "text")
        .attr("style", "cursor: pointer");

      function excuteTextColor(d) {
        if (d.data.type === "surplusNode") {
          return "#2f2";
        } else {
          return "#777";
        }
      }
      text
        .append("tspan")
        .text(function(d) {
          return d.data.name;
        })
        .attr("y", -4)
        .attr("x", 35)
        .attr("text-anchor", "left")
        .attr("fill", excuteTextColor);

      text
        .append("tspan")
        .text(function(d) {
          if (d.data.beginsubnet) {
            return d.data.beginsubnet + "-" + d.data.endsubnet;
          }
        })
        .attr("y", 14)
        .attr("x", 35)
        .attr("text-anchor", "left")
        .attr("fill", excuteTextColor);

      node.attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

      node.on("click", function(node, number, element) {
        if (node.data.type === "surplusNode") {
          return;
        }
        self.onClick(d3.select(this), { node, number, element });
      });

      return node;
    },

    drawLink(g, linkData) {
      const link = g
        .selectAll(".link")
        .data(linkData)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#97ca5e");

      link.data(linkData).attr(
        "d",
        d3
          .linkHorizontal()
          .x(function(d) {
            return d.y;
          })
          .y(function(d) {
            return d.x;
          })
      );
    },
    idiotUpdate: _.debounce(function(newData) {
      const node = d3.selectAll("#tree svg");
      node.remove();
      this.init(newData);
    }, 600),
    update(newData) {
      // TODO: newData exit enter 思路
    },
    showPop({ x, y }) {
      const pop = this.$refs.pop;
      const { margin } = this.options;
      this.activePop = true;
      pop.style.left = y + margin.top - 8 + "px";
      pop.style.top = x + margin.left / 2 + 8 + "px";
    },
    hidePop() {
      this.activePop = false;
    },
    movePop({ k, x, y }) {
      const pop = this.$refs.pop;
      let left, top;
      if (this.initPopPosition) {
        left = this.initPopPosition.left;
        top = this.initPopPosition.top;
      } else {
        left = parseFloat(getComputedStyle(pop).left);
        top = parseFloat(getComputedStyle(pop).top);
        this.initPopPosition = { left, top };
      }
      pop.style.left = left + x + "px";
      pop.style.top = top + y + "px";
    },
    markActiveNode(selection) {
      d3.selectAll(".node").attr("style", "");
      selection.attr("style", "outline: solid 3px #458CE9");
    },
    showToolTip({ x, y, data }) {
      // const { width, height } = this.getWidthHeight();
      // const { margin } = this.options;
      const toolTip = this.$refs.toolTip;
      if (!!data.usedfor) {
        toolTip.style.display = "block";
        toolTip.style.right = 0 + "px";
        toolTip.style.top = 0 + "px";
        this.toolTipInfo = data.usedfor;
      }
    },
    hideToolTip() {
      const toolTip = this.$refs.toolTip;
      toolTip.style.display = "none";
    },
    setSvgPosition(node) {
      currentNodeRecord.x = node.y;
      currentNodeRecord.y = node.x;
      currentNodeRecord.id = node.data.id;
    },
    // 组件api
    onClick(selection, { node }) {
      this.current = {
        selection,
        node
      };
      this.setSvgPosition(node);
      this.showPop(node);
      this.markActiveNode(selection);
      this.$emit("onClickNode", node, selection);
    }
  },
  watch: {
    data: {
      deep: true,
      handler(value) {
        this.hidePop();
        this.idiotUpdate(value);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.tree {
  position: relative;
  cursor: move;
  .tree-pop {
    position: absolute;
    display: none;
    border: 1px solid #ddd;
  }
  .active {
    display: block;
  }

  .tree-node-active {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 1px solid #ddd;
  }
  .toolTip {
    display: none;
    position: absolute;
    font-size: 18px;
    line-height: 24px;
    max-width: 20em;
    color: #fff;
    background: #000;
    opacity: 0.6;
    padding: 10px 20px;
    border-radius: 4px;
  }
}
</style>
