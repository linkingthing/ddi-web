<template>
  <div class="tree" ref="tree" id="tree">
    <div class="tree-pop" ref="pop">
      <slot name="pop" :props="current"></slot>
    </div>
    <div class="tree-node-active"></div>
  </div>
</template>

<script>
import * as d3 from "d3";

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
      svg: "",
      current: {}
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    handle() {
      console.log(this.root);
    },
    init(dataSet = this.data) {
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
            svg.attr("transform", d3.event.transform);
          })
        )
        .append("g");

      this.svg = svg;
      const g = svg.append("g");
      this.g = g;
      g.transition()
        .duration(0)
        .attr(
          "transform",
          "translate(" + margin.left + "," + margin.right + ")"
        );

      const tree = d3
        .tree()
        .size([
          width - margin.left - margin.right,
          height - margin.top - margin.bottom
        ]);
      var root = d3.hierarchy(dataSet);
      this.root = root;
      this.tree = tree;

      const linkData = tree(root).links();
      const node = this.node(g, root);

      const link = this.drawLink(g, linkData);

      this.horizontalTree(g, node, link, linkData);
    },
    node(g, root) {
      const self = this;
      const node = g
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", function(d) {
          return "node" + (d.children ? " node--internal" : " node--leaf");
        });

      node.append("circle").attr("r", 2.5);

      node
        .append("text")
        .text(function(d) {
          return d.data.name;
        })

        .attr("y", -10)
        .attr("x", -10)
        .attr("text-anchor", "middle");

      // node
      //   .append("text")
      //   .text(function() {
      //     return "22";
      //   })
      //   .attr("y", -20)
      //   .attr("x", -10)
      //   .attr("text-anchor", "middle");

      node.on("click", function(node, number, element) {
        self.onClick(d3.select(this), { node, number, element });
      });

      return node;
    },

    drawLink(g, treeRootLinks) {
      const link = g
        .selectAll(".link")
        .data(treeRootLinks)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("only-name-start", ({ source }) => {
          return source.data.name;
        })
        .attr("only-name-end", ({ target }) => {
          return target.data.name;
        })
        .attr(
          "d",
          d3
            .linkVertical()
            .x(function(d) {
              return d.x;
            })
            .y(function(d) {
              return d.y;
            })
        );
      return link;
    },

    horizontalTree(g, node, link, linkData) {
      link.data(linkData).attr(
        "d",
        d3
          .linkVertical()
          .x(function(d) {
            return d.x;
          })
          .y(function(d) {
            return d.y;
          })
      );

      node
     
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
    },
    appendNode(element, data) {
      element.append({
        name: "9527"
      });
    },
    idiotUpdate(newData) {
      const node = d3.selectAll("#tree svg");
      node.remove();
      this.init(newData);
    },
    update(newData) {
      //TODO: newData exit enter 思路
    },
    showPop({ x, y }) {
      const pop = this.$refs.pop;
      pop.style.display = "block";
      pop.style.left = y + "px";
      pop.style.top = x + "px";
    },
    hidePop() {
      const pop = this.$refs.pop;
      pop.style.display = "none";
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

      // data.data.children = null; // ok
      // this.removeNode(selection, node);
      // this.appendNode(element);
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
    },
    current: {
      deep: true,
      handler(cur) {
        // console.log(cur, "current");
        // console.log(this.data);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.tree {
  position: relative;
  .tree-pop {
    position: absolute;

    border: 1px solid #ddd;
  }

  .tree-node-active {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 1px solid #ddd;
  }
}
</style>