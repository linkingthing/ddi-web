<template>
  <div class="address-plan-subnet">
    <IviewLoading v-if="loading" />

    <table-page 
      :data="tableData"
      :pagination-enable="false"
      :columns="columns"  
    > 
      <template slot="top-left">
        <Select
          v-for="(tag, idx) in tags"
          :key="idx"
          v-model="options[idx]"
          @on-change="handleSelect">
          <Option 
            v-for="item in tag" 
            :value="item.value" 
            :key="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </template>

      <template slot="top-right">
        <Button 
          type="primary" 
          @click="handleFilter" 
          class="top-button"
        >
          筛选
        </Button>
      </template>
    </table-page>
  </div>
</template>

<script>
import { columns } from "./define";

export default {
  data() {
    return {
      loading: false,
      url: this.$getApiByRoute().url,
      options: [],
      tags: [],
      columns: columns(this),
      tableData: [],
      source: [],
      showCreatePool: false,
      currentSubnet: null
    };
  },

  async mounted() {
    await this.getSegmentTags();

    this.getData();
  },

  methods: {
    handleSelect() {

    },

    handleFilter() {

    },

    async getSegmentTags() {
      try {
        let res = await this.$get({ url: this.url.replace("subnets", "segments") });

        this.tags = res.sort((a,b) => a.index - b.index)
          .filter(item => item.tags && item.tags.length)
          .map(item => item.tags.map(tag => ({ 
            label: tag, 
            value: tag
          })));
          
        this.tags.forEach(tag => {
          tag.unshift({ label: "全部标识", value: "all" });

          this.options.push("all");
        });

        console.log(this.tags);
        
      } 
      // eslint-disable-next-line no-empty
      catch (error) {}
    },

    async getData() {
      let res = await this.$get({ url: this.url });
      
      this.source = [...res];
      this.tableData = res;
    },

    handleViewPool() {
      
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>