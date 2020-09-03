<template>
  <div class="PlanTree">
    <VueTree
      style="min-height: calc(100vh - 490px);"
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

    <div style="text-align:center;padding: 20px 0 0">
      <Button
        type="primary"
        @click="handleAddressPlanFinish"
      >地址段划分完成</Button>
    </div>

    <common-modal
      :visible.sync="visible"
      title="编辑节点IPv4"
      :width="413"
      @confirm="handleFinishIpv4Edit"
    >
      <Form
        style="margin-bottom: -30px"
        :label-width="60"
        label-position="left"
      >
        <FormItem label="Ipv4">
          <Input
            v-model="currentIpv4List"
            style="width: 260px"
            type="textarea"
            :autosize="{minRows: 4,maxRows: 5}"
            placeholder="请输入IPv4地址，逗号分隔"
          />
        </FormItem>
      </Form>
    </common-modal>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapGetters } from "vuex";
import VueTree from "@/components/vue-tree-chart";

import { buildLayoutParams, executeTreeNodePrefix } from "./helper";
import { v4 as uuidv4 } from "uuid";

import { ipv4IsValid } from "@/util/common";

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
      },


      visible: false,
      currentIpv4List: ""


    };
  },
  computed: {
    ...mapGetters([
      "currentNode",
      "currentLayout"
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

        if (Array.isArray(newTree.children) && newTree.children.length) {
          let tree = newTree.children[0];
          tree.prefix = newTree.prefix;

          // 是否需要计算 prefix，自动规划的需要，手动规划的看情况
          // executeTreeNodePrefix([tree]);
          this.treeData = tree;
        }
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "nextPlanStep",
      "setCurrentNodeId",
      "setCurrentNodeIpv4"
    ]),
    handleSelectTreeNode(data, node, collapsed, nodeDataList) {
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
    handleClickIpv4(e, data) {
      this.visible = true;
      this.setCurrentNodeId(data.id);
      this.currentIpv4List = data.ipv4;
    },

    handleFinishIpv4Edit() {
      const ispass = this.currentIpv4List.split(",").every(item => {
        return ipv4IsValid(item.trim());
      });
      if (ispass) {
        this.visible = false;
        this.setCurrentNodeIpv4(this.currentIpv4List);
      } else {
        this.$Message.error("IP地址输入有误，请查证");
      }
    },

    handleAddressPlanFinish() {
      const params = buildLayoutParams(this.currentLayout, false);
      this.$put({ url: this.currentLayout.links.update, params }).then(() => {
        this.$get({ url: this.currentLayout.links.self }).then(res => {
          // 更新当前数据和状态
          this.nextPlanStep();
        });
      });

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