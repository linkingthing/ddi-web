<template>
  <div class="ip-info-manage">
    <NoData v-if="noData" />
    <table-page
      v-else
      :loading="loading"
      :total="total"
      :data="list"
      :columns="columns"
      :current.sync="query.current"
    >

      <template slot="neck">
        <div class="neck">
          <Input
            style="width: 270px"
            search
            enter-button="搜索"
            placeholder="请输入机构名称关键字"
          />
          <div class="neck-handle">
            <Button
              type="primary"
              @click="$router.push({name: 'ipam-address-plan'})"
            >地址规划</Button>
            <Button
              type="primary"
              @click="handleClickReport"
              :disabled="ableClickReport"
            >信息上报</Button>
            <Button
              type="primary"
              @click="handleOpenMap"
            >查看地图</Button>
          </div>
        </div>

      </template>
    </table-page>

    <Modal
      v-model="mapVisible"
      fullscreen
      :title="mapTitle"
      class="mapModal"
      footer-hide
    >
      <PlanTree :data="treeData" />
    </Modal>

    <Modal
      v-model="detailVisible"
      title="详情"
      footer-hide
    >

      <common-tab
        class="tab-box"
        style="margin-bottom: 16px"
        @change="handleTab"
        :active="tab"
        :tab-list="tabList"
      />

      <Table
        :loading="detailLoading"
        border
        :data="detailData"
        :columns="detailColumns"
      />

    </Modal>

    <common-modal
      :visible.sync="dispatchVisible"
      title="IPv6前缀下发"
      :width="483"
      @confirm="handleSaveDispatch('dispatchRef')"
    >
      <Form
        :model="dispatchParams"
        :label-width="100"
        ref="dispatchRef"
      >
        <FormItem
          prop="remoteAddr"
          label="子系统选择"
          :rules="{required: true, message: '请选择子系统'}"
        >
          <Select v-model="dispatchParams.remoteAddr">
            <Option
              v-for="item in dispatchClients"
              :key="item.id"
              :value="item.clientAddr"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>

    </common-modal>

  </div>
</template>

<script>

import PlanTree from "../address-plan/modules/PlanTree";
import { list2Tree } from "../address-plan/modules/helper";
import NoData from "./modules/NoData";

