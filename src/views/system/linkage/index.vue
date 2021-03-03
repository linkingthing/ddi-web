<template>
  <div class="system-linkage">
    <div class="system-linkage-content">
      <div class="proccess-bar">
        <div
          class="proccess-bar-item"
          :style="{opacity: isUp ? 1 : .3}"
        >
          <img
            src="./system.png"
            alt=""
          >
          <p>上级系统</p>
        </div>
        <div
          class="proccess-bar-item proccess-bar-line"
          :style="{opacity: isUp ? 1 : .3}"
        >
          <div>......</div>
          <div class="proccess-bar-line-mark">
            上报
            <img
              src="./arrow-left.png"
              alt=""
            >
          </div>
          <div>......</div>
        </div>
        <div class="proccess-bar-item">
          <img
            src="./system.png"
            alt=""
          >
          <p>本地系统</p>
        </div>
        <div
          class="proccess-bar-item proccess-bar-line"
          :style="{opacity: !isUp ? 1 : .3}"
        >
          <div>......</div>
          <div class="proccess-bar-line-mark">
            下发
            <img
              src="./arrow-right.png"
              alt=""
            >
          </div>
          <div>......</div>

        </div>
        <div
          class="proccess-bar-item"
          :style="{opacity: !isUp ? 1 : .3}"
        >
          <img
            src="./system.png"
            alt=""
          >
          <p>下级系统</p>
        </div>
      </div>

      <div class="system-linkage-tab">
        <div
          class="system-linkage-tab-item "
          :class="{'system-linkage-tab-active': isUp }"
          @click="serveType = 'UP'"
        >
          上报服务
        </div>
        <div
          class="system-linkage-tab-item"
          :class="{'system-linkage-tab-active': !isUp }"
          @click="serveType = 'DOWN'"
        >
          下发服务
        </div>
      </div>

      <div class="line">
      </div>

      <div>

        <template v-if="isUp">
          <Form
            class="center-form"
            :model="reportParams"
            :label-width="110"
            :rules="rules"
            label-position="left"
            ref="formReport"
          >
            <FormItem
              label="启动上报服务"
              prop="enableReport"
              style="text-align:right"
            >
              <i-switch v-model="reportParams.enableReport" />
            </FormItem>
            <FormItem
              label="上级系统IP地址"
              prop="reportServerAddr"
            >
              <Input
                :disabled="!reportParams.enableReport"
                v-model="reportParams.reportServerAddr"
                placeholder="请填写上级系统IP地址"
              />
            </FormItem>

            <FormItem :label-width="0">
              <Button
                :disabled="submitAbled"
                type="primary"
                long
                @click="handleSubmitReport('formReport')"
              >确定</Button>
            </FormItem>
          </Form>
        </template>
        <template v-else>
          <div>
            <Form
              :label-colon="true"
              style="width:300px;margin: 20px auto 0"
            >
              <FormItem
                style="text-align:right;margin:0"
                label="启动下发服务"
                prop="enabledispatch"
              >
                <i-switch
                  v-model="dispatchConfig.enableDispatch"
                  @on-change="handleChangeDispatchConfig"
                />
              </FormItem>
            </Form>
          </div>
          <table-page
            :data="dataList"
            :columns="columns"
            :loading="tableLoading"
            :total="total"
            :current.sync="current"
          >

            <div slot="top-right">
              <Button
                type="primary"
                @click="handleOpenSingleAdd"
              >新增</Button>
            </div>
          </table-page>

        </template>

      </div>
    </div>

    <common-modal
      :visible.sync="singleAddVisible"
      :width="415"
      :title="title"
      @confirm="handleSaveSystemInfo('form')"
    >
      <Form
        :model="systemInfo"
        :label-width="110"
        :rules="systemRules"
        label-position="left"
        ref="form"
      >

        <FormItem
          label="系统名称"
          prop="name"
          style="text-align:right"
        >
          <Input v-model="systemInfo.name" />
        </FormItem>
        <FormItem
          label="IP地址"
          prop="clientAddr"
          style="text-align:right"
        >
          <Input v-model="systemInfo.clientAddr" />
        </FormItem>
        <FormItem
          label="备注"
          prop="comment"
          style="text-align:right"
        >
          <Input v-model="systemInfo.comment" />
        </FormItem>
      </Form>
    </common-modal>

  </div>
