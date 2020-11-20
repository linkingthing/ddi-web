<template>
  <div class="SemanticContent">
    <div class="SemanticContent-inner">

      <div class="SemanticContent-header">
        <h1 :title="currentNodeName">{{currentNodeName}}</h1>
        <div>
          <label for="">前缀：</label>
          <span :title="currentNodePrefix.join(',')">{{ currentNodePrefix.join(",")}}</span>
        </div>

      </div>
      <section>
        <div class="step-bar">
          <div class="step-bar-inner">
            <span class="step-bar-index">1</span>
            <h3 class="step-bar-name">地址位宽设定</h3>
          </div>
          <img
            class="step-bar-tip"
            src="./question.png"
          >
        </div>
        <div class="SemanticContent-action">
          <div class="action-input-item">
            <label class="label">地址位宽：</label>
            <div class="action-box">

              <Input
                class="action-box-input"
                v-model="bitWidth"
                placeholder="请输入地址位宽"
                :disabled="settableNextBitWidth"
              />

              <Tooltip
                placement="bottom"
                theme="light"
                max-width="700"
                style="white-space:none"
                class="detail-tooltip"
              >
                <Icon
                  custom="icon-detail"
                  class="action-box-icon"
                />

                <div
                  slot="content"
                  style="padding: 10px 12px;width: 660px"
                >
                  <div style="font-size: 14px;color:#333;margin-bottom: 10px">占位详情</div>
                  <Table
                    :columns="columnsDetail"
                    :data="dataDetail"
                  />
                </div>
              </Tooltip>

              <Button
                type="primary"
                style="margin-left: 20px"
                :disabled="settableNextBitWidth"
                @click="handleSetNextBitWidth"
              >确定</Button>
            </div>

          </div>

          <div>
            <SegmentAxis
              style="width: 700px;"
              :enable-prefix-len="+prefixLen"
              :prefix-len="Number(currentNodePrefixLen)"
              :bit-width="Number(currentNodeBitWidth)"
            />
          </div>

        </div>
      </section>

      <section>

        <div class="step-bar">
          <div class="step-bar-inner">
            <span class="step-bar-index">2</span>
            <h3 class="step-bar-name">语义节点规划</h3>
          </div>
          <img
            class="step-bar-tip"
            src="./question.png"
          >
        </div>

      </section>

      <div class="SemanticContent-action">

        <div class="action-input-item">
          <label class="label">语义节点数：</label>
          <div class="action-box">
            <Input
              class="action-box-input"
              v-model="nodeCount"
              placeholder="请输入语义节点数"
              search
              enter-button="+1"
              @on-search="handleAddOne"
              :disabled="settableSemanticNodeCount"
            />
          </div>
        </div>

        <div class="action-input-item">
          <label class="label">地址步长：</label>
          <div class="action-box">
            <Input
              class="action-box-input"
              v-model="stepsize"
              placeholder="请输入地址步长"
              :disabled="settableStepSize"
            />
          </div>
        </div>
        <div class="action-input-item">
          <Button
            type="primary"
            @click="handleClickCreateSemanticNode"
            :disabled="settableCreateSemanticNode"
          >确定</Button>
        </div>

        <div class="action-input-item">
          <label class="label">剩余地址块:</label>
          <span
            class="action-box-input"
            style="padding: 3px 0;"
          >
            {{surplus}}
          </span>
        </div>
      </div>

      <div class="modal">

        <common-modal
          :visible.sync="customPlanVisible"
          title="自定义规划"
          :width="413"
          @confirm="handleCustomPlan('customPlan')"
        >
          <Form
            :label-width="100"
            ref="customPlan"
            :model="customPlan"
          >
            <FormItem
              label="选择IP前缀"
              prop="choosePrefix"
              :rules="{required: true, message: '请选择IP前缀'}"
            >
              <Select v-model="customPlan.choosePrefix">
                <Option
                  v-for="item in currentNodePrefix"
                  :value="item"
                  :key="item"
                >{{ item }}</Option>

              </Select>
            </FormItem>
          </Form>
        </common-modal>

        <common-modal
          :visible.sync="nodeEditVisible"
          title="节点编辑"
          :width="413"
          @confirm="handleSaveChildNode"
        >
          <Form
            :model="currentNodeofChooseChild"
            :label-width="80"
            :rules="currentNodeofChooseChildRule"
            ref="currentNodeofChooseChildRef"
          >

            <FormItem
              prop="prefixMap"
              :label-width="0"
            >
              <table class="o-table">
                <colgroup>
                  <col style="width: 200px">
                  <col>
                </colgroup>
                <tr
                  v-for="item in currentNodeofChooseChild.prefixMap"
                  :key="item.id"
                >
                  <td>
                    {{item.prefix}}
                  </td>
                  <td>
                    <Input
                      v-model.trim="item.count"
                      @on-change="handleCountChange(item)"
                    >
                    <span
                      class="btn-count"
                      slot="prepend"
                      @click="handleSubtractionCount(item)"
                    >-</span>
                    <span
                      slot="append"
                      class="btn-count"
                      @click="handlePlusCount(item)"
                    >+</span>
                    </Input>
                  </td>
                </tr>
              </table>
            </FormItem>
          </Form>
        </common-modal>

      </div>

      <section v-if="semanticNodeList.length">

        <div class="SemanticContent-table">
          <div class="SemanticContent-table-operate">
            <div>
              <Button
                type="primary"
                @click="handleOneKeyPlan"
                :disabled="availableOneKeyPlan"
              >一键规划</Button>
              <Button
                type="primary"
                ghost
                @click="handleOpenCustomPlan"
                :disabled="availableCustomPlan"
              >自定义规划</Button>

              <Button
                type="warning"
                @click="handleClearPlan"
                :disabled="availableClearPlan"
              >清空规划</Button>
            </div>
            <div class="action-input-item-right">
              <Input
                placeholder="请输入名称关键字"
                v-model="search"
              />
              <Button
                type="primary"
                @click="handleFilter"
              >搜索</Button>
              <Button
                class="reset"
                @click="handleResetSearch"
              >重置</Button>

            </div>
          </div>

          <Table
            ref="selection"
            style="border: 1px solid #E6E6E6;border-bottom: none"
            :columns="columns"
            :data="filterCurrentNodeChildren"
            @on-selection-change="handleSelectSemanticList"
          />

        </div>
        <div class="SemanticContent-opera">
          <Button
            type="primary"
            size="large"
            style="width: 300px;"
            @click="handleSave"
          >保存</Button>
        </div>
      </section>

    </div>
  </div>
