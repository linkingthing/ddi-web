<template>
  <div class="PlanTree">
    <VueTree
      style="min-height: 580px;"
      :dataset="treeData"
      :config="config"
      direction="horizontal"
      link-style="straight"
    >
      <template v-slot:node="{ data, node, collapsed ,nodeDataList}">
        <div
          @click="handleSelectTreeNode(data, node, collapsed ,nodeDataList )"
          :class="{activeNode:data.id ===active.id, activeDepth: active.siblingsId.includes(data.id)}"
          class="rich-node"
          :style="{ border: collapsed ? '2px solid grey' : '' }"
        >

          <h3 class="name">{{ data.name }}</h3>
          <p class="ipv6">{{data.prefix}}</p>
          <div class="ipv4">
            <a
              href="javascript:;"
              class="btn-ipv4"
              @click.stop="(e) => handleClickIpv4(e, data, node, collapsed ,nodeDataList) "
            >+ ipv4</a>
          </div>
        </div>
      </template>
    </VueTree>

    <div style="text-align:center;padding: 20px">
      <Button
        type="primary"
        @click="handleAddressPlanFinish"
      >地址段划分完成</Button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapGetters } from "vuex";
import VueTree from "@/components/vue-tree-chart";

import { treeFlat, treeEach, findNodeById, executeNextIpv6Segment } from "./helper";

export default {
  components: {
    VueTree
  },
  props: {},
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
      }



    };
  },
  computed: {
    ...mapState({
      "currentLayout": state => state.layout.currentLayout
    },

    ),
    ...mapGetters([
      "currentNode"
    ])
  },
  watch: {
    "currentLayout": {
      deep: true,
      immediate: true,
      handler(val) {
        let newTree = JSON.stringify(val);
        newTree = newTree.replace(/nodes/g, "children");
        newTree = JSON.parse(newTree);

        newTree = treeEach(newTree, "children", (item, index) => {
          delete item.creationTimestamp;
          delete item.deletionTimestamp;
          delete item.expand;
          delete item.links;
          delete item.type;

          if (item.pid) {
            const parentNode = findNodeById(newTree, item.pid); // 这个函数的内部children会不会受影响？
            const parentNodePrefix = parentNode.prefix;
            console.log(item)
            const offset = item.value || (index + 1);
            item.prefix = executeNextIpv6Segment(parentNodePrefix, offset, item.bitWidth); // 位偏移，自定义需要调整
          }

        });

        this.treeData = newTree;
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "nextPlanStep",
      "setCurrentNodeId"
    ]),
    handleSelectTreeNode(data, node, collapsed, nodeDataList) {
      console.log(data, node, collapsed, nodeDataList)
      this.setCurrentNodeId(data.id);

      let siblingsId = [];
      if (node.parent) {
        siblingsId = node.parent.data.children.map(item => item.id);
      }

      this.active = {
        id: data.id,
        siblingsId
      };
    },
    handleClickIpv4(e) {
      console.log(e)
    },
    handleAddressPlanFinish() {
      // this.nextPlanStep();
      console.log(this.currentLayout)
      const { update, create } = this.currentLayout.links;

      const params = _.cloneDeep(this.currentLayout);


      const nodes = treeFlat(params)

      nodes.unshift({
        bitWidth: 0,
        id: params.id,
        ipv4: "",
        modified: 1,
        name: "",
        pid: "0",
        value: 0
      });

      delete params.creationTimestamp;
      delete params.deletionTimestamp;
      delete params.expand;
      delete params.links;
      delete params.type;
      delete params.bitWidth;
      delete params.prefix;
      delete params.id;


      params.nodes = nodes;
      if (create) {
        this.$post({ url: create, params }).then(() => {
          console.log()
        })
      } else {
        this.$put({ url: update, params }).then(() => {
          console.log()
        })
      }


    }
  }
};
</script>

<style lang="less" scoped>
.PlanTree {
  flex: 1;

  .rich-node {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    width: 148px;
    // height: 68px;
    text-align: center;
    background: #ededed;
    border-radius: 4px;

    .name {
      font-size: 14px;
      font-weight: normal;
      color: #333;
    }
    .ipv6 {
    }
    .ipv4 {
    }
    .btn-ipv4 {
      display: block;
      width: 50px;
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      color: #9a9a9a;
      background: #d8d8d8;
      border-radius: 3px;
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