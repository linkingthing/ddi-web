<template>

  <div class="SemanticContent">
    <Spin
      fix
      v-if="loadingContent"
    ></Spin>
    <div
      v-else
      class="SemanticContent-inner"
    >

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
          <Tooltip
            max-width="300"
            content="地址位宽表示IPv6可用规划位的长度。IPv6最大可规划长度是64，减去已经使用位数，即是目前可用规划的长度。"
            placement="right-start"
          >
            <img
              class="step-bar-tip"
              src="./question.png"
            >
          </Tooltip>
        </div>
        <div class="SemanticContent-action">
          <div class="action-input-item">
            <label class="label">地址位宽：</label>
            <div class="action-box">
              <Spinner
                class="bitwidth"
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
            <Button
              type="primary"
              style="margin: 0 20px"
              :disabled="settableNextBitWidth"
              @click="handleSetNextBitWidth"
            >确定</Button>
          </div>
          <div>
            <SegmentAxis
              v-if="currentNodePrefix.length"
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
          <Tooltip
            max-width="300"
            content="语义节点可以是业务，机构，或地理位置等，语义节点数即是需要规划IP地址的业务，机构，或地址位置的数量。并且位每个节点指定它需要的地址块数量，即使新增节点地址数。"
            placement="right-start"
          >
            <img
              class="step-bar-tip"
              src="./question.png"
            >
          </Tooltip>
          <div
            class="action-input-item"
            style="margin-left: 20px"
          >
            <label class="label">剩余地址块:</label>
            <span
              class="action-box-input"
              style="padding: 3px 0;"
            >
              {{remainAddressCount || "_ _"}}
            </span>
          </div>
        </div>

      </section>

      <div class="SemanticContent-action">

        <div class="action-input-item">
          <label class="label">组织子网个数：</label>
          <div class="action-box">
            <Spinner
              class="action-box-input"
              v-model="subSemanticPrefixCount"
              placeholder="请输入语义节点数"
              :min="semanticNodeList.length"
              :max="allAddressBlockCount"
            />
            <!-- :disabled="settableSemanticNodeCount" -->

          </div>
        </div>

        <div class="action-input-item">
          <label class="label">子网地址起始值：</label>
          <div class="action-box">
            <Input
              class="action-box-input"
              v-model="prefixBeginValue"
              placeholder="请输入子网地址起始值"
            />
            <!-- :disabled="settableStepSize" -->

          </div>
        </div>

        <div style="margin-left: auto;">
          <Button
            type="primary"
            @click="handleClickCreateSemanticNode"
          >确定</Button>
          <!-- :disabled="settableCreateSemanticNode" -->

        </div>
      </div>

      <div class="lk-modal">

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
          :width="483"
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

      <section>

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
                @click="handleCleanPlan"
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

          <!-- <Table
            :loading="tableLoading"
            ref="selection"
            class="dataTable"
            :columns="semanticColumns"
            :data="filterCurrentNodeChildren"
            @on-selection-change="handleSelectSemanticList"
          /> -->
          <div class="scroller">

            <div class="scroller-table-header">
              <div
                class="scroller-th"
                v-for="column in semanticColumns"
                :key="column.key"
                :style="{width: column.width+ 'px'}"
              >
                <template v-if="column.type === 'selection'">
                  <Checkbox @on-change="handleSelectAll"><span></span> </Checkbox>

                </template>
                <template v-else>
                  {{column.title || "#"}}
                </template>

              </div>
            </div>
            <CheckboxGroup
              style="height: 100%;flex: 1;overflow: hidden;"
              v-model="checkAllGroup"
              @on-change="handleSelectSemanticList"
            >

              <div
                v-if="!filterCurrentNodeChildren.length"
                style="text-align:center;line-height: 50px;border-bottom:1px solid #ddd"
              >暂无数据</div>
              <CommonScroller
                v-else
                :data="filterCurrentNodeChildren"
                :item-size="2"
                :buffer="300"
                key-field="id"
                v-slot="{item ,index}"
              >
                <div class="scroller-semantic">
                  <div
                    :style="{width: column.width+ 'px'}"
                    class="scroller-td"
                    v-for="(column) in semanticColumns"
                    :key="column.key"
                  >
                    <template v-if="column.type === 'index'">

                      <span class="index">{{index + 1}}</span>
                    </template>

                    <template v-if="column.type === 'selection'">
                      <Checkbox :label="item.id"><span></span> </Checkbox>

                    </template>

                    <template v-else-if="typeof column.render==='function'">
                      <exSlot
                        :render="column.render"
                        :row="item"
                        :index="index"
                        :column="column"
                      />
                    </template>
                    <template v-else-if="column.tooltip">
                      <Tooltip style="width: 100%;z-index:1">
                        <div slot="content">
                          <p
                            v-for="ii in item[column.key].split(',')"
                            :key="ii"
                          >{{ii}}</p>
                        </div>
                        <div style="overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;">
                          {{item[column.key]}}

                        </div>
                      </Tooltip>
                    </template>

                    <template v-else> {{item[column.key]}}</template>
                  </div>
                </div>
              </CommonScroller>
            </CheckboxGroup>
          </div>

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
import { cloneDeep } from "lodash";
import CommonScroller from "@/components/CommonScroller";
import { isIpv4Segment, includes } from "@/util/common";
import {
  executeNextIpv6Segment,
  hasSon,
  hasGrandson,
  executeValueRecyclePool,
  modifiedEnum,
  planTypeEnum,
} from "./helper";