</template>

<script>
// 经历过一个需求 迭代四版的人，使用一个文件写完所有功能必须被理解，不需要解释
// 别提复用，ui各种变，操作交随时变，提交的数据格式也在变
import SegmentAxis from "@/components/SegmentAxis";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { debounce, cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { ipv4IsValid, isIpv4Segment } from "@/util/common";
import {
  parserValueStr2Arr,
  executeNextIpv6Segment,
  planSemanticNodesValue,
  hasGrandson,
  createPlanNode,
  executeValueRecyclePool,
  modifiedEnum
} from "./helper";

let nodeIndex = 1;
export default {
  components: {
    SegmentAxis
  },
  props: {},
  data() {


    return {

      currentNodePrefix: [],

      prefixLen: 64,
      currentNodePrefixLen: 0,
      currentNodeBitWidth: 0,

      bitWidth: "",
      stepsize: "",
      detailVisible: false,
      columnsDetail: [
        {
          title: "前缀",
          key: "prefix"
        },
        {
          title: "地址块数量",
          key: "count"
        },
        {
          title: "可规划地址",
          key: "name"
        }
      ],
      nodeCount: 0,

      customPlanVisible: false,
      customPlan: {
        choosePrefix: ""
      },

      selectSemanticList: [], // 自定义规划时

      nodeEditVisible: false,
      semanticNodeList: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          type: "index",
          width: 80,
          align: "center"
        },
        {
          title: "语义名称",
          key: "name",
          width: 200,
          render: (h, { row }) => {
            return h("line-edit",
              {
                on: {
                  "on-edit-finish": val => {
                    this.handleSaveSemanticName(row, val);
                  }
                },
                props: {
                  isPercent: false,
                  value: row.name
                }
              }

            );
          }
        },

        {
          title: "地址个数",
          key: "addressCount",
          width: 150

        },
        {
          title: "IPv6地址",
          key: "showprefixs",
          tooltip: true,
          maxWidth: 300,
        },
        {
          title: "IPv4子网",
          key: "ipv4s",
          maxWidth: 300,
          render: (h, { row }) => {
            const content = (row.ipv4s && row.ipv4s.length) ? `[\n  ${row.ipv4s.join(",\n  ")}\n]` : "__";


            return h("Tooltip", {
              class: {
                "ipToolTip": true
              },
              props: {
                placement: "bottom",
                content
              }
            }, [h("line-edit", {
              on: {
                "on-edit-finish": val => {
                  this.handleSaveIpv4s(row, val);
                }
              },
              props: {
                isPercent: false,
                value: row.ipv4s,
                width: "100%"
              }
            })]
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 210,
          render: (h, { row }) => {
            return h("div", [
              h("btn-line", {
                props: {
                  title: "分发"
                }
              }),
              h("btn-edit", {
                on: {
                  click: () => this.handleOpenEditNode(row)
                }
              }),
              h("btn-del", {
                on: {
                  click: () => this.handleDeleteSemantic(row)
                }
              })
            ]);
          }

        }
      ],

      search: "",
      filterKeyword: "",

      currentNodeofChooseChild: {

      },
      currentNodeofChooseChildRule: {


      },
      prefixMap: [], // 看似无用，但别乱删

    };
  },
  computed: {
    ...mapGetters([
      "planName",
      "prefixs",
      "nodes",
      "tree",
      "currentNode",
      "currentNodeChildren",
      "allPlanNodes"
    ]),
    currentNodeName() {
      return this.currentNode && this.currentNode.name;
    },
    settableNextBitWidth() {
      // 位宽是否可修改
      const currentNodeId = this.currentNode && this.currentNode.id;
      return hasGrandson(this.nodes, currentNodeId);
    },

    bitWidthValid() {
      const bitWidth = Number(this.bitWidth);
      return !Number.isNaN(bitWidth) && bitWidth;
    },

    settableSemanticNodeCount() {
      return !this.bitWidthValid;
    },
    settableStepSize() {
      return !this.bitWidthValid;
    },

    settableCreateSemanticNode() {
      return !this.bitWidthValid;
    },

    currentTargetNodeAutoCreate() {
      // 目标节点，也就是当前语义节点节点的子节点，也就是将去设置的节点以及兄弟节点 autoCreate
      const currentNodeChildren = this.semanticNodeList;
      if (currentNodeChildren.length) {
        const { autocreate } = currentNodeChildren[0];
        return autocreate;
      }
      return void 0;
    },
    availableOneKeyPlan() {
      const autocreate = this.currentTargetNodeAutoCreate === true || this.currentTargetNodeAutoCreate === undefined;

      return !autocreate;
    },
    availableCustomPlan() {
      const autocreate = this.currentTargetNodeAutoCreate === false || this.currentTargetNodeAutoCreate === undefined;

      return !autocreate;
    },
    availableClearPlan() {
      const currentNodeId = this.currentNode && this.currentNode.id;

      return hasGrandson(this.nodes, currentNodeId);
    },
    surplus() {
      // 剩余地址数
      let result = "_ _";
      if (this.currentNode && this.currentNode.prefixs && this.currentNode.prefixs.length) {
        const { nextBitWidth, plannodes } = this.currentNode;
        if (!nextBitWidth) {
          return result;
        }
        const currentNodeChildren = this.nodes.filter(item => item.parentsemanticid === this.currentNode.id);

        const childrenLen =
          currentNodeChildren
            .map(({ plannodes }) =>
              Array.isArray(plannodes) ? plannodes.length : 0)
            .reduce((prev, result) => {
              return result + prev;
            }, 0);

        result = this.currentNode.prefixs.length * (2 ** nextBitWidth - 2) - childrenLen;
      }
      return result;
    },
    dataDetail() {
      const prefix = this.currentNodePrefix;
      const nextBitWidth = this.currentNode ? this.currentNode.nextBitWidth : 0;
      const count = 2 ** Number(nextBitWidth) - 1 || 0;

      return prefix.map(item => {
        const minAblePlan = executeNextIpv6Segment(item, 1, nextBitWidth);
        const maxAblePlan = executeNextIpv6Segment(item, count, nextBitWidth);
        return {
          prefix: item,
          count,
          name: `${minAblePlan}~${maxAblePlan}`
        };
      });
    },
    filterCurrentNodeChildren() {
      const currentNodeChildren = cloneDeep(this.semanticNodeList);
      return currentNodeChildren.filter(item => item.name.includes(this.filterKeyword.trim())).map(item => {
        // console.log(item)
        return {
          ...item,
          showprefixs: (Array.isArray(item.prefixs) && item.prefixs.length) ? `[\n  ${item.prefixs.join(",\n  ")}\n]` : "__"
        };
      });
    }
  },
  watch: {
    currentNode: {
      deep: true,
      handler(val) {
        console.log(val, "currentNode")
        console.log("nodes", this.nodes)
        // console.log("currentNodeChildren", this.currentNodeChildren)

        if (!val) {
          return;
        }

        this.nodeCount = this.currentNodeChildren.length;

        if (val.prefixs && Array.isArray(val.prefixs) && val.prefixs.length) {
          this.currentNodePrefix = val.prefixs;
          const [, len] = val.prefixs[0].split("/");
          this.currentNodePrefixLen = len;
        } else {
          this.currentNodePrefix = [];
          this.currentNodePrefixLen = 0;
        }

        if (val.nextBitWidth) {
          this.currentNodeBitWidth = val.nextBitWidth;
        } else {
          this.currentNodeBitWidth = 0;
        }

        if ((typeof val.nextBitWidth === "number")) {
          this.bitWidth = val.nextBitWidth;
        } else {
          this.bitWidth = 0;
        }

        // stepsize
        if ((typeof val.stepsize === "number") && (this.stepsize !== val.stepsize)) {
          this.stepsize = val.stepsize;
        }

      }
    },

    currentNodeChildren: {
      deep: true,
      immediate: true,
      handler(val) {
        this.semanticNodeList = cloneDeep(val);  // 为了避免 nodeCount 先改大再改小
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "saveNode",
      "saveNodes",
      "addNodes",
      "removeNodeById"
    ]),
    ...mapActions([
      "getCurrentPlanInfo"
    ]),

    handleSetNextBitWidth() {
      const bitWidth = Number(this.bitWidth);
      if (Number.isNaN(bitWidth)) {
        this.$Message.info("请输入数字");
        return;
      }

      if (bitWidth <= 0) {
        this.$Message.info("请输入正整数");
        return;
      }

      console.log(this.currentNodePrefix)
      const [prefix] = this.currentNodePrefix;
      const [, len] = prefix.split("/");
      const maxBitwidth = 64 - len; // 根据剩余

      if (bitWidth > maxBitwidth) {
        this.$Message.info(`当前层级位宽不能超过 ${maxBitwidth}`);
        return;
      }

      this.changeCurrentNode("nextBitWidth", bitWidth);
      this.$Message.success("位宽设置成功");

      // 需要标识？后者自身就是标识

    },
    changeCurrentNode(attr, val) {
      // 设置当前节点的属性
      const currentNode = cloneDeep(this.currentNode);
      if (currentNode) {
        currentNode[attr] = val;
        this.saveNode(currentNode);
      }
    },
    handleToggleDetail() {
      this.detailVisible = !this.detailVisible;
    },
    handleAddOne() {
      // TODO: 考虑必要限制
      this.nodeCount = +this.nodeCount + 1;
    },
    handleClickCreateSemanticNode() {

      const bitWidth = Number(this.bitWidth);
      const oldNodeCount = this.currentNodeChildren.length;

      const currentSemanticNodeListLength = this.semanticNodeList.length;
      const willCreateSemanticNodeListLength = Number(this.nodeCount);
      const shouldCreateLength = willCreateSemanticNodeListLength - currentSemanticNodeListLength;


      // 校验位宽

      if (Number.isNaN(bitWidth) || !bitWidth) {
        this.$Message.info(`请输入正确输入位宽`);
        return;
      }

      // 语义节点数校验
      if (Number.isNaN(willCreateSemanticNodeListLength)) {
        this.$Message.info(`语义节点数输入有误，请更正`);
        return;
      }

      if (oldNodeCount > willCreateSemanticNodeListLength) {
        this.$Message.info(`语义节点数低于原有语义节点数，请继续增加至${oldNodeCount}个及以上`);
        return;
      }

      // 地址步长校验

      const stepsize = Number(this.stepsize); // 拿到最新值
      if (Number.isNaN(stepsize)) {
        this.$Message.info("地址步长输入有误，请更正");
        return;
      }

      if (stepsize < 1) {
        this.$Message.info("地址步长请输入数字");
        return;
      }

      const surplus = this.surplus;

      const willUseAddressBlockCount = willCreateSemanticNodeListLength * stepsize;

      if (surplus < willUseAddressBlockCount) {
        this.$Message.info("地址空间不足，可缩小平均每个子节点地址值数量或者向上级申请增加地址空间");
        return;
      }

      if (shouldCreateLength > 0) {
        const parentsemanticid = this.currentNode.id;
        const semanticNodeList = this.semanticNodeList.filter(item => item.temporaryCreated !== "createing");
        const semanticNodes = Array.from({ length: shouldCreateLength }, function () {
          return {
            id: uuidv4(),
            modified: modifiedEnum.STRUCTURED,
            name: `新增节点${nodeIndex++}`,
            parentsemanticid,
            stepsize,
            sequence: 1,
            autocreate: void 0,
            ipv4s: [],
            plannodes: [],
            addressCount: 0, // plannodes.length,多数情况 步长，但是，在编辑追加后就不一定
            temporaryCreated: "createing",  // 零时创建但未保存的语义节点标识
          };
        });
        this.semanticNodeList = semanticNodeList.concat(semanticNodes);
      }


      // autoOneKey
      if (this.semanticNodeList.length) {
        const { autocreate } = this.semanticNodeList[0];
        if (autocreate === true) {
          this.autoOneKey();
          return;
        }
      }


      this.$Message.success("操作成功");

    },

    handleFilter() {
      this.filterKeyword = this.search;
    },

    handleResetSearch() {
      this.filterKeyword = "";
    },

    handleSaveSemanticName(row, name) {
      this.semanticNodeList.some(item => {
        if (item.id === row.id) {
          item.name = name;
          return true;
        }
        return false;
      });

    },
    handleSaveIpv4s(row, ipv4str) {
      const ipv4s = ipv4str.split(",");
      const valid = ipv4s.every(item => {
        const [ip, len] = item.split("/");
        return ipv4IsValid(ip.trim()) && !!len;
      });
      if (!valid) {
        this.$Message.error("ipv4s输入有误，请更正");
        return;
      }
      this.semanticNodeList.some(item => {
        if (item.id === row.id) {
          item.ipv4s = ipv4s;
          return true;
        }
        return false;
      });
    },
    handleDeleteSemantic(row) {
      this.$Modal.confirm({
        title: "语义节点删除确认",
        content: "<p>请再次语义节点删除确认</p>",
        loading: true,
        onOk: () => {
          this.removeNodeById(row.id);
          const nodes = this.nodes.filter(node => node.id !== row.id);
          nodes.forEach(node => {
            if (node.id === row.parentsemanticid) {
              node.modified = modifiedEnum.STRUCTURED;
            }
          });
          this.updatePlan(nodes).then(() => {
            this.$Modal.remove();
            this.$Message.info("语义节点删除成功");
          });

        }
      });

    },
    handleOpenEditNode(row) {

      this.nodeEditVisible = true;
      const prefixList = this.currentNodePrefix;

      const plannodes = row.plannodes;

      console.log(row, prefixList, plannodes)
      const allPlanNodes = this.allPlanNodes;
      const semanticNodeList = this.semanticNodeList;
      const bitWidth = this.bitWidth;

      const prefixMap = {};
      row.plannodes = row.plannodes || [];
      row.plannodes.forEach(plannode => {
        if (prefixMap[plannode.parentplannodeid]) {
          prefixMap[plannode.parentplannodeid].count += 1;
        } else {
          const { prefix } = allPlanNodes.find(item => item.id === plannode.parentplannodeid)

          prefixMap[plannode.parentplannodeid] = {
            prefix,
            count: 1
          };
        }
      });

      this.currentNodeofChooseChild.row = row;
      const prefixMapTemp = prefixList.map(prefix => {
        const { count } = Object.values(prefixMap).find(item => item.prefix === prefix) || { count: 0 };

        const availableValueList = executeValueRecyclePool(
          [prefix],
          semanticNodeList,
          bitWidth
        );

        return {
          prefix,
          count,
          availableValueList,
          initCount: count
        };
      });
      this.currentNodeofChooseChild.prefixMap = prefixMapTemp;

      this.prefixMap = prefixMapTemp;

      console.log(prefixMapTemp)

    },
    handleCountChange(item) {
      const maxCount = item.availableValueList.length + item.initCount;
      if (item.count > maxCount || item.count < item.initCount || Number.isNaN(Number(item.count))) {
        this.$Message.info(`请输入${item.initCount}到${maxCount}的数字`);
        this.$nextTick().then(() => {
          item.count = item.initCount;
        });
      }
    },
    handleSubtractionCount(item) {
      if (item.initCount < item.count) {
        // vue 响应式的极限,通过引用，解决了这个问题 => console.log(this.prefixMap)
        item.count -= 1;
        // this.$set(item, "count", item.count); 这种方式在这里无效
      }
    },
    handlePlusCount(item) {
      const maxCount = item.availableValueList.length + item.initCount;
      if (item.count < maxCount) {
        item.count += 1;
      }
    },
    handleSaveChildNode() {


      const node = (this.currentNodeofChooseChild);
      this.$refs["currentNodeofChooseChildRef"].validate(valid => {
        if (valid) {

          const allPlanNodes = this.allPlanNodes;
          const bitWidth = this.bitWidth;
          const prefixList = this.currentNodePrefix;

          const { prefixMap } = node;
          const semanticNode = node.row;

          console.log(prefixMap, "prefixMap")

          const semanticNodeList = this.semanticNodeList;

          const plannodes = prefixMap.reduce((result, { prefix, count, initCount, availableValueList }) => {

            const stepSize = Number(count - initCount);

            if (!Number.isNaN(stepSize) && stepSize > 0) {
              const plannodes = Array.from({ length: stepSize }, (item, index) => {
                const { prefix, value } = availableValueList[index];

                const parentPlanNode = allPlanNodes.find(
                  item => item.prefix === prefix
                ) || { id: "0" };
                const parentplannodeid = parentPlanNode.id;
                return createPlanNode({
                  prefix: executeNextIpv6Segment(prefix, value, bitWidth),
                  value,
                  parentsemanticid: semanticNode.id,
                  parentplannodeid,
                  sequence: 1,
                  name: "",
                  bitWidth
                });
              });
              return result.concat(plannodes);
            }
            return result;
          }, []);


          node.row.plannodes.push(...plannodes);



          const temp = [];
          semanticNodeList.forEach(semanticNode => {
            if (semanticNode.id === node.row.id) {
              semanticNode.prefixs = node.row.plannodes.map(item => item.prefix);
              semanticNode.plannodes = node.row.plannodes;
              semanticNode.modified = modifiedEnum.INFO;
              temp.push(semanticNode);
            } else {
              temp.push(semanticNode);
            }
          });

          console.log(temp, "temp")
          this.semanticNodeList = temp;

          this.nodeEditVisible = false;
        }
      });

    },

    handleOneKeyPlan() {

      const surplus = +this.surplus; // 剩余地址块数

      const prefixList = this.currentNodePrefix;

      const semanticNodeList = this.semanticNodeList;
      const stepSize = +this.stepsize;
      const nextBitWidth = this.bitWidth;
      const allPlanNodes = this.allPlanNodes;

      if (stepSize * semanticNodeList.length <= surplus) {
        const nodeList = planSemanticNodesValue({
          prefixList,
          semanticNodeList,
          bitWidth: nextBitWidth,
          stepSize,
          allPlanNodes
        }).map(item => {
          Reflect.deleteProperty(item, "temporaryCreated");
          return {
            ...item,
            addressCount: item.plannodes.length,
            prefixs: item.plannodes.map(item => item.prefix),
            autocreate: true
          };
        });
        this.semanticNodeList = nodeList;
        this.$Message.success("操作成功");
      }

    },

    autoOneKey() {
      // 进行过一次一键规划的，后面增加的节点默认自动规划
      this.handleOneKeyPlan();
    },
    handleSelectSemanticList(list) {
      this.selectSemanticList = list;
    },
    handleOpenCustomPlan() {
      this.customPlanVisible = true;
    },

    handleCustomPlan(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const { choosePrefix } = this.customPlan;

          const prefixList = [choosePrefix];
          const semanticNodeList = this.semanticNodeList;

          const selectSemanticNodeList = this.selectSemanticList;
          const stepSize = +this.stepsize;
          const nextBitWidth = this.bitWidth;
          const allPlanNodes = this.allPlanNodes;

          const nodeList = planSemanticNodesValue({
            prefixList,
            semanticNodeList,
            selectSemanticNodeList,
            bitWidth: nextBitWidth,
            stepSize,
            allPlanNodes
          }).map(item => {
            Reflect.deleteProperty(item, "temporaryCreated");
            return {
              ...item,
              addressCount: item.plannodes.length,
              prefixs: item.plannodes.map(item => item.prefix),
              autocreate: false
            };
          });
          this.semanticNodeList = nodeList;
          this.$Message.success("操作成功");
          this.customPlanVisible = false;

        }
      });

    },

    handleClearPlan() {
      const semanticNodeList = this.semanticNodeList;
      this.semanticNodeList = semanticNodeList.map(item => {
        return {
          ...item,
          plannodes: [],
          prefixs: [],
          addressCount: 0,
          autocreate: void 0
        };
      });
      this.$Message.success("操作成功");
    },
    handleSave() {
      // 对编辑过的属性进行保存，TODO：切换的时候提示保存
      this.changeCurrentNode("stepsize", +this.stepsize); // change stepsize，设置stepsize
      this.saveNodes(cloneDeep(this.semanticNodeList));
      const nodes = cloneDeep(this.nodes);
      this.updatePlan(nodes).then(() => {
        this.$Message.success("保存成功");
      });
    },
    updatePlan(semanticnodes) {
      const { url } = this.$getApiByRoute();
      const maxmaskwidth = 64;

      const planMaskWidths = Array.from({ length: this.prefixs.length }, () => maxmaskwidth);
      const params = {
        maxmaskwidths: planMaskWidths,
        name: this.planName,
        prefixs: this.prefixs,
        semanticnodes
      };

      return this.$put({ url, params }).then(() => {
        this.getCurrentPlanInfo({ url });
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    }
  }
};
</script>