</template>

<script>
import { isIp } from "@/util/common";

export default {
  components: {},
  props: {},
  data() {
    this.headers = {
      Authorization: this.$store.getters.token
    };
    this.rules = {};
    this.systemRules = {
      name: [
        {
          required: true, message: "请输入系统名"
        },
        {
          validator: (rule, value, callback) => {
            if (value.trim().length > 36) {
              callback("系统名不能超过36个字符");
            }

            if (value.trim().length < 1) {
              callback("请输入系统名");
            }

            const hasIPList = Array.isArray(this.params.dispatchclients) ? this.params.dispatchclients.map(item => item.name) : [];
            if (hasIPList.includes(value.trim())) {
              callback("系统名不能重复");
            }

            callback();
          }
        }
      ],
      clientAddr: [
        {
          required: true, message: "请输入IP地址"
        },
        {
          validator: (rule, value, callback) => {

            if (isIp(value)) {
              callback();
            }

            callback("请正确输入IP");
          }
        }
      ]
    };
    return {
      serveType: "UP",
      params: {
        enablereport: true,
        reportserveraddr: "",
        dispatchclients: [],
        enabledispatch: false,
      },
      reportParams: {
        enableReport: false,
        reportServerAddr: ""
      },
      dispatchConfig: {
        enableDispatch: false,
      },

      tableLoading: false,
      dataList: [],
      columns: [{
        title: "子系统名称",
        key: "name",
      }, {
        title: "IP地址",
        key: "clientAddr",
      }, {
        title: "备注",
        key: "comment",
      }, {
        title: "操作",
        key: "",
        render: (h, { row }) => {
          return (<div>
            <btn-edit onClick={() => this.handleEdit(row)} />
            <btn-del onClick={() => this.handleDelete(row)} />
          </div>)
        }
      }],
      current: 0,
      total: 0,

      currentLinks: {},
      singleAddVisible: false,
      systemInfo: {
        name: "",
        clientAddr: "",
        comment: ""
      }
    };
  },
  computed: {
    isUp() {
      return this.serveType === "UP";
    },
    submitAbled() {
      return false;
    },
    title() {
      return (this.currentLinks.update ? "编辑" : "添加") + "子系统信息";
    }
  },
  watch: {
    current() {
      this.getDispatchList();
    },
    singleAddVisible(val) {
      if (!val) {
        this.currentLinks = {};
      }
    }
  },
  created() { },
  mounted() {
    this.getIpReportConfigs();
    this.getDispathConfig();
  },
  methods: {
    getIpReportConfigs() {
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/ipreportconfigs" }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {
          const [{ enableReport, reportServerAddr, links }] = data;
          this.reportParams.enableReport = enableReport;
          this.reportParams.reportServerAddr = reportServerAddr;
          this.reportParamsLinks = links;
        }
      })
    },
    handleSubmitReport(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const params = this.reportParams;
          this.$put({ url: this.reportParamsLinks.update, params }).then(() => {
            this.$$success("保存成功");
          }).catch(err => {
            this.$$error(err.response.data.message);
          })
        }
      });
    },

    getDispathConfig() {
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/ipdispatchconfigs" }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {
          const [{ enableDispatch }] = data;
          this.dispatchConfig.enableDispatch = enableDispatch;
        }
      })
    },

    handleChangeDispatchConfig() {
      const params = this.dispatchConfig;
      this.$put({ url: "/apis/linkingthing.com/ipam/v1/ipdispatchconfigs/ipdispatchconfigid", params }).then(() => {
        this.$Message.success("切换成功");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      })
    },

    getDispatchList() {
      const params = {
        page_size: 10,
        page_num: this.current
      }
      this.tableLoading = true;
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/ipdispatchconfigs/ipdispatchconfigid/dispatchclients", params })
        .then(({ data, pagination }) => {
          this.dataList = data;
          this.total = pagination.total;
        }).finally(() => {
          this.tableLoading = false;
        })
    },
    handleEdit({ links, clientAddr, name, comment }) {
      this.singleAddVisible = true;
      this.systemInfo.clientAddr = clientAddr;
      this.systemInfo.name = name;
      this.systemInfo.comment = comment;
      this.currentLinks = links;
    },
    handleDelete({ links }) {
      this.$Modal.confirm({
        title: "删除提示",
        content: "请再次确定是否删除该记录？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(() => {
            this.getDispatchList()
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          })
        }
      });
    },

    handleOpenSingleAdd() {
      this.$refs.form.resetFields();
      this.singleAddVisible = true;

    },
    handleSaveSystemInfo(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const params = this.systemInfo;

          if (this.currentLinks.update) {
            this.$put({ url: this.currentLinks.update, params }).then(() => {
              this.$Message.success("更新成功");
              this.singleAddVisible = false;
              this.getDispatchList();
            }).catch(err => {
              this.$Message.error(err.response.data.message);
            })
          } else {
            this.$post({ url: "/apis/linkingthing.com/ipam/v1/ipdispatchconfigs/ipdispatchconfigid/dispatchclients", params }).then(() => {
              this.$Message.success("创建成功");
              this.singleAddVisible = false;
              this.getDispatchList();
            }).catch(err => {
              this.$Message.error(err.response.data.message);
            })
          }

        }
      });
    },

    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const url = this.params.links ? this.params.links.self : "/apis/linkingthing.com/ipam/v1/ipdispatchconfigs";
          const params = this.params;
          this[this.submitType]({ url, params }).then(() => {
            this.$Message.success("保存成功");
            this.getDataList();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.system-linkage {
  padding-top: 60px;
  .system-linkage-content {
    width: 1180px;
    margin: 20px auto;
    height: 20px;
    .proccess-bar {
      display: flex;
      background-color: #f5f5f5;
      height: 170px;
      padding: 0 70px;
      .proccess-bar-item {
        padding: 40px 0 30px;
        color: #333;
        font-size: 14px;
        text-align: center;
        font-weight: bold;
        img {
          margin-bottom: 20px;
        }
      }
      .proccess-bar-line {
        flex: 1;
        display: flex;
        letter-spacing: 20px;
        line-height: 80px;
        padding-left: 41px;
        .proccess-bar-line-mark {
          letter-spacing: 3px;
          width: 41px;
          line-height: 20px;
          padding: 20px 0;
        }
      }
    }

    .system-linkage-tab {
      margin: 36px auto 20px;
      padding: 2px;
      background-color: #e6e6e6;
      height: 40px;
      width: 332px;
      border-radius: 6px;
      display: flex;
      justify-content: space-around;
      .system-linkage-tab-item {
        width: 163px;
        height: 36px;
        border-radius: 6px;
        font-size: 14px;
        text-align: center;
        font-weight: bold;
        color: #777;
        padding: 5px;
        line-height: 26px;
        cursor: pointer;
      }
      .system-linkage-tab-active {
        background: #ffffff;
        color: #333;
      }
    }
    .line {
      position: relative;
      height: 1px;
      background: radial-gradient(
        ellipse farthest-corner at 50% 50%,
        #ccc,
        #ddd 50%,
        #fff
      );
    }
    .center-form {
      width: 332px;
      margin: 30px auto;
    }
  }

  .enabledispatch {
    .ivu-form-item-content {
      margin-top: 35px;
      margin-left: 0 !important;
    }
    .enabledispatch-action {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      & > * {
        width: 48%;
        display: block;
        .ivu-upload-select,
        .ivu-btn {
          display: block;
          width: 100%;
        }
      }
    }
    .enabledispatch-show {
      height: 225px;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 4px 8px;
      overflow: auto;
      .ivu-tag {
        height: auto;
      }
    }
  }
}
</style>