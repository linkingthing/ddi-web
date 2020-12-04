<template>
  <div class="PlanTree">
    <div class="map-tool">
      <span
        class="map-tool-icon"
        style="border-radius: 4px 4px 0 0;border-bottom: 1px solid rgba(255,255,255,.3)"
        @click="handlePlus"
      >
        <img
          src="./map-add.png"
          alt=""
        >
      </span>
      <span
        class="map-tool-icon"
        style="border-radius: 0 0 4px 4px ;"
        @click="handleReduce"
      >
        <img
          src="./map-reduce.png"
          alt=""
        >
      </span>
      <span
        class="map-tool-icon"
        style="border-radius:  4px;background: #47CFE7;margin-top: 12px"
        @click="handleSavePicture"
      >
        <img
          src="./map-export.png"
          alt=""
        >
      </span>
    </div>
    <VueTree
      style="min-height: calc(100vh - 100px);"
      :dataset="treeData"
      :config="config"
      direction="horizontal"
      link-style="straight"
      ref="mapTreeRef"
      @on-render="handleRenderData"
    >
      <template v-slot:node="{ data, node, collapsed ,nodeDataList, index}">
        <div
          @click="handleSelectTreeNode(data, node, collapsed ,nodeDataList )"
          :class="{activeNode:data.id ===active.id, activeDepth: active.siblingsId.includes(data.id)}"
          class="rich-node"
          :style="{ border: collapsed ? '2px solid grey' : '' }"
        >

          <h3 class="name">{{ data.name }}</h3>
          <div v-if="Array.isArray(data.planchildren)">
            <p
              class="s-ipv6"
              :key="ipv6"
              v-for="ipv6 in data.planchildren.map(item => item.prefix)"
            >{{ ipv6 }}</p>
          </div>

          <div v-if="Array.isArray(data.ipv4s)">
            <p
              class="s-ipv6"
              :key="ipv4s"
              v-for="ipv4s in data.ipv4s"
            >{{ ipv4s }}</p>
          </div>

          <span
            v-if="data.children || data._children"
            @click="handleToggleChildren(index, nodeDataList)"
            class="rich-node-icon "
            :class="data.children ? 'rich-node-add': 'rich-node-reduce'"
          ></span>
        </div>

      </template>
    </VueTree>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapGetters } from "vuex";
import VueTree from "@/components/vue-tree-chart";

import { buildLayoutParams, executeTreeNodePrefix } from "./helper";
import { v4 as uuidv4 } from "uuid";

import { ipv4IsValid, isIpv4Segment } from "@/util/common";
import html2canvas from "html2canvas";


