<template>
  <div class="search-bar">
    <div class="search-form">
      <Form
        ref="formInline"
        :model="searchParams"
        :label-colon="true"
        inline
      >
        <FormItem
          prop="name"
        
        >
          <Input
            v-model="searchParams.name"
            placeholder="请输入视图名称"
            clearable
          />

        </FormItem>
     
        <btn-search @click="$emit('on-search', searchParams)" />

      </Form>
    </div>
    <div class="search-operate">
      <slot name="operate" />
    </div>
  </div>
</template>

<script>
import { zoneType, role } from "@/config/dns";

export default {
  components: {},
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.zoneType = zoneType;
    this.role = role;

    return {
      initDateArr: [],
      searchParams: {

      }
    };
  },
  computed: {},
  watch: {
    params: {
      immediate: true,
      deep: true,
      handler(val) {
        this.searchParams = val;
        if (val.from && val.to) {
          this.initDateArr = [val.from, val.to];
        }
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleClear() {
      this.searchParams.from = undefined;
      this.searchParams.to = undefined;
    }
  }
};
</script>

<style lang="less" scoped>
.search-bar {
  display: flex;
  margin-top: 14px;
  .search-form {
    flex: 1;
    .ivu-form-item {
      margin-right: 0 !important;
      margin-bottom: 0 !important;
    }
  }
  .search-operate {
    & > * {
      margin-left: 10px;
    }
  }
  .m-select {
    width: 140px;
  }
  .m-date {
    width: 200px;
  }
}

@media screen and(min-width: 1000px) and(max-width: 1520px) {
  .search-bar {
    .m-select {
      width: 110px;
    }
    .m-date {
      width: 110px;
    }
  }
}
</style>