<template>
  <div class="search-bar">
    <div class="search-form">
      <Form
        ref="formInline"
        :model="searchParams"
        :label-width="85"
        :label-colon="true"
        inline
      >
        <FormItem
          prop="prefix"
          label="子网"
          :label-width="70"
        >
          <Input
            v-model="searchParams.prefix"
            placeholder="请输入子网"
            class="m-select"
            clearable
          />

        </FormItem>
        <FormItem
          prop="name"
          label="子网名称"
        >
          <Input
            v-model="searchParams.name"
            class="m-select"
            placeholder="请输入子网名称"
            clearable
          ></Input>
        </FormItem>
        <FormItem
          prop="networkType"
          label="子网类型"
          :label-width="85"
        >
          <Input
            v-model="searchParams.networkType"
            class="m-select"
            placeholder="请输入子网类型"
            clearable
          ></Input>
        </FormItem>
         <FormItem
          prop="business"
          label="业务"
          :label-width="60"
        >
          <Input
            v-model="searchParams.business"
            class="m-select"
            placeholder="请输入业务"
            clearable
          ></Input>
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
    padding: 0 26px;
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