const tempSemanticNameMap = {};

const exSlot = {
  functional: true,
  render: (h, context) => {
    const params = {
      row: context.props.row,
      index: context.props.index
    };
    if (context.props.column) params.column = context.props.column;
    return context.props.render(h, params);
  }
};
export default {
  components: {
    SegmentAxis,
    Spinner,
    exSlot,
    CommonScroller
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
      prefixBeginValue: "",
      subSemanticPrefixCount: "",
      remainAddressCount: 0,

      detailVisible: false,

      dataDetail: [],
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
          key: "addressAvailableScope",
          width: 500
        }
      ],
      nodeCount: 0,

      customPlanVisible: false,
      customPlan: {
        choosePrefix: ""
      },
      checkAllGroup: [],
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
      dispatchclients: [],


      editList: [],
      editIpv4List: [],
      tableLoading: false,



    };
  },
  computed: {
    ...mapGetters([
      "loadingContent",
      "planName",
      "prefixs",
      "nodes",
      "tree",
      "currentNode",
      "currentNodeChildren",
      "allPlanNodes",
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

      if (this.isCustomPlan) {
        return hasGrandson(this.selectSemanticList, currentNodeId, this.nodes);
      }

      return hasGrandson(this.nodes, currentNodeId);
    },
    allAddressBlockCount() {
      let result = 0;
      if (this.currentNode && this.currentNode.networkV6s && this.currentNode.networkV6s.length && this.currentNode.semanticPlan) {
        const { bitWidth } = this.currentNode.semanticPlan;
        result = this.currentNode.networkV6s.length * (2 ** bitWidth - 1)
      }
      return result;
    },

    filterCurrentNodeChildren() {
      const currentNodeChildren = cloneDeep(this.semanticNodeList);
      return currentNodeChildren
        .filter(item => item.name.includes(this.filterKeyword.trim()))
        .map(item => {
          const prefixs = Array.isArray(item.networkV6s) ? item.networkV6s.map(item => item.prefix) : []
          return {
            ...item,
            showprefixs: (Array.isArray(prefixs) && prefixs.length) ? `${prefixs.join(",\n")}` : "_ _",
            _disabled: hasSon(this.nodes, item.id) || (item.sponsordispatch && item.sponsordispatch.issponsor)
          };
        });
    },

    semanticColumns() {

      let selection = !this.availableCustomPlan ? [{
        type: "selection",
        width: 60
      }] : [];
      return [
        ...selection,
        {
          type: "index",
          width: 80
        },
        {
          title: "组织机构",
          key: "name",
          maxWidth: 200,
          minWidth: 150,
        },

        {
          title: "地址个数",
          key: "addressCount",
          maxWidth: 150,
          minWidth: 100,
          render: (h, { row }) => {
            console.log(row)
            if (row.networkV6s && Array.isArray(row.networkV6s)) {
              return <div>{row.networkV6s.length}</div>
            }
            return <div>0</div>
          }
        },
        {
          title: "IPv6地址",
          key: "showprefixs",
          tooltip: true,
          maxWidth: 280,
          minWidth: 100
        },

        {
          title: "操作",
          key: "action",
          width: 240,
          render: (h, { row }) => {

            const has = !!this.nodes.find(item => item.parentsemanticid === row.id);
            const hasDispath = row.state === "dispatch";
            return h("div", [

              h("btn-edit", {
                style: {
                  marginRight: "10px"
                },
                props: {
                  // disabled: !(Array.isArray(row.plannodes) && row.plannodes.length > 0)
                },
                on: {
                  click: () => this.handleOpenEditNode(row)
                }
              }),
              h("btn-del", {
                on: {
                  click: () => this.handleDeleteSemantic(row)
                },
                props: {
                  disabled: !!row.sponsordispatch || has
                }
              })
            ]);
          }

        }
      ];
    }
  },
  watch: {
    currentNode: {
      deep: true,
      handler(val) {
        console.log(val, val.semanticPlan)
        this.search = "";
        this.handleFilter();

        if (!val) {
          return;
        }

        if (val.networkV6s) {
          const prefixs = val.networkV6s
          this.currentNodePrefix = prefixs.map(item => item.prefix);

          if (this.currentNodePrefix.length) {
            const [, len] = this.currentNodePrefix[0].split("/");
            this.prefixLen = len;
            this.currentNodePrefixLen = len;
          }


        } else {
          this.currentNodePrefix = [];
        }

        if (val.semanticPlan) {
          const { bitWidth, prefixBeginValue, subSemanticPrefixCount, remainAddressCount } = val.semanticPlan;

          if (bitWidth) {
            this.currentNodeBitWidth = bitWidth;
            this.tempBitWidth = bitWidth || "";
          } else {
            this.currentNodeBitWidth = 0;
            this.tempBitWidth = "";
          }

          this.remainAddressCount = remainAddressCount;
          this.prefixBeginValue = prefixBeginValue;
          this.subSemanticPrefixCount = subSemanticPrefixCount

        } else {
          this.currentNodeBitWidth = 0;
          this.tempBitWidth = "";
          this.remainAddressCount = 0
        }

        this.nodeCount = this.currentNodeChildren.length;


        this.getDataDetail();

      }
    },

    currentNodeChildren: {
      deep: true,
      immediate: true,
      handler(val) {
        this.semanticNodeList = cloneDeep(val);  // 为了避免 nodeCount 先改大再改小
      }
    },
    tempBitWidth(val) {
      console.log(val, 66)
    }

  },
  created() { },
  mounted() {
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

    getDataDetail() {
      const { url } = this.$getApiByRoute();

      const params = {
        semanticId: this.currentNode.id
      }
      this.$post({ url: `${url}?action=get_plan_detail`, params }).then((data) => {
        if (data) {
          this.dataDetail = data.planDetails.map(item => {
            return {
              ...item,
              count: item.prefixUsedCount + item.remainAddressCount
            }
          });
        } else {
          this.dataDetail = [];
        }

      });
    },

    updateSemanticPlanByAction() {

      const params = {
        nodeId: this.currentNode.id,
        bitWidth: Number(this.tempBitWidth),
        subSemanticPrefixCount: +this.subSemanticPrefixCount,
        prefixBeginValue: this.prefixBeginValue
      }


      const { url } = this.$getApiByRoute();
      const action = `${url}?action=update_semantic_plan`;
      this.$post({ url: action, params }).then(() => {
        this.$Modal.remove();
        this.$Message.success("设置成功");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });

    },
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

      this.updateSemanticPlanByAction();

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

    handleClickCreateSemanticNode() {

      const bitWidth = Number(this.currentNodeBitWidth);
      const oldNodeCount = this.currentNodeChildren.length;

      const willCreateSemanticNodeListLength = Number(this.nodeCount);


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

      this.updateSemanticPlanByAction();

    },

    handleFilter() {
      this.filterKeyword = this.search;
    },

    handleResetSearch() {
      this.filterKeyword = "";
    },

    checkNamefunc(value, row) {
      if (value.trim().length > 36) {
        return { isValid: false, message: "规划名不能超过36字符" };
      }
      if (value.trim().length === 0) {
        return { isValid: false, message: "规划名不能为空" };
      }

      return { isValid: true };
    },

    handleDeleteSemantic(row) {
      const prefixs = this.currentNode.prefixs;
      this.cleanPlanByAction([row], prefixs);
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

          this.$Modal.confirm({
            title: "下发确认提示",
            content: `<p>您确定要下发到子系统吗?</p>`,
            onOk: () => {
              const params = this.dispatchParams;
              this.$post({ url: `/apis/linkingthing.com/ipam/v1/plans?action=dispatchforward`, params }).then(res => {
                this.getPlanInfo();
                this.dispatchVisible = false;
                this.$Message.success("下发成功");
              }).catch(err => {
                this.$Message.error(err.response.data.message);
              });
            },
            onCancel: () => {
              this.$Message.info("取消成功");
            }
          });

        }
      });
    },

    handleRepeal(row) {

      this.$Modal.confirm({
        title: "撤销下发确认提示",
        content: `<p>您需要撤销对子系统的下发操作吗？</p>`,
        onOk: () => {
          const { remoteaddr, semanticnode } = row.sponsordispatch;
          const params = {
            remoteaddr,
            semanticnodes: [{ id: semanticnode }]
          };

          this.$post({ url: `/apis/linkingthing.com/ipam/v1/plans?action=repealforward`, params }).then(res => {
            this.$Message.success("撤回成功");
            this.getPlanInfo();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });

        },
        onCancel: () => {
          this.$Message.info("取消成功");
        }
      });


    },
    handleOpenEditNode(row) {

      const { url } = this.$getApiByRoute();

      const params = {
        semanticId: this.currentNode.id
      }

      this.$post({ url: `${url}?action=get_plan_detail`, params }).then((data) => {
        if (data) {
          const { planDetails } = data;
          const currentCount = Array.isArray(row.networkV6s) && row.networkV6s.length || 0;
          const prefixMap = planDetails.map(item => {
            return {
              ...item,
              count: currentCount,
              initCount: currentCount,

            }
          });

          this.currentNodeofChooseChild.prefixMap = prefixMap;
          this.currentNodeofChooseChild.row = row;
          this.prefixMap = prefixMap;
          this.nodeEditVisible = true;
        }
      })
    },
    handleCountChange(item) {
      const maxCount = item.remainAddressCount + item.initCount;
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
      const maxCount = item.remainAddressCount + item.initCount;
      if (item.count < maxCount) {
        item.count += 1;
      }
    },

    editChildNodeByAction() {

    },
    handleSaveChildNode() {
      const node = (this.currentNodeofChooseChild);
      this.$refs["currentNodeofChooseChildRef"].validate(valid => {
        if (valid) {
          const { prefixMap, row } = node;

          const prefixs = [];
          const prefixNumbers = [];
          prefixMap.forEach(({ initCount, count, prefix }) => {
            if (count > initCount) {
              prefixs.push(prefix);
              prefixNumbers.push(count);
            }
          });

          const { url } = this.$getApiByRoute();
          const action = `${url}?action=update_prefix_v6`;

          const params = {
            prefixs,
            prefixCounts: prefixNumbers,
            parentId: this.currentNode.id,
            subNodeId: row.id
          };

          this.$post({ url: action, params })
            .then(res => {

              if (res.state === "") {
                this.$Message.success("增加成功");
                this.nodeEditVisible = false;
              }

              if (res.state === "conflict") {
                this.ignoreconflictByAction(params, "addplannodeignoreconflict")
              }

            })
            .catch((err) => {
              this.$Message.error(err.response.data.message);
            })
            .finally(() => {
              this.getPlanInfo();
            });

        }
      });

    },

    // 调api 计算ipv6
    executeIpv6ByAction(semanticNodes, prefixs) {
      const { url } = this.$getApiByRoute();
      const action = `${url}?action=plan_prefix_v6`;

      const params = {
        parentId: this.currentNode.id,
        prefixs,
        subNodeIds: semanticNodes.map(item => item.id)
      };


      this.$post({ url: action, params })
        .then(res => {

          if (res.state === "conflict") {
            this.$Modal.confirm({
              width: 580,
              title: "规划冲突提示",
              content: `
              <p>规划与本系统的子网地址冲突。</p>
              <p style="color: #f00;white-space: pre;max-height: 105px;overflow: auto;">${Array.isArray(res.conflictSubnets) ? res.conflictSubnets.join("\n") : res.conflictSubnets}</p>
              <p>点击忽略：系统使用以上冲突地址继续规划。</p>
              <p>点击确认：系统将放弃本次规划，需要用户首先手动排查冲突。</p>`,
              okText: "确认",
              cancelText: "忽略",
              onOk: () => {
                this.$Message.info("已取消");
              },
              onCancel: () => {
                this.ignoreconflictByAction(params, "formulateignoreconflict");
              }
            });
          } else {
            this.$Message.success("规划成功");
            this.selectSemanticList = [];
            this.customPlanVisible = false;
            this.checkAllGroup = [];

          }

        })
        .catch((err) => {
          this.$Message.error(err.response.data.message);
        })
        .finally(() => {
          this.getPlanInfo();
        });
    },

    ignoreconflictByAction(params, action = "formulateignoreconflict", message = "规划成功") {
      const { url } = this.$getApiByRoute();
      const actionUrl = `${url}?action=${action}`;

      this.$post({ url: actionUrl, params }).then(() => {
        this.$Message.success(message);
      })
        .catch((err) => {
          this.$Message.error(err.response.data.message);
        })
        .finally(() => {
          this.getPlanInfo();
        });
    },

    cleanPlanByAction(semanticNodes, prefixs) {

      console.log(semanticNodes)
      this.$Modal.confirm({
        title: "清空规划确认提示",
        content: `<p>您是否需要清空所有子语义节点的IPv6规划地址？</p>`,
        onOk: () => {
          const { url } = this.$getApiByRoute();
          const action = `${url}?action=clean_prefix_v6`;
          const params = {
            parentId: this.currentNode.id,
            prefixs,
            subNodeIds: semanticNodes.map(item => item.id)
          };

          this.$post({ url: action, params })
            .then(() => {
              this.$Message.success("清空规划成功");
              this.selectSemanticList = [];
              this.customPlanVisible = false;
            })
            .catch((err) => {
              this.$Message.error(err.response.data.message);
            })
            .finally(() => {
              this.getPlanInfo();
            });
        },
        onCancel: () => {
          this.$Message.info("取消成功");
        }
      });

    },

    handleOneKeyPlan() {
      const { networkV6s } = this.currentNode;
      if (networkV6s && Array.isArray(networkV6s)) {
        const prefixs = networkV6s.map(item => item.prefix);
        const semanticNodeList = this.semanticNodeList;
        this.executeIpv6ByAction(semanticNodeList, prefixs);
        this.checkAllGroup = [];
      } else {
        this.$Message.info("prefix获取到，请先规划上层")
      }

    },

    autoOneKey() {
      // 进行过一次一键规划的，后面增加的节点默认自动规划
      this.handleOneKeyPlan();
    },
    handleSelectAll(checked) {
      this.checkAllGroup = checked ? this.filterCurrentNodeChildren.map(item => item.id) : [];
      this.selectSemanticList = checked ? this.filterCurrentNodeChildren : [];
    },
    handleSelectSemanticList(list) {
      this.selectSemanticList = this.filterCurrentNodeChildren.filter(item => list.includes(item.id));
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
          const prefixs = [choosePrefix];
          const selectSemanticNodeList = this.selectSemanticList;
          this.executeIpv6ByAction(selectSemanticNodeList, prefixs);
          this.checkAllGroup = [];
        }
      });
    },

    handleCleanPlan() {
      const prefixs = this.currentNode.prefixs;
      if (this.isCustomPlan) {
        if (this.selectSemanticList.length > 0) {
          const semanticNodeList = this.selectSemanticList;
          this.cleanPlanByAction(semanticNodeList, prefixs);
        } else {
          this.$Message.info("请选择需要清空地址的子语义");
        }
        this.checkAllGroup = [];

      } else {
        const semanticNodeList = this.semanticNodeList;
        this.cleanPlanByAction(semanticNodeList, prefixs);
      }
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
  width: 100%;
  box-sizing: border-box;

  .SemanticContent-inner {
    border-left: 1px solid #e6e6e6;
    padding-left: 20px;
    height: 100vh;
    width: 100%;
    box-sizing: border-box;
  }

  .dataTable {
    max-width: calc(~"100vw - 690px");
    border: 1px solid #e6e6e6;
    border-bottom: none;
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
      display: block;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      .bitwidth {
        width: 200px;
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
      height: calc(~"100vh - 530px");
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
    height: 20px;

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

.scroller {
  height: calc(~"100vh - 530px");
  overflow: auto;
  display: flex;
  flex-direction: column;

  .scroller-table-header {
    display: table;
    table-layout: fixed;
    width: 100%;
    .scroller-th {
      display: table-cell;
      min-width: 0;
      height: 48px;
      box-sizing: border-box;
      text-align: left;
      text-overflow: ellipsis;
      vertical-align: middle;
      border-bottom: 1px solid #e8eaec;
      padding: 10px;
      background-color: #f5f7fa;
      color: #9f9f9f;
    }
  }
  .scroller-semantic {
    display: table;
    table-layout: fixed;
    width: 100%;
    border-left: 1px solid #e8eaec;

    .scroller-td {
      display: table-cell;
      min-width: 0;
      height: 48px;
      box-sizing: border-box;
      text-align: left;
      text-overflow: ellipsis;
      vertical-align: middle;
      border-bottom: 1px solid #e8eaec;
      padding: 10px;

      .ivu-tooltip-popper {
        z-index: 5 !important;
      }
    }
  }
}

.tempDisplay {
  display: none;
}
</style>