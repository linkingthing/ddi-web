<template>
  <div class="device-detect">

    <table-page
      :data="tableData"
      :columns="columns"
      :is-padding-top="true"
      :total="total"
      :current.sync="current"
    >
      <template slot="top-left">
        <div class="condition-item">
          <label class="condition-item-label">设备名称</label>
          <Input
            v-model="condition.name"
            placeholder="请输入设备名称"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">管理地址</label>
          <Input
            v-model="condition.administrationAddress"
            placeholder="请输入管理地址"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">设备类型</label>
          <Select
            style="width: 160px"
            v-model="condition.equipmentType"
            @on-change="handleQuery"
            clearable
          >
            <Option
              v-for="item in deviceTypes"
              :key="item.label"
              :value="item.label"
            >{{item.text}}</Option>
          </Select>
        </div>

        <div class="condition-item">
          <label class="condition-item-label">厂商</label>
          <Input
            v-model="condition.manufacturer"
            placeholder="请输入厂商"
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
          resource="设备"
        />

      </template>
    </table-page>

    <Edit
      :visible.sync="showEdit"
      :data="currentData"
      @saved="handleSaved"
    />

    <Detect
      :visible.sync="showDetect"
      :data="currentData"
      @saved="handleSaved"
    />

    <AdvancedSearch
      :visible.sync="showAdvance"
      @comfirmed="handleAdvancedQuery"
    />

  </div>
</template>

<script>
import Edit from "./edit";
import Detect from "./detect";
import AdvancedSearch from "./advanced-query";

import { columns, deviceTypes } from "./define";
import { downloadFile } from "@/util/common";


export default {
  components: {
    Edit,
    Detect,
    AdvancedSearch
  },

  data() {
    this.headers = {
      Authorization: this.$store.getters.token
    };
    return {
      url: this.$getApiByRoute().url,
      loading: false,
      deviceTypes,
      condition: {
        // name: "",
        // administrationAddress: "",
        // equipmentType: "",
        // manufacturer: ""
      },
      tableData: [],
      columns: columns(this),
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

      if (params.administrationAddress) {
        params.administration_address = params.administrationAddress;
      }

      if (params.equipmentType) {
        params.equipment_type = params.equipmentType;
      }


      Reflect.deleteProperty(params, "administrationAddress");
      Reflect.deleteProperty(params, "equipmentType");

      try {
        const aparams = {
          page_num: this.current,
          page_size: 10
        };
        let res = await this.$get({ url: this.$formatQuerys(params, this.url), params: aparams });

        this.tableData = res.data.map(item => {
          const equipmentType = deviceTypes.find(({ label }) => label === item.equipmentType);

          item.equipmentTypeText = equipmentType ? equipmentType.text : "";

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
      }
    },

    handleAdd() {
      this.currentData = null;
      this.showEdit = true;
    },

    onImportSuccess() {
      this.current = 1;
      this.handleQuery();
    },

    handleEdit(res) {
      this.showEdit = true;
      this.currentData = { ...res };
    },

    handleDetect(res) {
      this.showDetect = true;
      this.currentData = { ...res };
    },

    handleSaved() {
      this.showCreate = false;

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

<style lang="less">
@import "./index.less";
</style>