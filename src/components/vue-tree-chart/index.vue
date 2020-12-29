<template>
  <div
    class="tree-container"
    ref="container"
  >
    <svg
      class="svg vue-tree"
      ref="svg"
      :style="initialTransformStyle"
    />

    <div
      class="dom-container"
      ref="domContainer"
      :style="initialTransformStyle"
    >
      <transition-group
        name="tree-node-item"
        tag="div"
      >
        <div
          class="node-slot"
          v-for="(node, index) of nodeDataList"
          @click="onClickNode(index)"
          :key="node.data.id"
          :style="{
              left: formatDimension(
                direction === DIRECTION.VERTICAL ? node.x : node.y
              ),
              top: formatDimension(
                direction === DIRECTION.VERTICAL ? node.y : node.x
              ),
              width: formatDimension(config.nodeWidth),
              height: formatDimension(config.nodeHeight)
            }"
        >
          <slot
            name="node"
            v-bind:data="node.data"
            v-bind:collapsed="node.data._collapsed"
            v-bind:node="node"
            v-bind:nodeDataList="nodeDataList"
            v-bind:index="index"
          >
            <!-- 默认展示value字段 -->
            <span>{{ node.data.value }}</span>
          </slot>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

const MATCH_TRANSLATE_REGEX = /translate\(([^)]*)\)/i;
const MATCH_SCALE_REGEX = /scale\((\S*)\)/i;

const LinkStyle = {
  CURVE: "curve",
  STRAIGHT: "straight"
};

const DIRECTION = {
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal"
};

const DEFAULT_NODE_WIDTH = 100;
const DEFAULT_NODE_HEIGHT = 100;
const DEFAULT_LEVEL_HEIGHT = 200;

const ANIMATION_DURATION = 800;