export default {
  components: {
    VueTree
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      treeData: {
        name: "g",
        children: [{
          name: "123"
        }, {
          name: "123"
        }, {
          name: "123"
        }]
      },
      config: {
        nodeWidth: 148,
        nodeHeight: 68,
        levelHeight: 200
      },

      active: {
        siblingsId: []
      },


      visible: false,
      currentIpv4List: ""


    };
  },
  computed: {

  },
  watch: {
    data: {
      deep: true,
      handler([val]) {
        let newTree = JSON.stringify(val);
        newTree = newTree.replace(/nodes/g, "children");
        newTree = JSON.parse(newTree);
        this.treeData = newTree;
      }
    },
    // "currentLayout": {
    //   deep: true,
    //   // immediate: true,
    //   handler(val) {
    //     let newTree = JSON.stringify(val);
    //     newTree = newTree.replace(/nodes/g, "children");
    //     newTree = JSON.parse(newTree);

    //     if (Array.isArray(newTree.children) && newTree.children.length) {
    //       let tree = newTree.children[0];
    //       tree.prefix = newTree.prefix;

    //       // 是否需要计算 prefix，,手动规划情况，且规划到位的才设置prefix

    //       if (_.isBoolean(val.autofill) && !val.autofill) {
    //         executeTreeNodePrefix([tree]);
    //       }
    //       // this.treeData = tree;
    //     }
    //   }
    // }
  },
  created() { },
  mounted() { },
  methods: {

    handleSelectTreeNode(data, node, collapsed, nodeDataList) {
      console.log(data)
    },
    handleToggleChildren(index, nodeDataList) {
      const curNode = nodeDataList[index];
      if (curNode.data.children) {
        curNode.data._children = curNode.data.children;
        curNode.data.children = null;
        curNode.data._collapsed = true;
      } else {
        curNode.data.children = curNode.data._children;
        curNode.data._children = null;
        curNode.data._collapsed = false;
      }
    },

    handlePlus() {
      this.$refs.mapTreeRef.zoomIn();
    },
    handleReduce() {
      this.$refs.mapTreeRef.zoomOut();
    },

    handleRenderData(data) {
      console.log(data, 666)
      this.renderData = data;
    },
    handleSavePicture() {
      const mapRef = this.$refs.mapTreeRef.$refs.container;

      const { width, height, linksData, offsetX, offsetY, scaleNum } = this.renderData;
      console.dir(mapRef)

      window.pageYoffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      html2canvas(mapRef, {
        width: (width + 200) * scaleNum,
        height: (height + 200) * scaleNum,
        scale: 1 / scaleNum,
        x: -offsetX * (scaleNum / 2),
        y: -offsetY * (scaleNum / 2)
      }).then(function (canvas) {
        document.body.appendChild(canvas);
        console.dir(canvas)
        // console.log(canvas.transferControlToOffscreen())
        const a = document.createElement("a");
        a.download = "map.png";
        a.href = canvas.toDataURL("image/png");
        a.click();
      });
      // const serializer = new XMLSerializer();
      //       console.dir( serializer.serializeToString(mapRef))

      // const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(mapRef);
      // const image = new Image;
      // image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      // const canvas = document.createElement("canvas");
      // [canvas.width, canvas.height] = [1200, 2000];

      // const context = canvas.getContext("2d");
      // context.fillStyle = "#fff"; // #fff设置保存后的PNG 是白色的  
      // context.fillRect(0, 0, 10000, 10000);
      // image.onload = function () {
      //   context.drawImage(image, 0, 0);
      //   const a = document.createElement("a");
      //   a.download = "map.png";
      //   a.href = canvas.toDataURL("image/png");
      //   a.click();
      // };


    }

  }
};
</script>

<style lang="less" scoped>
.PlanTree {
  flex: 1;
  overflow: hidden;

  .map-tool {
    position: fixed;
    right: 20px;
    z-index: 200;
    .map-tool-icon {
      display: block;
      background: #4586fe;
      width: 24px;
      height: 24px;
      padding: 5px;
      cursor: pointer;
      img {
        display: block;
      }
    }
  }

  // background-image: linear-gradient(to right, transparent 10px, #f5f5f5 10px),
  //   linear-gradient(to left, transparent 10px, #f5f5f5 10px),
  //   linear-gradient(to top, transparent 10px, #f5f5f5 10px),
  //   linear-gradient(to bottom, transparent 10px, #f5f5f5 10px);
  // background-size: 10.5px 10.5px;

  .rich-node {
    position: relative;
    display: flex;
    justify-content: center;
    // align-items: center;
    flex-direction: column;
    padding: 4px 8px;

    width: 148px;
    text-align: left;
    // background: #DFDFDF;
    border: 1px solid #dfdfdf;
    border-radius: 8px;

    .name {
      font-size: 14px;
      font-weight: normal;
      color: #333;
    }
    .s-ipv6 {
      font-size: 12px;
    }
    .ipv4 {
    }

    .rich-node-icon {
      position: absolute;
      right: -31px;
      width: 11px;
      height: 11px;
    }
    .rich-node-add {
      background: url(./add.png);
    }
    .rich-node-reduce {
      background: url(./reduce.png);
      right: -13px;
    }
  }

  .activeNode {
    // background: #4bc02f;
  }
  .activeDepth {
    background: #a7d0f3;
  }
}
</style>