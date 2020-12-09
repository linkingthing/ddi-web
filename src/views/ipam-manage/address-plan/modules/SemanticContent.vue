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
              <Spinner
                style="width: 200px"
                :disabled="settableNextBitWidth"
                v-model="tempBitWidth"
                :placeholder="`最大地址位宽${64-prefixLen}`"
                :min="minBitwidth"
                :max="64-prefixLen"
              />

              <Tooltip
                placement="bottom"
                theme="light"
                max-width="1000"
                style="white-space:none"
                class="detail-tooltip"
              >
                <Icon
                  custom="icon-detail"
                  class="action-box-icon"
                />

                <div
                  slot="content"
                  style="padding: 10px 12px;width: 960px"
                >
                  <div style="font-size: 14px;color:#333;margin-bottom: 10px">占位详情</div>
                  <Table
                    :columns="columnsDetail"
                    :data="dataDetail"
                  />
                </div>
              </Tooltip>
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
          <div style="margin-left: auto;">
            <Button
              type="primary"
              style="margin-left: 20px"
              :disabled="settableNextBitWidth"
              @click="handleSetNextBitWidth"
            >确定</Button>
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
            <Spinner
              class="action-box-input"
              :disabled="settableSemanticNodeCount"
              v-model="nodeCount"
              placeholder="请输入语义节点数"
              :min="semanticNodeList.length"
              :max="allAddressBlockCount"
            />
          </div>
        </div>

        <div class="action-input-item">
          <label class="label">地址步长：</label>
          <div class="action-box">
            <Spinner
              class="action-box-input"
              :disabled="settableStepSize"
              v-model="stepsize"
              placeholder="请输入地址步长"
              :min="0"
              :max="allAddressBlockCount"
            />
          </div>
        </div>

        <div class="action-input-item">
          <label class="label">剩余地址块:</label>
          <span
            class="action-box-input"
            style="padding: 3px 0;"
          >
            {{surplus || "_ _"}}
          </span>
        </div>
        <div style="margin-left: auto;">
          <Button
            type="primary"
            @click="handleClickCreateSemanticNode"
            :disabled="settableCreateSemanticNode"
          >确定</Button>
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

        <common-modal
          :visible.sync="dispatchVisible"
          title="IPv6前缀下发"
          :width="413"
          @confirm="handleSaveDispatch('dispatchRef')"
        >
          <Form
            :model="dispatchParams"
            :label-width="100"
            :rules="dispatchRule"
            ref="dispatchRef"
          >
            <FormItem
              prop="remoteaddr"
              label="子系统选择"
              :rules="{required: true, message: '请选择子系统'}"
            >
              <Select v-model="dispatchParams.remoteaddr">
                <Option
                  v-for="item in dispatchclients"
                  :key="item.id"
                  :value="item.clientaddr"
                >{{ item.name }}</Option>
              </Select>
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
                v-if="showCustomPlan"
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
              <!-- <Button
                class="reset"
                @click="handleResetSearch"
              >重置</Button> -->

            </div>
          </div>

          <Table
            ref="selection"
            style="max-width: calc(100vw - 660px);border: 1px solid #E6E6E6;border-bottom: none"
            :columns="semanticColumns"
            :data="filterCurrentNodeChildren"
            @on-selection-change="handleSelectSemanticList"
          />

        </div>
        <div class="SemanticContent-opera">
          <Button
            type="primary"
            size="large"
            style="width: 300px;"
            @click="handleSave('保存成功')"
          >保存</Button>
        </div>
      </section>

    </div>
  </div>
</template>

<script>
// 经历过一个需求 迭代四版的人，使用一个文件写完所有功能必须被理解，不需要解释
// 别提复用，ui各种变，操作交随时变，提交的数据格式也在变

