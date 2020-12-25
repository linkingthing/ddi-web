<template>
  <Modal
    v-model="innerVisible"
    width="85%"
    title="快速查询"
    :footer-hide="true"
    class="quick-search"
  >
    <CommonTab
      :active="active"
      :tab-list="tabList"
      @change="(value) => { active = value }"
      style="margin-bottom: 20px"
    />

    <section v-if="active === 'ip'">
      <div style="margin-bottom: 20px">
        <Input
          placeholder="请输入想要查询的IP"
          style="width: 330px"
          v-model="ip"
          search
          @on-search="handleSearch"
        ></Input>
        <Button
          type="primary"
          @click="handleSearch"
        >查询</Button>
      </div>
      <div
        class="base-info"
        style="margin-bottom: 20px"
      >
        <div class="card">
          <h3 class="card-title">基础信息</h3>

          <ul class="card-list">
            <li>
              <div class="card-list-label">所属规划</div>
              <div class="card-list-value">{{result.ownPlan}}</div>
            </li>
            <li>
              <div class="card-list-label">规划前缀</div>
              <div class="card-list-value">{{result.plan.prefix}}</div>
            </li>
            <li>
              <div class="card-list-label">所属子网</div>
              <div class="card-list-value">{{result.subnet.subnet}}</div>
            </li>
            <li>
              <div class="card-list-label">地址类型</div>
              <div class="card-list-value">{{result.ipTypeLabel}}</div>
            </li>
            <li>
              <div class="card-list-label">地址状态</div>
              <div class="card-list-value">{{result.ipStateLabel}}</div>
            </li>
          </ul>
        </div>
        <div class="card">
          <h3 class="card-title">分配信息</h3>
          <ul class="card-list">
            <li>
              <div class="card-list-cell">
                <div class="card-list-label">所属终端</div>
                <div class="card-list-value">{{result.deviceTypeName}}</div>
              </div>
              <div class="card-list-cell">
                <div class="card-list-label">位置信息</div>
                <div class="card-list-value">{{result.computerRoomRack}}</div>
              </div>
            </li>
            <li>
              <div class="card-list-cell">
                <div class="card-list-label">终端MAC</div>
                <div class="card-list-value">{{result.asset.mac}}</div>
              </div>
              <div class="card-list-cell">

                <div class="card-list-label">部署服务</div>
                <div class="card-list-value">{{result.asset.deployedService}}</div>
              </div>
            </li>
            <li>
              <div class="card-list-cell">

                <div class="card-list-label">上联设备</div>
                <div class="card-list-value">{{result.asset.uplinkEquipment}}</div>
              </div>
              <div class="card-list-cell">
                <div class="card-list-label">所属部门</div>
                <div class="card-list-value">{{result.asset.department}}</div>
              </div>
            </li>
            <li>
              <div class="card-list-cell">

                <div class="card-list-label">上联端口</div>
                <div class="card-list-value">{{result.asset.uplinkPort}}</div>
              </div>
              <div class="card-list-cell">
                <div class="card-list-label">负责人</div>
                <div class="card-list-value">{{result.asset.responsiblePerson}}</div>
              </div>
            </li>
            <li>
              <div class="card-list-cell">
                <div class="card-list-label">VLAN</div>
                <div class="card-list-value">{{result.asset.vlanId || ""}}</div>
              </div>
              <div class="card-list-cell">
                <div class="card-list-label">联系电话</div>
                <div class="card-list-value">{{result.asset.telephone}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="base-info">
        <div class="card">
          <h3 class="card-title">访问历史</h3>
          <Table
            :data="historyData"
            :columns="historyColumns"
          >

          </Table>
        </div>
        <div class="card">
          <h3 class="card-title">分配历史</h3>
          <Table
            :data="assignHistoryData"
            :columns="assignHistoryColumns"
          >

          </Table>
        </div>
      </div>
    </section>

    <section v-else>
      <div style="margin-bottom: 20px">
        <Input
          placeholder="请输入想要查询的域名"
          style="width: 330px"
          v-model="domain"
          search
          @on-search="handleDomainSearch"
        ></Input>
        <Button
          type="primary"
          @click="handleDomainSearch"
        >查询</Button>
      </div>
      <Table
        :data="domainData"
        :columns="domainColums"
      ></Table>
    </section>

  </Modal>
</template>

<script>

import CommonTab from "@/components/CommonTab";
import { ipTypeMap, ipStateMap } from "@/views/ipam-manage/network-interface/define";
import { deviceTypes } from "@/views/ipam-manage/ip-assets-manage/define";


import eventBus from "@/util/bus";

export default {
  components: {
    CommonTab
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.ipTypeMap = ipTypeMap;
    this.ipStateMap = ipStateMap;

    this.tabList = [{
      id: "ip",
      label: "IP资产查询"
    }, {
      id: "domain",
      label: "域名访问查询"
    }];
    return {
      innerVisible: false,
      active: "ip",

      ip: "",
      historyData: [],
      historyColumns: [
        {
          type: "index",
          title: "序号",
          key: "name",
          width: 80

        },
        {
          title: "访问域名",
          key: "domain"
        },
        {
          title: "访问次数",
          key: "count",
          width: 100,
          align: "center"
        }, {
          title: "操作",
          key: "action",
          align: "center",
          width: 80,
          render: (h, { row }) => {
            return h("div", {}, [
              h("btn-line", {
                props: {
                  title: "查询"
                },
                on: {
                  click: () => this.handleGoDomainSearch(row.domain)
                }
              })
            ]);
          }
        }
      ],

      assignHistoryData: [],
      assignHistoryColumns: [{
        type: "index",
        title: "序号",
        key: "name",
        width: 80
      },
      {
        title: "终端MAC",
        key: "mac"
      },
      {
        title: "地址类型",
        key: "ipType"
      }, {
        title: "分配时间",
        key: "time"
      }],

      result: {
        plan: {},
        subnet: {},
        ipState: {},
        asset: {},
        ipTypeLabel: "",
        ipStateLabel: ""

      },


      domain: "",

      domainData: [],
      domainColums: [
        {
          type: "index",
          width: 80,
          title: "序号",
          fixed: "left"
        },
        {
          title: "访问源地址",
          key: "ip",
          fixed: "left",
          width: 180

        },
        {
          title: "访问次数",
          key: "count",
          width: 100
        },
        {
          title: "地址类型",
          key: "ipType",
          width: 120
        },
        {
          title: "地址状态",
          key: "ipState",
          width: 100
        },
        {
          title: "所属规划",
          key: "smanticPlan",
          width: 200,
          tooltip: true
          // render: (h, { row }) => {
          //   return h("div", row.semanticNames.join(">"));
          // }
        },
        {
          title: "所属子网",
          key: "subnet",
          width: 160

        },
        {
          title: "所属终端",
          key: "name",
          width: 120
        },
        {
          title: "终端MAC",
          key: "mac",
          width: 160
        },
        {
          title: "终端类型",
          key: "deviceType",
          width: 120

        },
        {
          title: "终端上联设备",
          key: "uplinkEquipment",
          width: 160

        },

        {
          title: "终端上联端口",
          key: "uplinkPort",
          width: 200
        },
        {
          title: "VLAN",
          key: "vlanId",
          width: 100
        },
        {
          title: "终端位置",
          key: "computerRoomRack",
          width: 120
        },

        {
          title: "负责人",
          key: "responsiblePerson",
          width: 80
        },
        {
          title: "联系电话",
          key: "telephone",
          width: 160
        },
        {
          title: "操作",
          key: "asssss",
          fixed: "right",
          width: 80,
          render: (h, { row }) => {
            return h("div", {}, [
              h("btn-line", {
                props: {
                  title: "查询"
                },
                on: {
                  click: () => this.handleGoIpSearch(row.ip)
                }
              })
            ]);
          }
        }
      ]
    };
  },
  computed: {},
  watch: {
    visible(val) {
      this.innerVisible = val;
    },
    innerVisible(val) {
      this.$emit("update:visible", val);
    }
  },
  created() {
    eventBus.$on("onSearchDomain", (domain) => {
      this.domain = domain;
      this.innerVisible = true;
      this.active = "domain";
      this.getDomainData();
    });

    eventBus.$on("onSearchIp", (ip) => {
      this.ip = ip;
      this.innerVisible = true;
      this.active = "ip";
      this.getData();
    });


  },
  mounted() { },
  methods: {
    getData() {
      const url = "/apis/linkingthing.com/ipam/v1/ipportraits";
      const params = {
        ip: this.ip
      };
      this.$get({ url, params }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {
          const result = data[0];

          result.ownPlan = result.plan.semanticNames.join(">");

          result.ipTypeLabel = result.ipState && result.ipState.ipType && ipTypeMap[result.ipState.ipType].label;
          result.ipStateLabel = result.ipState && result.ipState.ipState && ipStateMap[result.ipState.ipState].label;

          const type = deviceTypes.find(({ label }) => label === result.asset.deviceType);
          result.asset.deviceType = type ? type.text : "";

          result.deviceTypeName = this.spuerJoin(result.asset.deviceType, result.asset.name);
          result.computerRoomRack = this.spuerJoin(result.asset.computerRoomRack, result.asset.computerRack);



          this.result = result;

          if (Array.isArray(result.browsedHistories)) {
            this.historyData = result.browsedHistories;
          } else {
            this.historyData = [];
          }

          if (Array.isArray(result.allocatedHistories)) {
            this.assignHistoryData = result.allocatedHistories.map(item => {
              return {
                ...item,
                ipType: ipTypeMap[item.ipType] && ipTypeMap[item.ipType].label,
                time: this.$trimDate(item.time)
              };
            });
          } else {
            this.assignHistoryData = [];
          }
        } else {
          this.result = {
            plan: {},
            subnet: {},
            ipState: {},
            asset: {},
            ipTypeLabel: "",
            ipStateLabel: ""
          };
          this.historyData = [];
          this.assignHistoryData = [];
        }
      }).catch(err => {
        this.result = {
          plan: {},
          subnet: {},
          ipState: {},
          asset: {},
          ipTypeLabel: "",
          ipStateLabel: ""
        };
        this.historyData = [];
        this.assignHistoryData = [];
        this.$Message.error(err.response.data.message);
      });
    },
    handleSearch() {
      this.getData();
    },
    handleGoDomainSearch(domain) {
      this.active = "domain";
      this.domain = domain;
      this.getDomainData();
    },

    handleDomainSearch() {
      this.getDomainData();
    },
    handleGoIpSearch(ip) {
      this.active = "ip";
      this.ip = ip;
      this.getData();
    },
    getDomainData() {
      const url = "/apis/linkingthing.com/ipam/v1/domainportraits";

      const params = {
        domain: this.domain
      };
      this.$get({ url, params }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {
          const domainData = data[0].ips;
          this.domainData = domainData.map(item => {
            let result = Object.values(item).reduce((item, prev) => {
              return {
                ...item,
                ...prev
              };
            }, {});

            const type = deviceTypes.find(({ label }) => label === result.deviceType);
            return {
              ...result,
              subnet: result.subnet || result.prefix,
              vlanId: result.vlanId || "",
              smanticPlan: result.semanticNames.join(">"),
              ipType: ipTypeMap[result.ipType] && ipTypeMap[result.ipType].label,
              ipState: ipStateMap[result.ipState] && ipStateMap[result.ipState].label,
              deviceType: type ? type.text : "",
              computerRoomRack: this.spuerJoin(result.computerRoom, result.computerRack)
            };
          });
        } else {
          this.domainData = [];
        }
      });
    },

    spuerJoin(a, b) {
      return (a && b) ? `${a} / ${b}` : (a || b);
    }

  }
};
</script>

