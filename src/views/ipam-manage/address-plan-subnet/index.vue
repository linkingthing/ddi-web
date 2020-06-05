<template>
  <div class="address-plan-subnet">
    <IviewLoading v-if="loading" />

    <table-page 
      :is-padding-top="true"
      :data="tableData"
      :columns="columns"  
      :total="tableData.length"
      :current.sync="currentPage"
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
      currentSubnet: null,
      currentPage: 1
    };
  },

  async mounted() {
    await this.getSegmentTags();

    this.getData();
  },

  methods: {
    async handleFilter() {
      this.currentPage = 1;

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
        let { data } = await this.$get({ url: this.url.replace("plannedsubnets", "segments") });

        this.tags = data.sort((a,b) => a.index - b.index)
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
      catch (err) {
        this.$handleError(err);
      }
    },

    async getData() {
      try {
        let { data } = await this.$get({ url: this.url });

        data.map(item => {
          let tagArr = item.tags.split(",");

          item.tags = tagArr.join("-");
          item.tagArr = tagArr;

          return item;
        });
      
        this.source = [...data];
        this.tableData = data;
      } catch (err) {
        this.$handleError(err);
      }
    },

    async handleDHCP(row) {
      try {        
        let { data } = await this.$get(this.$getApiByRoute(`/address/dhcp/subnets?ipnet=${row.ipnet}`));
        
        if (data.length) {
          this.$router.push({
            name: "address-pool-list",
            params: {
              id: data[0].id
            },
            query: {
              ipnet: row.ipnet,
              address: row.ipnet,
              tags: row.tags
            }
          });
        }
        else {
          this.$router.push({
            name: "subnet-pool-subnet",
            query: {
              ipnet: row.ipnet,
              tags: row.tags
            }
          });
        }
      } catch (err) {
        this.$handleError(err);
      }
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