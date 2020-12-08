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

      <div class="center-form">

        <Form
          :model="params"
          :label-width="110"
          :rules="rules"
          label-position="left"
          ref="form"
        >
          <template v-if="isUp">

            <FormItem
              label="启动上报服务"
              prop="enablereport"
              style="text-align:right"
            >
              <i-switch v-model="params.enablereport" />
            </FormItem>
            <FormItem
              label="上级系统IP地址"
              prop="reportserveraddr"
            >
              <Input
                :disabled="!params.enablereport"
                v-model="params.reportserveraddr"
                placeholder="请填写上级系统IP地址"
              ></Input>
            </FormItem>
          </template>
          <template v-else>
            <FormItem
              label="启动下发服务"
              prop="enabledispatch"
              style="text-align:right"
            >
              <i-switch v-model="params.enabledispatch" />
            </FormItem>

            <FormItem
              label="子系统信息"
              prop="enabledispatch"
              class="enabledispatch"
            >

              <div>
                <div class="enabledispatch-action">
                  <Button
                    type="primary"
                    size="small"
                    @click="handleOpenSingleAdd"
                    :disabled="!params.enabledispatch"
                  >单个添加</Button>
                  <Upload
                    action="//jsonplaceholder.typicode.com/posts/"
                    :before-upload="handleUpload"
                  >

                    <Button
                      type="primary"
                      ghost
                      size="small"
                      @click="handleBatchImport"
                      :disabled="!params.enabledispatch"
                    >批量导入</Button>
                  </Upload>
                </div>
                <div class="enabledispatch-show">
                  <ul>
                    <li
                      :key="item.id"
                      v-for="item in params.dispatchclients"
                    >
                      <Tag
                        closable
                        @on-close="handleDeleteSystemInfo(item)"
                      >

                        {{item.name}}, {{item.clientaddr}}
                      </Tag>
                    </li>
                  </ul>
                </div>
              </div>
            </FormItem>

          </template>

          <FormItem :label-width="0">
            <Button
              style="margin-top:40px"
              :disabled="submitAbled"
              type="primary"
              long
              @click="handleSubmit('form')"
            >确定</Button>
          </FormItem>

        </Form>
      </div>
    </div>

    <common-modal
      :visible.sync="singleAddVisible"
      :width="415"
      title="添加子系统信息"
      @confirm="handleSaveSystemInfo('systemInfo')"
    >
      <Form
        :model="systemInfo"
        :label-width="110"
        :rules="systemRules"
        label-position="left"
        ref="systemInfo"
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
          prop="clientaddr"
          style="text-align:right"
        >
          <Input v-model="systemInfo.clientaddr" />
        </FormItem>
      </Form>
    </common-modal>

  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    this.rules = {};
    this.systemRules = {};
    return {
      serveType: "UP",
      params: {
        enablereport: true,
        reportserveraddr: "",
        dispatchclients: [],
        enabledispatch: false
      },
      singleAddVisible: false,
      systemInfo: {
        name: "",
        clientaddr: ""
      }
    };
  },
  computed: {
    isUp() {
      return this.serveType === "UP";
    },
    submitAbled() {
      return false;
    }
  },
  watch: {},
  created() { },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      const url = "/apis/linkingthing.com/ipam/v1/ipdispatchconfigs";
      this.$get({ url }).then(({ data }) => {

        if (Array.isArray(data) && data.length) {
          this.submitType = "$put";
          this.params = data[0];
        } else {
          this.submitType = "$post";
        }
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    },
    handleOpenSingleAdd() {
      this.singleAddVisible = true;
    },
    handleSaveSystemInfo(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (Array.isArray(this.params.dispatchclients)) {
            this.params.dispatchclients.push({ ...this.systemInfo });
          } else {
            this.params.dispatchclients = [{ ...this.systemInfo }];
          }

          this.$nextTick().then(() => {
            this.$refs[name].resetFields();
            this.singleAddVisible = false;
          });
        }
      });
    },
    handleDeleteSystemInfo({ id }) {
      this.params.dispatchclients = this.params.dispatchclients.filter(item => item.id !== id);
    },
    handleUpload(file) {
      // console.log(file)
      // console.log(file.text())
      // file.text().then(text => {
      //   console.log(text)
      // })
      const reader = new FileReader();
      reader.readAsText(file, "utf-8");
      reader.onload = () => {
        const str = reader.result;
        const rows = str.split("\n");
        const [[name, clientaddr], ...data] = rows.map(item => item.split(",").map(i => i.trim())).filter(item => {
          return item.length >= 2;
        });

        const result = [];
        data.forEach(([aname, ip]) => {
          result.push({
            [name]: aname,
            [clientaddr]: ip
          });
        });
        this.params.dispatchclients.push(...result);
      };

    },
    handleBatchImport() { },
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
    width: 1000px;
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
    }
  }
}
</style>