<style lang="less" scoped>
.SemanticContent {
  position: relative;
  flex: 1;
  padding-left: 24px;

  .SemanticContent-inner {
    border-left: 1px solid #e6e6e6;
    padding-left: 20px;
    height: 100vh;
  }

  .SemanticContent-header {
    position: relative;
    display: flex;
    align-items: flex-end;
    font-size: 14px;
    color: #333;
    font-weight: bold;
    margin-bottom: 20px;
    line-height: 1;
    &::before {
      position: absolute;
      left: -23px;
      top: 0;
      display: block;
      content: "";
      width: 5px;
      height: 20px;
      border-radius: 2px;
      background: #4586fe;
    }
    h1 {
      font-size: 20px;
    }
    > * {
      display: flex;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      margin-right: 24px;
      word-break: keep-all;
      > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        margin-right: 24px;
        word-break: keep-all;
      }
    }
    img {
      display: block;
    }
  }

  .SemanticContent-statistics {
    display: inline-flex;
    .SemanticContent-statistics-item {
      margin-right: 95px;
      strong {
        font-size: 18px;
        color: #333;
        font-weight: bold;
        min-height: 27px;
        max-width: 260px;
        overflow: hidden;
        display: block;
        text-overflow: ellipsis;
      }
      p {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .SemanticContent-action {
    display: flex;
    min-width: 1100px;
    margin-bottom: 30px;
    align-items: flex-end;

    .action-input-item {
      display: inline-flex;
      margin-right: 16px;
      .label {
        display: block;
        min-width: 80px;
        font-size: 14px;
        color: #333;
        padding: 2px 0;
        line-height: 28px;
      }
      .action-box-input {
        width: 200px;
        font-size: 14px;
        color: #333;
        line-height: 25px;
      }
      .action-box {
        display: flex;
        flex: 1;

        .action-box-btn {
          padding-left: 10px;
          padding-right: 10px;
          margin-left: 4px;
        }
        .action-box-icon {
          font-size: 20px;
          color: #b3b3b3;
          margin-left: 6px;
          cursor: pointer;
        }
      }
    }
    .action-input-item-right {
      display: flex;
      margin-left: auto;
      > .reset {
        margin-left: 10px;
      }
    }
  }

  .SemanticContent-opera {
    position: absolute;
    bottom: 20px;
  }
}
</style>

<style lang="less">
.detail-tooltip {
  .ivu-tooltip-inner-with-width {
    white-space: inherit;
  }
}

.SemanticContent {
  display: flex;
  flex-direction: column;
  .SemanticContent-table {
    .SemanticContent-table-operate {
      margin-bottom: 10px;
      display: flex;
      .action-input-item-right {
        display: flex;
        margin-left: auto;
        > .reset {
          margin-left: 10px;
        }
      }
    }

    flex: 1;
    margin-bottom: 40px;
    .ivu-table-body {
      overflow-x: hidden;
      overflow-y: auto;
      flex: 1;
      height: calc(~"100vh - 600px");
      margin-right: -4px;
    }
  }
}

.o-table {
  width: 100%;
  border: 1px solid #ddd;
  border-spacing: 0;
  border-collapse: collapse;
  td {
    border: 1px solid #ddd;
    padding: 4px 16px;
    line-height: 20px;
    min-height: 40px;
  }
}

.step-bar {
  display: flex;
  margin-left: -30px;
  margin-bottom: 20px;

  .step-bar-inner {
    display: flex;
    background: #ededed;
    border-radius: 10px;
    color: #333;
    line-height: 20px;

    .step-bar-index {
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #cccccc;
      text-align: center;
    }
    .step-bar-name {
      font-size: 14px;
      padding: 0 8px;
    }
  }
  .step-bar-tip {
    width: 16px;
    height: 16px;
    margin-left: 6px;
    margin-top: 2px;
  }
}

.ipToolTip {
  width: 100%;
  .ivu-tooltip-inner {
    white-space: pre;
  }
}

.btn-count {
  cursor: pointer;
}
</style>