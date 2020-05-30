<template>
  <div class="third-step">
    <IviewLoading v-if="loading" />

    <table-page 
      :data="tableData"
      :columns="columns"  
      :total="tableData.length"
      :table-outter-height="440"
      :current="currentPage"
    > 
      <template slot="top-right">
        <Select
          v-for="(tag, idx) in tags"
          :key="idx"
          v-model="options[idx]">
          <Option 
            v-for="item in tag" 
            :value="item.value" 
            :key="item.value"
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

    <!-- <create-pool
      :visible.sync="showCreatePool"
      :data="currentSubnet"
      :subnet="currentSubnet.network"
      :tags="currentSubnet.tags"
      @completed="handleJumpToPool"
    /> -->
  </div>
</template>

<script>
// import CreatePool from "./create-pool";
import { columns } from "./define";

export default {
  components: {
    // "create-pool": CreatePool
  },

  props: {
    layoutId: {
      type: String,
      default: ""
    },

    reset: {
      type: Boolean,
      default: false
    },
    
    url: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      loading: false,
      options: [],
      tags: [],
      tableData: [],
      columns: columns(this),
      source: [],
      showCreatePool: false,
      currentSubnet: {},
      currentPage: 1
    };
  },

  watch: {
    reset(val) {
      if (!val) return;

      this.doReset();

      this.$emit("update:reset", false);
    }
  },

  async mounted() {
    await this.getSegmentTags();

    this.getData();
  },

  methods: {
    doReset() {
      this.options = [];
      this.source = [];
    },

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

      this.currentPage = 1;
    },

    async getSegmentTags() {
      try {
        let { data } = await this.$get({ url: this.url + "/" + this.layoutId + "/segments" });

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
        let { data } = await this.$get({ url: `${this.url}/${this.layoutId}/plannedsubnets` });

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
              id: row.id
            },
            query: {
              ipnet: row.ipnet
            }
          });
        }
        else {
          this.$router.push({
            name: "subnet-pool-subnet",
            query: {
              ipnet: row.ipnet
            }
          });
        }
      } catch (err) {
        this.$handleError(err);
      }
    },

    handleCreatePool(res) {
      // this.showCreatePool = true;
      // this.currentSubnet = res;
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>