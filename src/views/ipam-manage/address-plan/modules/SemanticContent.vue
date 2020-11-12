<template>
  <div class="SemanticContent">
    <div class="SemanticContent-inner">

      <div class="SemanticContent-header">
        <h1 title="政务网规划">政务网规划</h1>
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

      <!-- <div class="SemanticContent-statistics">

        <div class="SemanticContent-statistics-item">
          <strong>{{ currentNodePrefix.join(",")}}</strong>
          <p>前缀(共{{currentNodePrefix.length}}个)</p>
        </div>
        <div class="SemanticContent-statistics-item">
          <strong>{{ surplus}} </strong>
          <p>剩余地址块</p>
        </div>
      </div> -->

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
            />
            <!-- TODO：需要修改变量 -->

          </div>
        </div>

        <div class="action-input-item">
          <label class="label">地址步长：</label>
          <div class="action-box">
            <Input
              class="action-box-input"
              v-model="stepsize"
              placeholder="请输入地址步长"
            />
          </div>
        </div>
        <div class="action-input-item">
          <Button
            type="primary"
            @click="handleClickCreateSemanticNode"
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
          :visible.sync="nodeEditVisible"
          title="节点编辑"
          :width="690"
          @confirm="handleSaveChildNode"
        >
          <Form
            :model="currentNodeofChooseChild"
            :label-width="80"
            :rules="currentNodeofChooseChildRule"
            ref="currentNodeofChooseChildRef"
          >
            <FormItem
              label="节点名称"
              prop="name"
            >
              <Input
                placeholder="请输入节点名称"
                v-model.trim="currentNodeofChooseChild.name"
              />
            </FormItem>
            <FormItem
              label="IPv4子网"
              prop="ipv4"
            >
              <Input
                placeholder="请输入IPv4子网"
                v-model.trim="currentNodeofChooseChild.ipv4"
              />
            </FormItem>

            <h3 style="margin-bottom: 12px;">地址块序号设置</h3>
            <FormItem
              prop="valueMap"
              :label-width="0"
            >
              <table class="o-table">
                <colgroup>
                  <col style="width: 200px">
                  <col>
                </colgroup>
                <tr
                  v-for="item in currentNodeofChooseChild.valueMap"
                  :key="item.id"
                >
                  <td>
                    {{item.prefix}}
                  </td>
                  <td>
                    <Input
                      v-model.trim="item.values"
                      placeholder="间隔序号用“,”隔开，连续序号用“-”连接，例：1,4-9"
                    />
                  </td>
                </tr>
              </table>
            </FormItem>
          </Form>
        </common-modal>

      </div>

      <div class="SemanticContent-table">
        <div class="SemanticContent-table-operate">
          <div>
            <Button
              type="primary"
              @click="handleOneKeyPlan"
            >一键规划</Button>
            <Button
              type="primary"
              ghost
            >自定义规划</Button>

            <Button type="warning">清空规划</Button>
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
          style="border: 1px solid #E6E6E6;border-bottom: none"
          :columns="columns"
          :data="filterCurrentNodeChildren"
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
import { parserValueStr2Arr, executeNextIpv6Segment, planSemanticNodesValue } from "./helper";


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
          width: 200
        },

        {
          title: "地址个数",
          key: "addressCount",
          width: 150

        },
        {
          title: "IPv6地址",
          key: "prefixs",
          width: 250

        },
        {
          title: "IPv4子网",
          key: "ipv4",
          maxWidth: 300,
          render: (h, { row }) => {
            return h("div", row.ipv4 ? row.ipv4 : "--");
          }

        },
        {
          title: "操作",
          key: "action",
          width: 200,
          render: (h, { row }) => {
            return h("div", [
              h("a", {

              }, "分发"),
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
        valueMap: [],
        name: "",
        ipv4: ""
      },
      currentNodeofChooseChildRule: {
        name: [{
          validator: (rule, value, callback) => {
            if (value.length > 25) {
              callback("名称长度不超过25个字符");
            } else {
              callback();
            }
          }
        }],
        ipv4: [{
          validator: (rule, value, callback) => {

            if (value === "") {
              callback();
            }
            const ispass = value.split(",").every(item => {
              const isNetSegment = (item.split("/").length === 2);
              const [, len] = item.split("/");
              return ipv4IsValid(item.trim()) && isNetSegment && len < 32 && len > 0 && isIpv4Segment(item.trim());
            });

            if (ispass) {
              callback();
            } else {
              callback("IP地址输入有误，请查证");
            }

          }
        }],
        valueMap: [{
          validator: (rule, value, callback) => {
            const nodeBitWidth = this.currentNode.nextBitWidth;
            const maxValue = 2 ** nodeBitWidth;
            if (!nodeBitWidth) {
              callback("请先设置位宽");
            }

            const isPass = value.every(({ values }) => {
              const valueArray = parserValueStr2Arr(values);

              const distinctValueArray = [...new Set(valueArray)];
              if (distinctValueArray.length !== valueArray.length) {
                callback("地址块序号有重复，请更正");
                return false;
              }

              // [1, 255] bitwidth 8 [1, 2**8 - 1], 0代表没填


              if (valueArray.isValid) {
                return valueArray.every(element => {
                  const num = Number(element);
                  return typeof num === "number" && !Number.isNaN(num) && (num > -1 && num < maxValue);
                });
              } else {
                return valueArray.isValid;
              }

            });

            if (isPass) {
              callback();
            } else {
              callback("地址块序号有误");
            }

          }
        }]
      }


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
      "allPlanNodes",
    ]),
    settableNextBitWidth() {
      // 位宽是否可修改
      return this.currentNode && this.currentNode.nextBitWidth !== 0;
    },
    surplus() {
      // 剩余地址数
      let result = "_ _";
      if (this.currentNode && this.currentNode.prefixs && this.currentNode.prefixs.length) {
        const { nextBitWidth, plannodes } = this.currentNode;
        const currentNodeChildren = this.nodes.filter(item => item.pid === this.currentNode.id);

        const childrenLen =
          currentNodeChildren
            .map(({ plannodes }) =>
              Array.isArray(plannodes) ? plannodes.length : 0)
            .reduce((prev, result) => {
              return result + prev;
            }, 0);

        result = this.currentNode.prefixs.length * (2 ** nextBitWidth - 1) - childrenLen;
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
      return currentNodeChildren.filter(item => item.name.includes(this.filterKeyword.trim()));
    }
  },
  watch: {
    currentNode: {
      deep: true,
      handler(val) {
        console.log(val, "currentNode")
        // console.log("nodes", this.nodes)
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

        if ((typeof val.nextBitWidth === "number") && (this.bitWidth !== val.nextBitWidth)) {
          this.bitWidth = val.nextBitWidth;
        }

        // stepsize
        if ((typeof val.stepsize === "number") && (this.stepsize !== val.stepsize)) {
          this.stepsize = val.stepsize;
        }

      }
    },
    stepsize(val) {
      // if (val === "") {
      //   this.changeCurrentNode("stepsize", 0);
      // }
      // const notNumber = !(/\D/.test(val));
      // if (notNumber) {
      //   this.changeCurrentNode("stepsize", +val);
      // } else {
      //   this.$Message.info("请输入数字");
      // }
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
    changeCurrentNode: debounce(function (attr, val) {
      // 在语义节点上 设置位宽，便于planNode获取
      const currentNode = cloneDeep(this.currentNode);

      if (currentNode) {
        currentNode[attr] = val;
        this.saveNode(currentNode);
      }

    }, 600),
    handleToggleDetail() {
      this.detailVisible = !this.detailVisible;
    },
    handleAddOne() {
      // TODO: 考虑必要限制
      this.nodeCount = +this.nodeCount + 1;
    },
    handleClickCreateSemanticNode() {
      const oldNodeCount = this.currentNodeChildren.length;

      const currentSemanticNodeListLength = this.semanticNodeList.length;
      const willCreateSemanticNodeListLength = Number(this.nodeCount);
      const shouldCreateLength = willCreateSemanticNodeListLength - oldNodeCount;

      // 语义节点数校验
      if (Number.isNaN(willCreateSemanticNodeListLength)) {
        this.$Message.info(`语义节点数输入有误，请更正`);
        return;
      }

      if (oldNodeCount > willCreateSemanticNodeListLength) {
        this.$Message.info(`语义节点数低于原有语义节点数，请继续增加至${oldNodeCount}个及以上`);
        return;
      }


      const surplus = this.surplus;

      const willUseAddressBlockCount = currentSemanticNodeListLength * this.stepsize;
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
            modified: 1,
            name: `新增节点`,
            parentsemanticid,
            stepsize: 2,
            sequence: 1,
            autocreate: false,  // TODO：这里交互来源
            ipv4s: [],
            plannodes: [],
            addressCount: 0, // plannodes.length,多数情况 步长，但是，在编辑追加后就不一定

            temporaryCreated: "createing",  // 零时创建但未保存的语义节点标识

          };
        });
        this.semanticNodeList = semanticNodeList.concat(semanticNodes);
      }

    },

    handleFilter() {
      this.filterKeyword = this.search;
    },

    handleResetSearch() {
      this.filterKeyword = "";
    },

    handleDeleteSemantic(row) {
      // TODO:删除语义节点的限制条件
      this.removeNodeById(row.id);
    },
    handleOpenEditNode(row) {
      // TODO：整体设计改变，这部分代码基本无意义
      console.log(row)
      console.log(this.currentNode)
      this.nodeEditVisible = true;
      this.currentNodeofChooseChild = cloneDeep(row);

      /**
       * 构造 valueMap 渲染填写每个planNode的value的列表项
       * 
       * 1. 新增时候，根据url prefix映射出 等长度得  {id, prefix, values}
       * 2. 编辑时候，通过plannodes，逆运算（prefix分组，valueStr） [但是父级前缀怎么判定呢，一个planNode根据什么判定属于那个父级语义节点]
       */



      if (false) {

      } else {
        this.currentNodeofChooseChild.valueMap = Array.isArray(this.currentNode.prefix) ? this.currentNode.prefix.map(prefix => {
          return {
            id: uuidv4(),
            prefix,
            values: ""
          };
        }) : [];
      }

    },
    handleSaveChildNode() {
      // TODO：整体设计改变，这部分代码基本无意义

      const node = cloneDeep(this.currentNodeofChooseChild);

      this.$refs["currentNodeofChooseChildRef"].validate(valid => {
        if (valid) {
          const nodeBitWidth = this.currentNode.nextBitWidth;
          node.hasPrefixObject = true;
          node.prefixObject = node.valueMap.map(({ prefix, values }) => {
            // values => valueArray
            const valueArray = parserValueStr2Arr(values);
            return valueArray.map(value => {
              return { prefix, value, nodeBitWidth, planNodePrefix: executeNextIpv6Segment(prefix, value, nodeBitWidth) };
            });
          }).flat();

          node.prefix = node.prefixObject.map(item => item.planNodePrefix);

          this.saveNode(node);

          this.nodeEditVisible = false;
        }


      });

    },

    handleOneKeyPlan() {

      const surplus = +this.surplus; // 剩余地址块数

      const prefixList = this.currentNodePrefix;

      const semanticNodeList = this.semanticNodeList;
      const stepSize = +this.currentNode.stepsize;
      const nextBitWidth = this.currentNode.nextBitWidth;
      const allPlanNodes = this.allPlanNodes;

      console.log("currentNode", this.currentNode)
      console.log("semanticNodeList", semanticNodeList)
      console.log("prefixList", prefixList)
      console.log("stepSize", stepSize)
      console.log("nextBitWidth", nextBitWidth)

      console.log("surplus", surplus)
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
            prefixs: item.plannodes.map(item => item.prefix)
          };
        });

        this.saveNodes(nodeList);
      }




      // const 

    },
    handleSave() {
      const { url } = this.$getApiByRoute();


      const methods = "$put";

      console.log(this.nodes, "nodes")
      console.log(this.prefixs, "prefixs")

      const nodes = cloneDeep(this.nodes);

      const maxmaskwidth = 64;

      const planMaskWidths = Array.from({ length: this.prefixs.length }, () => maxmaskwidth);
      const params = {
        maxmaskwidths: planMaskWidths,
        name: this.planName,
        prefixs: this.prefixs,
        semanticnodes: nodes.map(item => {
          return {
            ...item,
            modified: true
          };
        })
      };

      this[methods]({ url, params }).then(res => {
        console.log(res)

        this.getCurrentPlanInfo(this.$getApiByRoute());
        this.$Message.success("保存成功");
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
</style>