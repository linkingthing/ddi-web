<template>
  <div class="SemanticContent">
    <div class="SemanticContent-header">
      <p>政务网规划</p>
      <img
        src="./title-bar.png"
        alt=""
      >
    </div>
    <div class="SemanticContent-statistics">
      <div class="SemanticContent-statistics-item">
        <strong>{{ currentNodePrefix.join(",")}}</strong>
        <p>前缀(共{{currentNodePrefix.length}}个)</p>
      </div>
      <div class="SemanticContent-statistics-item">
        <strong>{{ surplus}} </strong>
        <p>剩余地址块</p>
      </div>
    </div>

    <SegmentAxis
      style="width: 700px;margin-bottom: 20px"
      :enable-prefix-len="+prefixLen"
      :prefix-len="Number(currentNodePrefixLen)"
      :bit-width="Number(currentNodeBitWidth)"
    />

    <div class="SemanticContent-action">
      <div class="action-input-item">
        <label class="label">占位</label>
        <div class="action-box">
          <input
            class="action-box-input"
            type="text"
            placeholder="请输入占位数"
            v-model="bitWidth"
          >

          <Tooltip
            placement="bottom"
            theme="light"
            max-width="700"
            style="white-space:none"
            class="detail-tooltip"
          >
            <Button
              class="action-box-btn"
              size="small"
              type="primary"
            >详情</Button>
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

        </div>

      </div>

      <div class="action-input-item">
        <label class="label">语义节点数</label>
        <div class="action-box">
          <span class="action-box-input">{{nodeCount}}</span>
          <Button
            class="action-box-btn"
            size="small"
            type="primary"
            @click="handleAddOne"
          >+1</Button>
          <Button
            class="action-box-btn"
            size="small"
            type="primary"
            @click="customNodeCountVisible = true"
          >自定义添加数量</Button>
        </div>
      </div>

      <div class="action-input-item-right">
        <Input placeholder="请输入名称关键字" />
        <Button type="primary">搜索</Button>
        <Button class="reset">重置</Button>

      </div>

    </div>

    <div class="modal">

      <common-modal
        :visible.sync="customNodeCountVisible"
        title="自定义添加节点数量"
        :width="413"
        @confirm="handleConfirmCustomNodeCount"
      >
        <div class="custome-node-count">
          <label class="label">455+</label>
          <Input
            class="input"
            placeholder="请填写添加数量"
          />
        </div>
      </common-modal>

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
      <Table
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
</template>

