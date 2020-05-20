<template>
  <div class="third-step">
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
          v-model="options[idx]">
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
          class="top-button button-add"
        >
          筛选
        </Button>
      </template>
    </table-page>

    <create-pool
      :visible.sync="showCreatePool"
      :data="currentSubnet"
      :subnet="currentSubnet.network"
      :tags="currentSubnet.tags"
      @completed="handleJumpToPool"
    />
  </div>
</template>

<script>
import CreatePool from "./create-pool";
import { columns } from "./define";

export default {
  components: {
    "create-pool": CreatePool
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
      currentSubnet: {}
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
      } 
      // eslint-disable-next-line no-empty
      catch (error) {}
    },

    async getData() {
      let res = await this.$get({ url: `${this.url}/${this.layoutId}/subnets` });
      
      this.source = [...res];
      this.tableData = res;
    },

    handleJumpToPool() {
      
    },

    handleCreatePool(res) {
      this.showCreatePool = true;
      this.currentSubnet = res;
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>