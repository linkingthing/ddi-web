<template>
  <div class="ip-assets-manage">
    <IviewLoading v-if="loading" />

    <table-page
      :data="tableData"
      :columns="columns"
      :total="tableData.length"
      :is-padding-top="true"
    >
      <template slot="top-left">
        <div class="condition-item">
          <label class="condition-item-label">MAC</label>
          <Input
            v-model="condition.mac"
            placeholder="请输入MAC地址"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">IP地址</label>
          <Input
            v-model="condition.ip"
            placeholder="请输入IP地址"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">终端名称</label>
          <Input
            v-model="condition.name"
            placeholder="请输入终端名称"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">交换机名称</label>
          <Input
            v-model="condition.switchName"
            placeholder="请输入交换机名称"
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
        <!-- <Button
          class="top-button"
          @click="showAdvance = true"
        >
          高级搜索
        </Button> -->

        <Button
          v-if="$store.getters.hasPermissionToCreate"
          type="primary"
          @click="handleAdd"
          class="top-button"
        >
          新建
        </Button>
      </template>
    </table-page>

    <Edit
      :visible.sync="showEdit"
      :data="currentData"
      @saved="handleSaved"
    />

    <AdvancedSearch
      :visible.sync="showAdvance"
      @comfirmed="handleAdvancedQuery"
    />
  </div>
</template>

<style lang="less">
@import "index.less";
</style>

<script>
import Edit from "./edit";
import AdvancedSearch from "./advanced-query";

import { columns, deviceTypes } from "./define";

import { ipv4IsValid } from "@/util/common";

export default {
  components: {
    Edit,
    AdvancedSearch
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      deviceTypes: [{ text: "全部", label: "全部" }, ...deviceTypes],
      condition: {
        mac: "",
        deviceType: "全部"
      },
      tableData: [],
      columns: columns(this),
      showAdvance: false,
      showEdit: false,
      currentData: null
    };
  },

  async mounted() {
    this.handleQuery();

    const {
      id,
      ip,
      mac,
      switchName,
      switchPort,
      computerRack,
      computerRoom,
      subnetId,
      vlanId
    } = this.$route.query;

    this.currentData = {
      mac,
      switchName,
      switchPort,
      computerRack,
      computerRoom,
      ip,
      subnetId,
      vlanId
    };

    if (id) {
      try {
        let data = await this.$get({ url: this.url + "/" + id });

        this.currentData = {
          ...data,
          ...this.currentData
        };

        this.currentData.shouldRegister = true;

      } catch (err) {
        this.$handleError(err);
      }
    } else {
      if (ip) {
        if (ipv4IsValid(ip)) {
          this.currentData.ipv4s = [ip];
        } else {
          this.currentData.ipv4s = [ip];
        }
      }

    }

    if (mac) {
      this.showEdit = true;
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

      if (params.ip) {
        if (ipv4IsValid(params.ip)) {
          params.ipv4 = params.ip;
        } else {
          params.ipv6 = params.ip;
        }
      }

      if (params.switchName) {
        params.switch_name = params.switchName;
      }

      this.loading = true;

      try {
        let { url, condition } = this;

        let { deviceType } = condition;

        if (deviceType === "全部") {
          deviceType = "";
        }

        let { data } = await this.$get({ url: this.$formatQuerys({ ...params, deviceType }, url) });

        this.tableData = data.map(item => {
          const type = deviceTypes.find(({ label }) => label === item.deviceType);

          item.deviceTypeText = type ? type.text : "";

          return item;
        });
      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    },

    handleAdd() {
      this.showEdit = true;
      this.currentData = null;
    },

    handleEdit(res) {
      this.showEdit = true;
      this.currentData = { ...res };
    },

    handleSaved() {
      this.handleQuery();
    },

    async handleDelete({ id }) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        this.loading = true;

        await this.$delete({ url: this.url + "/" + id });

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