export default {
  components: {
    PlanTree,
    NoData
  },
  props: {},
  data() {
    this.tabList = [{
      id: "list_v6",
      label: "Ipv6子网",
    }, {
      id: "list_v4",
      label: "Ipv4子网",
    }];
    return {
      noData: false,
      loading: false,
      total: 0,
      list: [],
      columns: [{
        title: "机构名称",
        key: "name"
      }, {
        title: "IPv6地址",
        key: "networkV6s",
        render: (h, { row }) => {
          if (Array.isArray(row.networkV6s)) {
            const data = row.networkV6s.map(item => item.prefix)
            const ips = data.join(",");
            return <Tooltip >
              <span>{ips}</span>
              <div slot="content">
                {
                  data.map(item => {
                    return <p>{item}</p>
                  })
                }
              </div>
            </Tooltip>
          }

        }
      }, {
        title: "IPv4地址",
        key: "networkV4s",
        render: (h, { row }) => {
          if (Array.isArray(row.networkV4s)) {
            const data = row.networkV4s.map(item => item.prefix)
            const ips = data.join(",");
            return <Tooltip >
              <span>{ips}</span>
              <div slot="content">
                {
                  data.map(item => {
                    return <p>{item}</p>
                  })
                }
              </div>
            </Tooltip>
          }

        }
      }, {
        title: "操作",
        key: "action",
        width: 200,
        render: (h, { row }) => {
          let ableRepeal = false;

          if (row.dispatch && row.dispatch.isSponsor) {
            ableRepeal = true
          }

          return <div>
            <btn-line title="下发" onClick={() => this.handleDispath(row)} />
            <btn-line title="撤回" disabled={!ableRepeal} onClick={() => row.dispatch && this.handleRepeal(row)} />
            <btn-line title="详情" onClick={() => this.handleOpenDetailModal(row)} />
          </div>
        }
      }],
      query: {
        current: 0
      },

      mapVisible: false,
      mapTitle: "",
      treeData: [],

      links: {},
      current: {},


      detailVisible: false,
      tab: "list_v6",
      detailLoading: false,
      detailColumns: [{
        title: "子网名称",
        key: "name",
      }, {
        title: "子网类型",
        key: "networkType",
      }, {
        title: "业务",
        key: "business",
      }, {
        title: "子网地址",
        key: "prefix",
      }],
      detailData: [],

      currentSemanticId: "",
      reportServerAddr: "",
      dispatchVisible: false,
      dispatchParams: {
        remoteAddr: "",
        semanticInfos: []
      },
      dispatchClients: [],

      ableClickReport: true


    };
  },
  computed: {},
  watch: {

  },
  created() {
    this.getDataList();
    // this.getReportConfig();
  },
  mounted() { },
  methods: {
    getDataList() {
      this.loading = true;
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/semanticinfos" }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {
          const [{ links, id, dispatch }] = data;
          this.getItemList(links);
          this.links = links;
          this.currentSemanticId = id;

          if (dispatch && !dispatch.isSponsor) {
            this.ableClickReport = false;
          }
        } else {
          this.noData = true;
        }
      }).catch(err => {
        this.loading = false;
      })
    },
    getItemList(links) {
      this.$post({ url: `${links.self}?action=list_semantic_info` }).then(({ semanticTree }) => {
        this.list = semanticTree;
      }).catch().finally(() => {
        this.loading = false;
      })
    },

    handleOpenDetailModal(row) {
      this.detailVisible = true;
      this.current = row;
      this.getDetail();

    },

    handleTab(_, tab) {
      this.tab = tab.id;
      this.getDetail();
    },

    getDetail(action = this.tab) {
      const params = {
        semanticId: this.current.id
      };
      this.detailLoading = true;
      this.$post({ url: `${this.links.self}?action=${action}`, params }).then(data => {
        if (Array.isArray(data)) {
          this.detailData = data;
        } else {
          this.detailData = [];
        }
      }).finally(() => {
        this.detailLoading = false;
      });
    },

    async getReportConfig() {
      let result = {};
      const url = "/apis/linkingthing.com/ipam/v1/dispatchconfigs";

      await this.$get({ url }).then(({ data }) => {

        if (Array.isArray(data) && data.length) {
          const [{ enableReport, reportServerAddr }] = data;
          result = { enableReport, reportServerAddr }
          return result
        }
      });
      return result
    },
    async handleClickReport() {
      const { enableReport, reportServerAddr } = await this.getReportConfig();
      if (reportServerAddr === "" || !enableReport) {
        this.$Message.info("请先在系统联动配置上报信息");
        return
      }

      if (this.list.length) {
        const [{ dispatch }] = this.list;
        if (dispatch) {
          const url = `${this.links.self}?action=report_forward`;
          const params = {
            remoteAddr: dispatch.remoteAddr,
            semanticInfos: [
              {
                id: this.currentSemanticId
              }
            ]
          }
          this.$post({ url, params }).then(() => {
            this.$Message.success("上报成功");
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        }
      }

    },

    handleDispath(row) {
      // 获取后校验，下拉
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/dispatchconfigs" }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {

          this.$refs.dispatchRef.resetFields();
          this.dispatchVisible = true;
          this.dispatchParams.semanticInfos = [row];

          const [{ dispatchClients }] = data;
          this.dispatchClients = dispatchClients;
          console.log(dispatchClients)
        } else {
          this.$Message.info("请先配置系统联动");
        }
      });
    },

    handleRepeal(row) {
      this.$Modal.confirm({
        title: "撤销下发确认提示",
        content: `<p>您需要撤销对子系统的下发操作吗？</p>`,
        onOk: () => {
          const { remoteAddr } = row.dispatch;
          const params = {
            remoteAddr,
            semanticInfos: [{ id: row.id }]
          };

          const url = `${this.links.self}?action=repeal_forward`;

          this.$post({ url, params }).then(res => {
            this.$Message.success("撤回成功");
            this.getDataList();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });

        },
        onCancel: () => {
          this.$Message.info("取消成功");
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
              const url = `${this.links.self}?action=dispatch_forward`;
              this.$post({ url, params }).then(() => {
                this.getDataList();
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

    handleOpenMap() {
      this.mapVisible = true;
      this.mapTitle = "规划树";
      this.treeData = list2Tree(this.list, "root");
    },

  }
};
</script>

<style lang="less" scoped>
.neck {
  display: flex;
  padding: 24px 26px 0;
  .neck-handle {
    margin-left: auto;
    .ivu-btn {
      margin-left: 10px;
    }
  }
}
</style>

<style lang="less">
.mapModal {
  .ivu-modal-header {
    background: #f1f1f1;
  }
  .ivu-modal-body {
    background-image: url("./box-bg.png");
  }
}
</style>