<script>
// 经历过一个需求 迭代四版的人，使用一个文件写完所有功能必须被理解，不需要解释
import SegmentAxis from "@/components/SegmentAxis";
import { mapGetters, mapMutations } from "vuex";
import { debounce, cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { ipv4IsValid, isIpv4Segment } from "@/util/common";
import { parserValueStr2Arr, executeNextIpv6Segment } from "./helper";


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
      customNodeCountVisible: false,
      nodeEditVisible: false,
      columns: [
        {
          title: "节点名称",
          key: "name",
          width: 250
        },

        {
          title: "使用地址块",
          key: "name",
          width: 300

        },
        {
          title: "IPv6地址范围",
          key: "name",
          width: 200

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
              h("btn-edit", {
                on: {
                  click: () => this.handleOpenEditNode(row)
                }
              }),
              h("btn-del")
            ]);
          }

        }
      ],

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
      },


    };
  },
  computed: {
    ...mapGetters([
      "planName",
      "perfix",
      "nodes",
      "tree",
      "currentNode",
      "currentNodeChildren",
      "allPlanNodes",
    ]),

    surplus() {
      let result = "_ _";
      if (this.currentNode && this.currentNode.prefix && this.currentNode.prefix.length) {
        console.log(this.currentNode, 0)
        const { nextBitWidth, plannodes } = this.currentNode;
        const currentNodeChildren = this.nodes.filter(item => item.pid === this.currentNode.id);
        console.log(currentNodeChildren, 22)

        const childrenLen =
          currentNodeChildren
            .map(({ plannodes }) =>
              Array.isArray(plannodes) ? plannodes.length : 0)
            .reduce((prev, result) => {
              return result + prev;
            }, 0);

        result = 2 ** nextBitWidth - 1 - childrenLen;
      }
      return result;
    },
    dataDetail() {
      const prefix = this.currentNodePrefix;
      const nextBitWidth = this.currentNode ? this.currentNode.nextBitWidth : 0;
      const count = 2 ** Number(nextBitWidth);
      return prefix.map(item => {
        return {
          prefix: item,
          count,
          name: "3333sss"
        };
      });
    },
    filterCurrentNodeChildren() {
      const currentNodeChildren = cloneDeep(this.currentNodeChildren);
      return currentNodeChildren;
    }
  },
  watch: {
    currentNode: {
      deep: true,
      handler(val) {
        console.log(val, 33)
        if (!val) {
          return;
        }

        if (val.prefix && Array.isArray(val.prefix) && val.prefix.length) {
          this.currentNodePrefix = val.prefix;
          const [, len] = val.prefix[0].split("/");
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


      }
    },
    bitWidth(val) {
      if (val === "") {
        this.changeCurrentNode(0);
      }
      const notNumber = !(/\D/.test(val));
      if (notNumber) {
        this.changeCurrentNode(+val);
      } else {
        this.$Message.info("请输入数字");
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "saveCurrentNode",
      "addNodes"
    ]),
    changeCurrentNode: debounce(function (val) {

      const currentNode = cloneDeep(this.currentNode);

      if (currentNode) {
        currentNode.nextBitWidth = val;
        this.saveCurrentNode(currentNode);
      }

    }, 600),
    handleToggleDetail() {
      this.detailVisible = !this.detailVisible;
    },
    handleAddOne() {
      this.nodeCount += 1;
      const pid = this.currentNode.id;
      const nodes = [{
        expand: true,
        nextBitWidth: 0, // 下一级位宽
        bitWidth: 0,
        id: uuidv4(),
        ipv4: "",
        modified: 1,
        name: `新增节点 ${this.nodeCount}`,
        pid: pid,
        value: 0,
        prefix: "",
        nodes: [],
        plannodes: []
      }];
      this.addNodes(nodes);

    },
    handleConfirmCustomNodeCount() {

    },

    handleOpenEditNode(row) {

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

          this.saveCurrentNode(node);

          this.nodeEditVisible = false;
        }


      });

    },
    handleSave() {
      const { url } = this.$getApiByRoute();
      const isCreate = this.$route.query.isCreate === "true";

      console.log(isCreate, this.$route.query.isCreate, "新建时候可能问题");

      const methods = isCreate ? "$post" : "$put";

      console.log(this.nodes, "nodes")

      const nodes = cloneDeep(this.nodes);


      nodes.forEach(node => {
        console.log(node, "node")


        node.modified = 1;


        if (node.pid === "0" && !node.plannodes) {
          node.plannodes = node.prefix.map(item => {
            return {
              id: uuidv4(),
              prefix: item,
              ppid: "0",  // 当前网络节点的上层（生成它的）网络节点，
              psid: node.id,  // psid plannode 的node也就是，当前网络节点的语义节点
              name: node.name
            };
          });
        }

        /**
         * nextBitWidth 是当前语义节点 的子节点的planNode节点的位宽
        */
        const pNode = nodes.find(item => item.id === node.pid);
        console.log(pNode, "pNode")
        const bitWidth = pNode && +pNode.nextBitWidth;

        Array.isArray(node.plannodes) && node.plannodes.forEach(plannode => {
          plannode.bitWidth = bitWidth;
        });
        if (node.hasPrefixObject) {
          node.plannodes = Array.isArray(node.prefixObject) ? node.prefixObject.map((item, index) => {

            console.log(item.prefix)

            // ppid的算法可以优化？，只从语义节点父节点种plannodes里面找？缩小范围可乎？
            const ppidOfPrefix = item.prefix; // ppid 对应的plannode的prefix;
            const ppNode = this.allPlanNodes.find(item => item.prefix === ppidOfPrefix) || {};
            // ppNode ,ppNode.id 不一定拿得到

            return {
              id: uuidv4(),
              prefix: item.planNodePrefix,
              psid: node.id,
              ppid: ppNode.id, // 网络节点的上层网络节点
              sequence: "",
              value: item.value,
              name: `plannodes${index}`,
              ipv4: [],
              bitWidth
            };
          }) : [];
        }


      });

      const params = {
        nodes,
        name: "layout"
      };

      this[methods]({ url, params }).then(res => {
        console.log(res)
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
  padding: 0 24px;

  .SemanticContent-header {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    margin-bottom: 20px;
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
    margin-bottom: 20px;

    .action-input-item {
      display: inline-flex;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      margin-right: 40px;
      .label {
        font-size: 14px;
        color: #333;
        padding: 4px 10px;
        line-height: 25px;
      }

      .action-box {
        display: flex;
        flex: 1;
        padding: 4px;
        border-left: 1px solid #e6e6e6;
        .action-box-input {
          width: 150px;
          font-size: 14px;
          color: #333;
          line-height: 25px;
        }
        .action-box-btn {
          padding-left: 10px;
          padding-right: 10px;
          margin-left: 4px;
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
    bottom: 0;
  }
}
</style>

<style lang="less">
.detail-tooltip {
  .ivu-tooltip-inner-with-width {
    white-space: inherit;
  }
}

.custome-node-count {
  display: flex;
  border-radius: 4px;
  .label {
    display: block;
    padding: 4px 12px;
    background: #ccc;
    color: #333;
    font-size: 14px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .ivu-input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.SemanticContent {
  display: flex;
  flex-direction: column;
  .SemanticContent-table {
    flex: 1;
    margin-bottom: 40px;
    .ivu-table-body {
      overflow-x: hidden;
      overflow-y: auto;
      flex: 1;
      height: calc(~"100vh - 500px");
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
</style>