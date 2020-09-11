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
        <template v-if="!data.prefix && !data.ipv4">
          <div
            @click="handleSelectTreeNode(data, node, collapsed ,nodeDataList )"
            :class="{activeNode:data.id ===active.id, activeDepth: active.siblingsId.includes(data.id)}"
            class="rich-node"
            :style="{ border: collapsed ? '2px solid grey' : '' }"
          >

            <h3 class="name">{{ data.name }}</h3>
            <p class="ipv6">{{data.prefix && (data.prefix.length > 15? `...${data.prefix.substr(-15)}` : data.prefix )}}</p>
            <div class="ipv4">
              <a
                href="javascript:;"
                class="btn-ipv4"
                @click.stop="(e) => handleClickIpv4(e, data, node, collapsed ,nodeDataList) "
              >+ ipv4</a>
            </div>
          </div>
        </template>
        <Tooltip
          placement="top"
          v-else
        >
          <div
            @click="handleSelectTreeNode(data, node, collapsed ,nodeDataList )"
            :class="{activeNode:data.id ===active.id, activeDepth: active.siblingsId.includes(data.id)}"
            class="rich-node"
            :style="{ border: collapsed ? '2px solid grey' : '' }"
          >

            <h3 class="name">{{ data.name }}</h3>
            <p class="ipv6">{{data.prefix && (data.prefix.length > 15? `...${data.prefix.substr(-15)}` : data.prefix )}}</p>
            <div class="ipv4">
              <a
                href="javascript:;"
                class="btn-ipv4"
                @click.stop="(e) => handleClickIpv4(e, data, node, collapsed ,nodeDataList) "
              >+ ipv4</a>
            </div>
          </div>
          <div slot="content">
            <p>{{data.prefix}}</p>
            <p style="white-space: normal;">{{data.ipv4&& data.ipv4.replace(/,/g, " ")}}</p>
          </div>
        </Tooltip>

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
import eventBus from "@/util/bus";

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

          // 是否需要计算 prefix，,手动规划情况，且规划到位的才设置prefix

          if (_.isBoolean(val.autofill) && !val.autofill) {
            executeTreeNodePrefix([tree]);
          }
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
      "setCurrentNodeIpv4",
      "setLayout"
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

      eventBus.$emit("onSelectNode", data, node)
    },
    handleClickIpv4(e, data) {
      this.visible = true;
      this.setCurrentNodeId(data.id);
      this.currentIpv4List = data.ipv4;
    },

    handleFinishIpv4Edit() {
      const ispass = this.currentIpv4List.split(",").every(item => {
        const isNetSegment = (item.split("/").length === 2);
        const [, len] = item.split("/");
        return ipv4IsValid(item.trim()) && isNetSegment && len < 32 && len > 0;
      });
      if (ispass) {
        this.visible = false;
        this.setCurrentNodeIpv4(this.currentIpv4List);
      } else {
        this.$Message.error("IP地址输入有误，请查证");
      }
    },

    handleAddressPlanFinish() {

      const layout = _.cloneDeep(this.currentLayout);


      // 手动规划的prefix 前端计算
      if (!layout.autofill) {
        let tree = layout.nodes[0];
        executeTreeNodePrefix([tree], false, "nodes");
      }
      let params;

      if (typeof layout.autofill === "undefined") {
        params = buildLayoutParams(layout, false, -1);
      } else {
        params = buildLayoutParams(layout, layout.autofill, -1);
      }

      // 控制下一个步骤可访问
      params.firstfinished = true;
      this.$put({ url: this.currentLayout.links.update, params }).then(() => {
        this.$get({ url: this.currentLayout.links.self }).then(data => {
          this.nextPlanStep();
          this.setLayout(data);

        });
      });

    }
  }
};
</script>

<style lang="less" scoped>
.PlanTree {
  flex: 1;
  overflow: hidden;

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