function uuid() {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

function rotatePoint({ x, y }) {
  return {
    x: y,
    y: x
  };
}

export default {
  name: "vue-tree",
  props: {
    seat: {
      type: Number,
      default: 100
    },
    config: {
      type: Object,
      default: () => {
        return {
          nodeWidth: DEFAULT_NODE_WIDTH,
          nodeHeight: DEFAULT_NODE_HEIGHT,
          levelHeight: DEFAULT_LEVEL_HEIGHT  // 节点和节点的横向距离
        };
      }
    },
    linkStyle: {
      type: String,
      default: LinkStyle.CURVE
    },
    direction: {
      type: String,
      default: DIRECTION.VERTICAL
    },
    // 展示的层级数据, 样例数据如: hierachical.json
    dataset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      d3,
      colors: "568FE1",
      nodeDataList: [],
      linkDataList: [],
      initTransformX: 0,
      initTransformY: 0,
      DIRECTION,
      scaleNum: 1
    };
  },
  computed: {
    initialTransformStyle() {
      return {
        transform: `translate(${this.initTransformX}px, ${this.initTransformY}px) scale(${this.scaleNum})`
      };
    }
  },
  watch: {
    dataset() {
      this.scaleNum = 1;
      this.needResetScale = true;
      this.draw();
      this.autoScale();
      this.initTransform();

    },
    scaleNum() {
      this.$emit("on-render", {
        width: this.width,
        height: this.height,
        linksData: this.linksData,
        offsetX: this.offsetX,
        offsetY: this.offsetY,
        scaleNum: this.scaleNum || 1
      });
    }
  },
  created() {
    this.addUniqueKey(this.dataset);
  },
  mounted() {

    const container = this.$refs.container;
    container.addEventListener("mousewheel", (e) => {
      let scaleNum = event.wheelDelta / 1200 + this.scaleNum;

      if (scaleNum < 0.1) {
        scaleNum = 0.1;
      }

      if (scaleNum > 1) {
        scaleNum = 1;
      }
      this.setScale(scaleNum);
    }, false);
    this.init();
  },
  methods: {
    init() {
      this.draw();
      this.enableDrag();
      this.autoScale();
      this.initTransform();
    },
    zoomIn() {
      const originTransformStr = this.$refs.domContainer.style.transform;
      // 如果已有scale属性, 在原基础上修改
      let targetScale = 1 * 1.2;
      const scaleMatchResult = originTransformStr.match(MATCH_SCALE_REGEX);
      if (scaleMatchResult && scaleMatchResult.length > 0) {
        const originScale = parseFloat(scaleMatchResult[1]);
        targetScale *= originScale;
      }
      this.setScale(targetScale);
    },
    zoomOut() {
      const originTransformStr = this.$refs.domContainer.style.transform;
      // 如果已有scale属性, 在原基础上修改
      let targetScale = 1 / 1.2;
      const scaleMatchResult = originTransformStr.match(MATCH_SCALE_REGEX);
      if (scaleMatchResult && scaleMatchResult.length > 0) {
        const originScale = parseFloat(scaleMatchResult[1]);
        targetScale = originScale / 1.2;
      }
      this.setScale(targetScale);
    },
    restoreScale() {
      this.setScale(1);
    },
    setScale(scaleNum) {
      this.scaleNum = scaleNum;
    },
    isVertial() {
      return this.direction === DIRECTION.VERTICAL;
    },
    addUniqueKey(rootNode) {
      const queue = [rootNode];
      while (queue.length !== 0) {
        const node = queue.pop();
        node._key = uuid();
        if (node.children) {
          queue.push(...node.children);
        }
      }
      return rootNode;
    },
    autoScale() {
      const width = this.width || 0;
      const height = this.height || 0;

      const containerWidth = this.$refs.container.offsetWidth;
      const containerHeight = this.$refs.container.offsetHeight - this.seat;
      if (width / containerWidth > 1 || height / containerHeight > 1) {
        if (width / containerWidth > height / containerHeight) {
          // TODO
        } else {
          let scale = (containerHeight) / (height);
          this.scaleNum = scale;
          this.$nextTick().then(() => {
            this.setScale(scale);
          });
        }
      }
    },
    initTransform() {
      const width = this.width || 0;
      const height = this.height || 0;
      let scale = this.scaleNum;

      const containerWidth = this.$refs.container.offsetWidth;
      const containerHeight = this.$refs.container.offsetHeight - this.seat;


      const innerDomContainerHeight = this.$refs.domContainer.offsetHeight;


      if (width < containerWidth) {
        this.initTransformX = (containerWidth - (width) * scale) / 2;
      } else {
        this.initTransformX = (containerWidth - (width) * scale) / 2;
      }

      if (height < containerHeight) {
        this.initTransformY = (containerHeight) / 2;
      } else {
        let initTransformResult = 0;

        const offset = (this.minX + this.maxX) * scale;

        if (offset > 0) {
          // console.log("top big", offset)
          initTransformResult = (height * scale) / 2 - offset;
        } else {
          initTransformResult = (height * scale) / 2 + offset;
        }

        this.initTransformY = containerHeight / 2;
        // console.log("initTransformY", this.initTransformY)

        // console.log(this.minX, this.maxX, innerDomContainerHeight, innerDomContainerHeight * scale)

      }

      this.offsetX = this.initTransformX;
      this.offsetY = this.initTransformY;
    },
    /**
     * 根据link数据,生成svg path data
     */
    generateLinkPath(d) {
      const self = this;
      if (this.linkStyle === LinkStyle.CURVE) {
        const linkPath = this.isVertial()
          ? d3.linkVertical()
          : d3.linkHorizontal();
        linkPath
          .x(function (d) {
            return d.x;
          })
          .y(function (d) {
            return d.y;
          })
          .source(function (d) {
            const sourcePoint = {
              x: d.source.x,
              y: d.source.y
            };
            return self.direction === self.DIRECTION.VERTICAL
              ? sourcePoint
              : rotatePoint(sourcePoint);
          })
          .target(function (d) {
            const targetPoint = {
              x: d.target.x,
              y: d.target.y
            };
            return self.direction === self.DIRECTION.VERTICAL
              ? targetPoint
              : rotatePoint(targetPoint);
          });
        return linkPath(d);
      }
      if (this.linkStyle === LinkStyle.STRAIGHT) {
        // the link path is: source -> secondPoint -> thirdPoint -> target
        const linkPath = d3.path();
        let sourcePoint = { x: d.source.x, y: d.source.y };
        let targetPoint = { x: d.target.x, y: d.target.y };
        if (!this.isVertial()) {
          sourcePoint = rotatePoint(sourcePoint);
          targetPoint = rotatePoint(targetPoint);
        }
        const xOffset = targetPoint.x - sourcePoint.x;
        const yOffset = targetPoint.y - sourcePoint.y;
        const secondPoint = this.isVertial()
          ? { x: sourcePoint.x, y: sourcePoint.y + yOffset / 2 }
          : { x: sourcePoint.x + xOffset / 2, y: sourcePoint.y };
        const thirdPoint = this.isVertial()
          ? { x: targetPoint.x, y: sourcePoint.y + yOffset / 2 }
          : { x: sourcePoint.x + xOffset / 2, y: targetPoint.y };
        linkPath.moveTo(sourcePoint.x + 72, sourcePoint.y);  // change 连接点
        linkPath.lineTo(secondPoint.x, secondPoint.y);
        linkPath.lineTo(thirdPoint.x, thirdPoint.y);
        linkPath.lineTo(targetPoint.x - 72, targetPoint.y);
        return linkPath.toString();
      }
    },
    // 使用扇形数据开始绘图
    draw() {
      const [nodeDataList, linkDataList] = this.buildTree(this.dataset);
      this.releaseRenderData(nodeDataList, linkDataList);
      this.linkDataList = linkDataList;
      this.svg = this.d3.select(this.$refs.svg);

      const self = this;
      const links = this.svg.selectAll(".link").data(linkDataList, (d) => {
        return `${d.source._key}-${d.target._key}`;
      });

      links
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", function (d, i) {
          return self.generateLinkPath(d);
        });
      links
        .transition()
        .attr("d", function (d) {
          return self.generateLinkPath(d);
        });
      links
        .exit()
        .remove();

      this.nodeDataList = nodeDataList;


    },
    buildTree(rootNode) {
      const treeBuilder = this.d3
        .tree()
        .nodeSize([this.config.nodeWidth, this.config.levelHeight]);
      const tree = treeBuilder(this.d3.hierarchy(rootNode));
      return [tree.descendants(), tree.links()];
    },
    enableDrag() {
      const svgElement = this.$refs.svg;
      const container = this.$refs.container;
      let startX = 0;
      let startY = 0;
      let isDrag = false;
      // 保存鼠标点下时的位移
      let mouseDownTransform = "";
      container.onmousedown = (event) => {
        mouseDownTransform = svgElement.style.transform;
        startX = event.clientX;
        startY = event.clientY;
        isDrag = true;
      };
      container.onmousemove = (event) => {
        if (!isDrag) return;
        const originTransform = mouseDownTransform;
        let originOffsetX = 0;
        let originOffsetY = 0;
        if (originTransform) {
          const result = originTransform.match(MATCH_TRANSLATE_REGEX);
          if (result !== null && result.length !== 0) {
            const [offsetX, offsetY] = result[1]
              .split(",")
              .map(this.parseDimensionNumber);
            originOffsetX = offsetX;
            originOffsetY = offsetY;
          }
        }

        this.initTransformX = this.offsetX = event.clientX - startX + originOffsetX;  // 抛出渲染数据
        this.initTransformY = this.offsetY = event.clientY - startY + originOffsetY;

        this.$emit("on-render", {
          width: this.width,
          height: this.height,
          linksData: this.linksData,
          offsetX: this.offsetX,
          offsetY: this.offsetY,
          scaleNum: this.scaleNum || 1
        });


      };

      container.onmouseup = (event) => {
        startX = 0;
        startY = 0;
        isDrag = false;
      };
    },
    onClickNode(index) {
      this.draw();
    },
    formatDimension(dimension) {
      if (typeof dimension === "number") return `${dimension}px`;
      if (dimension.indexOf("px") !== -1) {
        return dimension;
      } else {
        return `${dimension}px`;
      }
    },
    parseDimensionNumber(dimension) {
      if (typeof dimension === "number") {
        return dimension;
      }
      return parseInt(dimension.replace("px", ""));
    },
    executeBoundary(nodeDataList) {
      let minX = 0, minY = 0, maxX = 0, maxY = 0;
      nodeDataList.forEach(item => {
        if (item.x < minX) {
          minX = item.x;
        }
        if (item.x > maxX) {
          maxX = item.x;
        }
        if (item.y < minY) {
          minY = item.y;
        }
        if (item.y > maxY) {
          maxY = item.y;
        }
      });

      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;

      return { minX, minY, maxX, maxY };
    },
    execurteWidthAndHeight({ minX, minY, maxX, maxY }) {
      return [maxX - minX, maxY - minY];
    },
    releaseRenderData(nodeDataList, linkDataList) {
      const [height, width] = this.execurteWidthAndHeight(this.executeBoundary(nodeDataList));
      this.linksData = linkDataList.map(item => {
        return this.generateLinkPath(item);
      });

      this.width = width;
      this.height = height;

      this.$emit("on-render", {
        nodeDataList,
        linkDataList,
        width: this.width,
        height: this.height,
        linksData: this.linksData,
        offsetX: this.offsetX,
        offsetY: this.offsetY,
        scaleNum: this.scaleNum || 1
      });


    }
  }
};
</script>

<style lang="less">
.tree-container {
  .node {
    fill: grey !important;
  }

  .link {
    stroke-width: 2px !important;
    fill: transparent !important;
    stroke: #dfdfdf !important;
  }
}
</style>

<style lang="less" scoped>
.tree-node-item-enter,
.tree-node-item-leave-to {
  transition-timing-function: ease-in-out;
  transition: transform 0.8s;
  opacity: 0;
}

.tree-node-item-enter-active,
.tree-node-item-leave-active {
  transition-timing-function: ease-in-out;
  transition: all 0.8s;
}

.tree-container {
  position: relative;
  overflow: hidden;

  .vue-tree {
    position: absolute;
    left: 0;
    top: 0;
  }

  > svg,
  .dom-container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
    transform-origin: 0 50%;
  }

  .dom-container {
    z-index: 1;
    // pointer-events: none;
  }
}

.node-slot {
  cursor: pointer;
  position: absolute;
  background-color: transparent;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
  transition: all 0.8s;
  transition-timing-function: ease-in-out;
}
</style>