import Spinner from "@/components/Spinner";
import SegmentAxis from "@/components/SegmentAxis";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { debounce, cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { ipv4IsValid, isIpv4Segment } from "@/util/common";
import {
  executeNextIpv6Segment,
  planSemanticNodesValue,
  hasGrandson,
  createPlanNode,
  executeValueRecyclePool,
  modifiedEnum,
  planTypeEnum,
  executeUesedValueList
} from "./helper";

import eventBus from "@/util/bus";


export default {
  components: {
    SegmentAxis,
    Spinner
  },
  props: {},
  data() {

    this.dispatchRule = {

    };
    return {

      currentNodePrefix: [],

      prefixLen: 64,
      currentNodePrefixLen: 0,
      currentNodeBitWidth: 0,

      bitWidth: "",
      tempBitWidth: "",
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
          key: "name",
          width: 500
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

      search: "",
      filterKeyword: "",

      currentNodeofChooseChild: {

      },
      currentNodeofChooseChildRule: {

      },
      prefixMap: [], // 看似无用，但别乱删


      dispatchVisible: false,
      dispatchParams: {
        remoteaddr: "",
        semanticnodes: []
      },
      dispatchclients: []

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
      const planNodeCount = this.semanticNodeList.map(item => {
        return Array.isArray(item.plannodes) ? item.plannodes.length : 0;
      }).reduce((total, number) => { return total + number; }, 0);



      return hasGrandson(this.nodes, currentNodeId) || !!planNodeCount;
    },

    minBitwidth() {
      return Math.log2(this.semanticNodeList.length / this.prefixs.length + 2) || 0;
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

    /**
       * - 一键规划 （有一个一键规划，则算一键规划）
       * - 手动规划 （有一个手动规划，则算手动规划）
       * - 未规划 (没有语义节点或者，全部是未规划)
       * - 手动规划 + 未规划（情况）
       *   - 手动规划勾选部分
       *   - 清空部分规划情况
       */
    currentTargetNodeAutoCreate() {
      // 目标节点，也就是当前语义节点节点的子节点，也就是将去设置的节点以及兄弟节点 autoCreate

      const currentNodeChildren = this.semanticNodeList;
      if (currentNodeChildren.length) {
        const { autocreate } = currentNodeChildren[0];
        if (autocreate === planTypeEnum.ONEKEYPLAN) {
          return planTypeEnum.ONEKEYPLAN;
        }

        const isHandlePlan = currentNodeChildren.some(item => item.autocreate === planTypeEnum.HANDLEPLAN);

        if (isHandlePlan) {
          return planTypeEnum.HANDLEPLAN;
        }

        return planTypeEnum.UNDEFINED;
      }
      return void 0;
    },
    availableOneKeyPlan() {
      const autocreate = this.currentTargetNodeAutoCreate === planTypeEnum.ONEKEYPLAN || this.currentTargetNodeAutoCreate === planTypeEnum.UNDEFINED;

      return !autocreate;
    },
    isCustomPlan() {
      return this.currentTargetNodeAutoCreate === planTypeEnum.HANDLEPLAN;
    },
    availableCustomPlan() {
      const autocreate = this.currentTargetNodeAutoCreate === planTypeEnum.HANDLEPLAN || this.currentTargetNodeAutoCreate === planTypeEnum.UNDEFINED;
      const hasMorePrefixs = this.currentNodePrefix.length > 1;
      return !(autocreate && hasMorePrefixs);
    },
    showCustomPlan() {
      return this.currentNodePrefix.length > 1;
    },
    availableClearPlan() {
      const currentNodeId = this.currentNode && this.currentNode.id;

      return hasGrandson(this.selectSemanticList, currentNodeId, this.nodes);
    },
    allAddressBlockCount() {
      let result = 0;
      if (this.currentNode && this.currentNode.prefixs && this.currentNode.prefixs.length) {
        const { subnodebitwidth } = this.currentNode;
        result = this.currentNode.prefixs.length * (2 ** subnodebitwidth - 2)
      }
      return result;
    },
    surplus() {
      // 剩余地址数
      let result = 0;
      if (this.currentNode && this.currentNode.prefixs && this.currentNode.prefixs.length) {
        const { subnodebitwidth, plannodes } = this.currentNode;
        if (!subnodebitwidth) {
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

        result = this.currentNode.prefixs.length * (2 ** subnodebitwidth - 2) - childrenLen;
      }
      return result;
    },
    dataDetail() {
      const prefix = this.currentNodePrefix;
      const subnodebitwidth = this.currentNode ? this.currentNode.subnodebitwidth : 0;
      const count = subnodebitwidth ? 2 ** Number(subnodebitwidth) - 2 : 0;

      return prefix.map(item => {
        const minAblePlan = executeNextIpv6Segment(item, 1, subnodebitwidth);
        const maxAblePlan = executeNextIpv6Segment(item, count, subnodebitwidth);
        return {
          prefix: item,
          count,
          name: subnodebitwidth ? `${minAblePlan}~${maxAblePlan}` : "--"
        };
      });
    },
    filterCurrentNodeChildren() {
      const currentNodeChildren = cloneDeep(this.semanticNodeList);
      return currentNodeChildren.filter(item => item.name.includes(this.filterKeyword.trim())).map(item => {
        // console.log(item)
        return {
          ...item,
          showprefixs: (Array.isArray(item.prefixs) && item.prefixs.length) ? `[\n  ${item.prefixs.join(",\n  ")}\n]` : "_ _"
        };
      });
    },

    semanticColumns() {


      let selection = !this.availableCustomPlan ? [{
        type: "selection",
        width: 60,
      }] : [];
      return [
        ...selection,
        {
          type: "index",
          width: 80,
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
                  value: row.name,
                  width: "124px"
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
          width: 280
        },
        {
          title: "IPv4子网",
          key: "ipv4s",
          render: (h, { row }) => {
            const content = (row.ipv4s && row.ipv4s.length) ? ` ${row.ipv4s.join(",")}` : "_ _";
            let ref = "lineEditRef";
            let lineEditRef = this.$createElement("line-edit", {
              ref,
              on: {
                "on-edit-finish": val => {
                  this.handleSaveIpv4s(row, val, ref);
                }
              },
              props: {
                isPercent: false,
                value: Array.isArray(row.ipv4s) ? row.ipv4s.join(",") : "",
                width: "160px",
                defaultText: "_ _",
                checkfunc: this.checkfunc
              }
            });
            return this.$createElement("Tooltip", {
              class: {
                "ipToolTip": true
              },
              props: {
                placement: "bottom-start",
                content
              }
            }, [lineEditRef]
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 190,
          render: (h, { row }) => {
            return h("div", [
              h("btn-line", {
                style: {
                  display: !row.sponsordispatch ? "" : "none",
                  marginRight: "10px"
                },
                nativeOn: {
                  click: () => this.handleDispath(row)
                },
                props: {
                  title: "下发"
                }
              }),
              h("btn-line", {
                style: {
                  display: row.sponsordispatch ? "" : "none",
                  marginRight: "10px"
                },
                nativeOn: {
                  click: () => this.handleRepeal(row)
                },
                props: {
                  title: "撤回"
                }
              }),
              h("btn-edit", {
                style: {
                  marginRight: "10px"
                },
                props: {
                  disabled: !(Array.isArray(row.plannodes) && row.plannodes.length > 0)
                },
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
      ]
    }
  },
  watch: {
    currentNode: {
      deep: true,
      handler(val) {
        // console.log(val, "currentNode")
        // console.log("nodes", this.nodes)
        // console.log("currentNodeChildren", this.currentNodeChildren)

        if (!val) {
          return;
        }

        this.nodeCount = this.currentNodeChildren.length;

        if (val.prefixs && Array.isArray(val.prefixs) && val.prefixs.length) {
          this.currentNodePrefix = val.prefixs;
          const [, len] = val.prefixs[0].split("/");
          this.prefixLen = len;
          this.currentNodePrefixLen = len;
        } else {
          this.currentNodePrefix = [];
          this.currentNodePrefixLen = 0;
        }

        if (val.subnodebitwidth) {
          this.currentNodeBitWidth = val.subnodebitwidth;
        } else {
          this.currentNodeBitWidth = 0;
        }

        if ((typeof val.subnodebitwidth === "number")) {
          this.bitWidth = val.subnodebitwidth;
          this.tempBitWidth = val.subnodebitwidth || "";
        } else {
          this.bitWidth = 0;
          this.tempBitWidth = "";
        }

        // stepsize
        if ((typeof val.stepsize === "number")) {
          this.stepsize = val.stepsize;
        } else {
          this.stepsize = 0;
        }

      }
    },

    currentNodeChildren: {
      deep: true,
      immediate: true,
      handler(val) {
        this.semanticNodeList = cloneDeep(val);  // 为了避免 nodeCount 先改大再改小
      }
    },

    tempBitWidth(val, old) {

    }
  },
  created() { },
  mounted() {
    eventBus.$on("savePlan", this.handleSave);
  },
  methods: {
    ...mapMutations([
      "saveNode",
      "saveNodes",
      "addNodes",
      "removeNodeById",
      "setHasChange"
    ]),
    ...mapActions([
      "getCurrentPlanInfo"
    ]),

    handleSetNextBitWidth() {
      const bitWidth = Number(this.tempBitWidth);
      if (Number.isNaN(bitWidth)) {
        this.$Message.info("请输入数字");
        this.bitWidth = 0;
        return;
      }

      if (bitWidth <= 0) {
        this.$Message.info("请输入正整数");
        this.bitWidth = 0;
        return;
      }

      const [prefix] = this.currentNodePrefix;
      if (!prefix) {
        this.$Message.info(`请先设置上层节点信息`);
        return;
      }
      const [, len] = prefix.split("/");
      const maxBitwidth = 64 - len; // 根据剩余

      if (bitWidth > maxBitwidth) {
        this.$Message.info(`当前层级位宽不能超过 ${maxBitwidth}`);
        return;
      }
      this.bitWidth = bitWidth;
      this.changeCurrentNode("subnodebitwidth", bitWidth);

      this.handleSave("位宽设置成功");

    },
    changeCurrentNode(attr, val) {
      // 设置当前节点的属性
      const currentNode = cloneDeep(this.currentNode);
      if (currentNode) {
        currentNode[attr] = val;
        currentNode.modified = modifiedEnum.INFO;
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

      if (this.allAddressBlockCount < willCreateSemanticNodeListLength) {
        this.$Message.info(`语义节点数不超过剩余地址块`);
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
      this.changeCurrentNode("stepsize", +this.stepsize);


      const surplus = this.surplus;

      const willUseAddressBlockCount = shouldCreateLength * stepsize;


      // 空间计算，总共 >= 已使用 + 将分配，

      if (surplus < willUseAddressBlockCount) {
        this.$Message.info("地址空间不足，可缩小平均每个子节点地址值数量或者向上级申请增加地址空间");
        return;
      }

      if (willUseAddressBlockCount === 0) {
        this.handleSave();
        return;
      }

      const uesedValueLen = executeUesedValueList(this.semanticNodeList).length;

      if (willUseAddressBlockCount + uesedValueLen <= this.allAddressBlockCount) {
        const parentsemanticid = this.currentNode.id;
        const semanticNodeList = this.semanticNodeList.filter(item => item.temporaryCreated !== "createing");
        const semanticNodes = Array.from({ length: shouldCreateLength }, function () {
          return {
            id: uuidv4(),
            modified: modifiedEnum.STRUCTURED,
            name: `新增节点`,
            parentsemanticid,
            stepsize: "",
            sequence: 1,
            autocreate: planTypeEnum.UNDEFINED,
            ipv4s: [],
            plannodes: [],
            addressCount: 0, // plannodes.length,多数情况 步长，但是，在编辑追加后就不一定
            temporaryCreated: "createing",  // 零时创建但未保存的语义节点标识
          };
        });
        this.semanticNodeList = semanticNodeList.concat(semanticNodes);

        if (this.semanticNodeList.length) {
          const { autocreate } = this.semanticNodeList[0];
          if (autocreate === planTypeEnum.ONEKEYPLAN) {
            this.autoOneKey();
            return;
          }
        }
        this.handleSave();

      } else {
        this.$Message.info("地址空间不足，可缩小平均每个子节点地址值数量或者向上级申请增加地址空间");
        return;
      }

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
          item.modified = modifiedEnum.INFO;
          return true;
        }
        return false;
      });
      this.setHasChange(true);
      this.handleSave();
    },
    checkfunc(ipv4str) {
      const ipv4s = ipv4str.split(",");
      if (ipv4str.trim() === "") {
        return { isValid: true };
      }

      if (ipv4s.length !== [...new Set(ipv4s)].length) {
        return { isValid: false, message: "ipv4s重复，请更正" };
      }
      const isValid = !!ipv4s.every(item => {
        const [ip, len] = item.split("/");
        return !!len && isIpv4Segment(item);
      });
      return { isValid, message: "ipv4网段输入有误，请更正" };

    },
    handleSaveIpv4s(row, ipv4str, ref) {
      const ipv4s = ipv4str.split(",");
      this.semanticNodeList.some(item => {
        if (item.id === row.id) {
          item.ipv4s = ipv4s;
          item.modified = modifiedEnum.INFO;
          return true;
        }
        return false;
      });
      this.setHasChange(true);

    },
    handleDeleteSemantic(row) {
      this.$Modal.confirm({
        title: "语义节点删除确认",
        content: "<p>请再次语义节点删除确认</p>",
        loading: true,
        onOk: () => {
          const nodes = cloneDeep(this.nodes.filter(node => node.id !== row.id));
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
    handleDispath(row) {
      // 获取后校验，下拉
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/ipdispatchconfigs" }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {

          this.$refs.dispatchRef.resetFields();
          this.dispatchVisible = true;
          this.dispatchParams.semanticnodes = [row];
          this.dispatchclients = data[0].dispatchclients;
        } else {
          this.$Message.info("请先配置系统联动");
        }
      });
    },
    
    handleSaveDispatch(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = this.dispatchParams;
          this.$post({ url: `/apis/linkingthing.com/ipam/v1/plans?action=dispatchforward`, params }).then(res => {
            this.getPlanInfo();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        }
      });
    },

    handleRepeal(row) {

      const { remoteaddr, semanticnode } = row.sponsordispatch;
      const params = {
        remoteaddr,
        semanticnodes: [{ id: semanticnode }]
      };

      this.$post({ url: `/apis/linkingthing.com/ipam/v1/plans?action=repealforward`, params }).then(res => {
        this.getPlanInfo();
      }).catch(err => {
        this.$Message.error(err.response.data.message);
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
                  semanticid: semanticNode.id,
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

          this.semanticNodeList = temp;

          this.nodeEditVisible = false;
          this.setHasChange(true);

        }
      });

    },

    handleOneKeyPlan() {

      const prefixList = this.currentNodePrefix;

      const semanticNodeList = this.semanticNodeList;
      const stepSize = +this.stepsize;
      const subnodebitwidth = this.bitWidth;
      const allPlanNodes = this.allPlanNodes;

      try {
        const nodeList = planSemanticNodesValue({
          prefixList,
          semanticNodeList,
          bitWidth: subnodebitwidth,
          stepSize,
          allPlanNodes
        }).map(item => {
          Reflect.deleteProperty(item, "temporaryCreated");
          return {
            ...item,
            addressCount: item.plannodes.length,
            prefixs: item.plannodes.map(item => item.prefix),
            autocreate: planTypeEnum.ONEKEYPLAN,
            modified: modifiedEnum.STRUCTURED
          };
        });
        this.semanticNodeList = nodeList;
        this.setHasChange(true);
        this.handleSave();
      } catch (e) {
        this.$Message.error("地址空间不足，可缩小平均每个子节点地址值数量或者向上级申请增加地址空间");
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
      if (this.selectSemanticList.length) {
        this.customPlanVisible = true;
      } else {
        this.$Message.info("请先勾选语义节点");
      }
    },

    handleCustomPlan(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const { choosePrefix } = this.customPlan;

          const prefixList = [choosePrefix];
          const semanticNodeList = this.semanticNodeList;

          const selectSemanticNodeList = this.selectSemanticList;

          const stepSize = +this.stepsize;
          const subnodebitwidth = this.bitWidth;
          const allPlanNodes = this.allPlanNodes;

          const nodeList = planSemanticNodesValue({
            prefixList,
            semanticNodeList,
            selectSemanticNodeList,
            bitWidth: subnodebitwidth,
            stepSize,
            allPlanNodes
          }).map(item => {
            Reflect.deleteProperty(item, "temporaryCreated");
            return {
              ...item,
              addressCount: item.plannodes.length,
              prefixs: item.plannodes.map(item => item.prefix),
              autocreate: planTypeEnum.HANDLEPLAN
            };
          });
          this.semanticNodeList = nodeList;
          this.selectSemanticList = [];
          this.customPlanVisible = false;
          this.setHasChange(true);
          this.handleSave();
        }
      });

    },

    handleClearPlan() {

      if (this.isCustomPlan) {
        if (this.selectSemanticList.length > 0) {

          const semanticNodeList = this.semanticNodeList;
          this.semanticNodeList = semanticNodeList.map(item => {
            const isSelect = this.selectSemanticList.find(select => {
              return select.id === item.id;
            });

            if (isSelect) {
              return {
                ...item,
                plannodes: [],
                prefixs: [],
                addressCount: 0,
                autocreate: planTypeEnum.UNDEFINED,
                modified: modifiedEnum.STRUCTURED
              };
            } else {
              return item;
            }

          });
          this.setHasChange(true);
          this.selectSemanticList = [];
          this.handleSave();
        } else {
          this.$Message.info("请选择需要清空地址的子语义");
        }

        return;
      }



      const semanticNodeList = this.semanticNodeList;
      this.semanticNodeList = semanticNodeList.map(item => {
        return {
          ...item,
          plannodes: [],
          prefixs: [],
          addressCount: 0,
          autocreate: planTypeEnum.UNDEFINED,
          modified: modifiedEnum.STRUCTURED
        };
      });
      this.setHasChange(true);
      this.selectSemanticList = [];
      this.handleSave();
    },
    handleSave(message = "保存成功") {
      this.changeCurrentNode("stepsize", +this.stepsize); // change stepsize，设置stepsize
      this.saveNodes(cloneDeep(this.semanticNodeList));
      const nodes = cloneDeep(this.nodes);
      return this.updatePlan(nodes).then(() => {
        this.$Message.success(message);
      });
    },
    updatePlan(semanticnodes) {

      // semanticnodes ,sequence
      this.orderSequence(semanticnodes);

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
        this.setHasChange(false);
      }).catch(err => {
        this.$Message.error(err.response.data.message);
        return Promise.reject(); // 这里可以阻止后面的then执行
      });
    },
    orderSequence(semanticnodes) {
      semanticnodes.forEach((item, index) => item.sequence = index + 1);
    },
    getPlanInfo() {
      const { url } = this.$getApiByRoute();
      this.getCurrentPlanInfo({ url });
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
      margin-top: -4px;
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
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      flex: 1;
      height: calc(~"100vh - 580px");
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