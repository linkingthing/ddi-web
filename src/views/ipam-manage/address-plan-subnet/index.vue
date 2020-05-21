<template>
  <div class="address-plan-subnet">
    <IviewLoading v-if="loading" />

    <table-page 
      :is-padding-top="true"
      :data="tableData"
      :columns="columns"  
    > 
      <template slot="top-right">
        <Select
          v-for="(tag, idx) in tags"
          :key="idx"
          v-model="options[idx]">
          <Option 
            v-for="item in tag" 
            :value="item.value" 
            :key="item.label"
          >
            {{ item.label }}
          </Option>
        </Select>

        <Button 
          type="primary" 
          @click="handleFilter" 
          class="top-button button-filter"
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
    handleFilter() {
      this.tableData = this.source.filter(({ tagArr }) => {
        let isFit = true;

        this.options.forEach((item, i) => {
          if (item !== "all" && item !== tagArr[i]) {
            isFit = false;
          }
        });

        return isFit;
      });
    },

    async getSegmentTags() {
      try {
        let res = await this.$get({ url: this.url.replace("subnets", "segments") });

        this.tags = res.sort((a,b) => a.index - b.index)
          .filter(({ tags }) => tags && tags.length)
          .map(({ tags }) => tags.map(tag => ({ 
            label: tag, 
            value: tag
          })));
          
        this.tags.forEach(tag => {
          tag.unshift({ label: "全部标识", value: "all" });

          this.options.push("all");
        });        
      } 
      // eslint-disable-next-line no-empty
      catch (error) {}
    },

    async getData() {
      let res = await this.$get({ url: this.url });

      res.map(item => {
        let tagArr = item.tags.split(",");

        item.tags = tagArr.join("-");
        item.tagArr = tagArr;

        return item;
      });
      
      this.source = [...res];
      this.tableData = res;
    },

    handleViewPool() {
      this.$router.push({
        name: "subnet-pool-subnet"
      });
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>