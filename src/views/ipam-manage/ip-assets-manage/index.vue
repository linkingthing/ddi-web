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
            @on-enter="handleQuery" />
        </div>
        <div class="condition-item">
          <label class="condition-item-label">设备类型：</label>
          <Select
            style="width: 160px"
            v-model="condition.deviceType"
            @on-change="handleQuery"
          >
            <Option
              v-for="item in deviceTypes"
              :key="item.label"
              :value="item.label">{{item.text}}</Option>
          </Select>
        </div>

        <Button 
          type="primary" 
          @click="handleQuery" 
        >
          搜索
        </Button>
      </template>

      <template slot="top-right">
        <Button 
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
  </div>
</template>

<style lang="less">
@import "index.less";
</style>

<script>
import Edit from "./edit";

import { columns, deviceTypes } from "./define";

export default {
  components: {
    Edit
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      deviceTypes,
      condition: {
        mac: "",
        deviceType: "PC端"
      },
      tableData: [],
      columns: columns(this),
      showEdit: false,
      currentData: null
    };
  },

  async mounted() {    
    this.handleQuery();

    const { id, mac } = this.$route.query;

    if (id) {
      try {
        let data = await this.$get({ url: this.url + "/" + id });        

        this.currentData = data;
      } catch (err) {
        this.$handleError(err);
      }
    }
    else if (mac) {
      this.currentData = { mac };
    }

    if (mac) {
      this.showEdit = true;
    }
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      try {
        let { url, condition } = this;

        let { data } = await this.$get({ url: this.$formatQuerys(condition, url) });
        
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