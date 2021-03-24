<template>
  <div class="app-assets">

    <table-page
      :loading="loadingPage"
      :data="tableData"
      :columns="columns"
      :is-padding-top="true"
      :total="total"
      :current.sync="current"
    >
      <template slot="top-left">

        <div class="condition-item">
          <label class="condition-item-label">域名</label>
          <Input
            v-model="condition.domain"
            placeholder="请输入域名"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">双栈访问</label>
          <Select
            style="width: 160px"
            v-model="condition.support_double_stack"
            @on-change="handleQuery"
            clearable
          >
            <Option
              v-for="item in [{label: '支持',value: 'true'},{label: '不支持',value: 'false'}]"
              :key="item.label"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </div>

        <div class="condition-item">
          <label class="condition-item-label">服务模式</label>
          <Select
            style="width: 160px"
            v-model="condition.app_type"
            @on-change="handleQuery"
            clearable
          >
            <Option
              v-for="item in ['单机','负载均衡', '热备']"
              :key="item"
              :value="item"
            >{{item}}</Option>
          </Select>

        </div>
        <div class="condition-item">
          <label class="condition-item-label">运维人员</label>
          <Input
            v-model="condition.operate_support"
            placeholder="请输入运维人员"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">联系方式</label>
          <Input
            v-model="condition.phone_number"
            placeholder="请输入联系方式"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <btn-search
          type="primary"
          @click="handleQuery"
        >
          搜索
        </btn-search>
      </template>

      <template slot="top-right">

        <Button
          v-if="$hasPermissionCreate('networkequipment')"
          type="primary"
          @click="handleAdd"
          class="top-button"
        >
          新建
        </Button>
        <import-export-csv
          style="margin-left: 20px;"
          :links="links"
          @on-import-success="onImportSuccess"
          resource="资产"
        />

      </template>
    </table-page>

    <AppAssetsModal
      :visible.sync="showEdit"
      :links="paramsLinks"
      @success="handleQuery"
    />

  </div>
</template>

<script>
import AppAssetsModal from "./modules/app-assets-modal";



export default {
  components: {
    AppAssetsModal
  },

  data() {
    this.headers = {
      Authorization: this.$store.getters.token
    };
    return {
      url: this.$getApiByRoute().url,
      loading: false,
      condition: {
        domain: "",
        support_double_stack: "",
        app_type: "",
        operate_support: "",
        phone_number: "",
      },
      loadingPage: false,
      tableData: [],
      columns: [{
        title: "应用名称",
        key: "appname"
      }, {
        title: "域名",
        key: "domain"
      }, {
        title: "所属组织",
        key: "semantic"
      }, {
        title: "服务模式",
        key: "apptype"
      }, {
        title: "IPv4",
        key: "ipv4"
      }, {
        title: "IPv6",
        key: "ipv6"
      }, {
        title: "业务",
        key: "business"
      }, {
        title: "双栈访问",
        key: "supportdoublestack"
      }, {
        title: "运维人员",
        key: "operatesupport"
      }, {
        title: "联系方式",
        key: "phonenumber"
      }, {
        title: "备注",
        key: "remark"
      }, {
        title: "操作",
        key: "appname",
        width: 150,
        render: (h, { row }) => {
          return (
            <div>
              <btn-edit onClick={() => this.handleEdit(row)} />
              <btn-del onClick={() => this.handleDelete(row)} />
            </div>
          )
        }
      },],
      showAdvance: false,
      showEdit: false,
      showDetect: false,
      currentData: null,
      current: 0,
      total: 0,
      always: false,
      importVisible: false,
      links: {
        self: ""
      },
      paramsLinks: {},
      uploadParams: {
        name: ""
      },
      file: ""

    };
  },

  watch: {
    current() {
      this.handleQuery();
    }
  },

  methods: {
    handleAdvancedQuery(res) {
      this.queryData({
        ...this.condition,
        ...res
      });
    },

    handleQuery() {
      this.queryData();
    },

    async queryData(params = { ...this.condition }) {

      for (let item in params) {
        if (typeof params[item] === "undefined") {
          delete params[item];
        }
      }

      try {
        const aparams = {
          page_num: this.current,
          page_size: 10
        };
        this.loadingPage = true;
        let res = await this.$get({ url: this.$formatQuerys(params, this.url), params: aparams });

        this.tableData = res.data.map(item => {


          return item;
        });

        this.total = res.pagination.total;
        this.links = res.links;

        if (!Object.is(this.current, res.pagination.pageNum)) {
          this.current = res.pagination.pageNum;
        }
      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
        this.loadingPage = false;
      }
    },

    handleAdd() {
      this.paramsLinks = this.links;
      this.showEdit = true;
    },

    onImportSuccess() {
      this.current = 1;
      this.handleQuery();
    },

    handleEdit({ links }) {
      this.showEdit = true;
      this.paramsLinks = links;
    },

    handleDetect(res) {
      this.showDetect = true;
      this.currentData = { ...res };
    },

    handleSaved() {
      this.showCreate = false;

      this.handleQuery();
    },

    async handleDelete({ links }) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        this.loading = true;

        await this.$delete({ url: links.remove });

        this.$$success("删除成功！");

        this.handleQuery();
      }
      catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="less">
.app-assets {
  .top-left {
    display: flex;
    align-items: center;
    // height: 72px;
    // line-height: 72px;
    justify-content: flex-start;

    .ivu-input,
    .ivu-select {
      width: 140px;
      background: transparent;
      border-color: #cccccc;
      font-size: 14px;
    }

    .top-input {
      width: auto;
    }

    .condition-item {
      display: flex;
      align-items: center;
    }

    .condition-item-label {
      font-size: 14px;
      color: #333;
      white-space: nowrap;
      margin-right: 10px;
    }
  }
  .top-right {
    white-space: nowrap;
  }
}
</style>