<style lang="less">
.quick-search {
  .ivu-modal-body {
    background: #f6f6f6;
    min-height: 600px;
  }
}
</style>

<style lang="less" scoped>
.quick-search {
  .ivu-modal-body {
    background: #f6f6f6;
  }

  .base-info {
    display: flex;
    justify-content: space-between;
  }

  .card {
    background: #ffffff;
    box-shadow: 0px 0px 16px 0px rgba(120, 120, 120, 0.07);
    border-radius: 6px;

    width: calc(~"50% - 10px");
    border-radius: 8px;
    padding: 10px 20px 30px;

    .card-title {
      font-size: 16px;
      color: #333;
      line-height: 20px;
      margin-bottom: 12px;
    }
    .card-list {
      border-left: 1px solid #e6e6e6;
      border-top: 1px solid #e6e6e6;
      li {
        display: flex;

        line-height: 20px;
        font-size: 14px;

        &:nth-child(odd) {
          background: #f4f7fa;
        }
      }
    }
    .card-list-cell {
      display: flex;
      flex: 1;
    }
    .card-list-label {
      width: 100px;
      color: #777;
      padding: 10px 20px;
      border-right: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
    }
    .card-list-value {
      flex: 1;
      color: #333;
      padding: 10px 20px;
      border-right: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
    }
  }
}
</style>