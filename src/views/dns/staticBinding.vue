<template>
  <div class="index-main t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">静态绑定</span>
      <div class="button-box fr">
        <!-- <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig(0)">新增</i-button> -->
      </div>
    </div>
    <div class="table-box pr" style="padding-bottom:0;">
      <!-- <div class="query-box" slot="extra">
                <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig(0)">新增</i-button>
      </div>-->
      <div class="condition">
        <Form :label-width="80" label-position="left">
          <Row>
            <Col span="5">
              <form-item label="子网:" :label-width="50" class="mt10">
                <i-select size="large">
                  <i-option value="人事部">人事部</i-option>
                </i-select>
              </form-item>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="tab-select select2">
        <Tabs type="card" v-model="tabName" :animated="false">
          <tab-pane label="IPv4租约表">
            <div class="table-box">
              <div class="table-s">
                <table class="table-default">
                  <thead>
                    <tr>
                      <th width="260">MAC</th>
                      <th width="387">IP</th>
                      <th width="190">剩余时间(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>00:0c:29:65:2a:e6</td>
                      <td>192.168.1.2</td>
                      <td>7200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Page
                show-sizer
                :page-size="20"
                :page-size-opts="[10, 20, 30]"
                :total="100"
                show-total
                show-elevator
                placement="top"
              />
            </div>
          </tab-pane>
          <tab-pane label="IPv6租约表">
            <div class="table-box">
              <div class="table-s">
                <table class="table-default">
                  <thead>
                    <tr>
                      <th width="260">MAC/UUID</th>
                      <th width="387">IP</th>
                      <th width="190">剩余时间(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>00:0c:29:65:2a:e6</td>
                      <td>240c:ffee::7</td>
                      <td>7200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Page
                show-sizer
                :page-size="20"
                :page-size-opts="[10, 20, 30]"
                :total="100"
                show-total
                show-elevator
                placement="top"
              />
            </div>
          </tab-pane>
        </Tabs>
      </div>
    </div>
    <div class="table-box">
      <div class="condition">
        <Form :label-width="80" label-position="left">
          <Row>
            <Col span="12">
              <form-item label="静态绑定列表" :label-width="100" class="mtb"></form-item>
            </Col>
            <Col span="12">
              <form-item :label-width="100" class="mtb">
                <i-button
                  type="primary"
                  class="me-button add-btn fr"
                  icon="md-add"
                  @click="goConfig('IPv4新增')"
                >新增</i-button>
              </form-item>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="table-s">
        <table class="table-default">
          <thead>
            <tr>
              <th width="360">MAC/UUID</th>
              <th width="378">IPv4地址</th>
              <th width="378">IPv6地址</th>
              <th width="378">租约时间(s)</th>
              <th width="370">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>00:0c:29:65:2a:e6</td>
              <td>192.168.1.2</td>
              <td>240c:ffee::7</td>
              <td>7200</td>
              <td>
                <i-button class="k-btn" @click="goConfig(1)">修改</i-button>
                <i-button class="k-btn" @click="delect">删除</i-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Page
        show-sizer
        :page-size="20"
        :page-size-opts="[10, 20, 30]"
        class="mb10"
        :total="100"
        show-total
        show-elevator
      />
    </div>
    <static-binding-config ref="configRef"></static-binding-config>
  </div>
</template>

<script>
import staticBindingConfig from "@/components/StaticBindingConfig";

export default {
  name: "staticBinding",
  data() {
    return {
      tabName: 0,
      tabName2: 0
    };
  },
  methods: {
    goConfig(type) {
      let title = "静态绑定新增";

      if (type == "1") {
        title = "静态绑定修改";
      }
      this.$refs.configRef.openModel({
        title
      });
    },
    delect() {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          this.$Message.success("删除成功");
        }
      });
    }
  },
  components: {
    staticBindingConfig
  }
};
</script>

<style lang="less">
.condition {
  text-align: left;
  .ivu-form-item-label {
    font-size: 14px;
  }
}
</style>
<style lang="less" scoped>
@import "@/assets/less/base";
.tab-select {
  padding: 0;
  margin-top: 0;
}
.me-button {
  margin-right: 0;
}
.query-box {
  position: absolute;
  right: 30px;
  top: 75px;
  z-index: 9;
  &.query-box2 {
    top: -5px;
  }
}
.mtb {
  margin-top: 3px;
  margin-bottom: 5px;
}
</style>

