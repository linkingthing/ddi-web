<template>
  <div class="tree" ref="tree" id="tree">
    <div class="tree-pop" ref="pop" :class="{active: activePop}">
      <slot name="pop" :props="current"></slot>
    </div>
    <div class="tree-node-active"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import _ from "lodash";
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
          }
        };
      }
    }
  },
  data() {
    return {
      activePop: false,
      svg: "",
      current: {}
    };
  },

  mounted() {
    const self = this;
    this.init();
    this.$refs.tree.addEventListener(
      "click",
      function(e) {
        if (e.target.tagName === "svg") {
          self.hidePop();
        }
      },
      false
    );
  },
  methods: {
    handle() {
      console.log(this.root);
    },
    init(dataSet = this.data) {
      const self = this;
      let { width, height } = window.getComputedStyle(this.$refs.tree);
      width = parseInt(width);
      height = parseInt(height);

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
      g.attr(
        "transform",
        "translate(" + margin.left + "," + margin.right + ")"
      );
      // console.log(d3);
      const tree = d3
        .tree()
        .separation(function(a, b) {
          // retu (a.parent == b.parent ? 1 : 2) / a.depth
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
      const { radius } = this.options;
      const node = g
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("style", "cursor: pointer")
        .attr("class", function(d) {
          return "node" + (d.children ? " node--internal" : " node--leaf");
        });
      // node
      //   .append("rect")
      //   .attr("width", 30)
      //   .attr("height", 30)
      //   .attr("stroke", 30)
      // .attr("fill", '#f80');

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
        .attr("style", "cursor: pointer")
        .append("tspan")
        .text(function(d) {
          return d.data.name;
        })

        .attr("y", -4)
        .attr("x", 20)
        .attr("text-anchor", "left");

      text
        .append("tspan")
        .text(function(d) {
          return d.data.subnet;
        })
        .attr("y", 14)
        .attr("x", 20)
        .attr("text-anchor", "left");

      node.attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

      node.on("click", function(node, number, element) {
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

    appendNode(element, data) {
      element.append({
        name: "9527"
      });
    },
    idiotUpdate: _.debounce(function(newData) {
      const node = d3.selectAll("#tree svg");
      node.remove();
      this.init(newData);
    }, 600),
    update(newData) {
      //TODO: newData exit enter 思路
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
        left = parseFloat(window.getComputedStyle(pop).left);
        top = parseFloat(getComputedStyle(pop).top);
        this.initPopPosition = { left, top };
      }
      pop.style.left = left + x + "px";
      pop.style.top = top + y + "px";
    },
    markActiveNode(selection) {
      d3.selectAll(".node").attr("style", "");
      selection.attr("style", "outline: solid 3px blue");
    },
    // 组件api
    onClick(selection, { node }) {
      this.current = {
        selection,
        node
      };
      this.showPop(node);
      this.markActiveNode(selection);
      this.$emit("onClickNode", selection, node);
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
}
</style>
