<template>
  <div class="search-bar">
    <div class="search-form">
      <Form
        ref="formInline"
        :model="searchParams"
        :label-width="60"
        :label-colon="true"
        inline
      >
        <FormItem
          prop="name"
          label="记录名称"
          :label-width="100"
        >
          <Input
            v-model="searchParams.name"
            placeholder="请输入记录名称"
            class="m-select"
            clearable
          />

        </FormItem>
        <FormItem
          prop="rr_type"
          label="类型"
        >
          <Select
            v-model="searchParams.rr_type"
            class="m-select"
            placeholder="请选择类型"
            clearable
          >
            <Option
              :value="item"
              v-for="item in Object.keys(rrType)"
              :key="item"
            >{{rrType[item]}}</Option>
            <Option value="SOA">SOA</Option>
          </Select>

        </FormItem>
        <FormItem
          prop="enabled"
          label="启用"
        >
          <Select
            v-model="searchParams.enabled"
            class="m-select"
            clearable
          >
            <Option value="true">开启</Option>
            <Option value="false">停用</Option>
          </Select>

        </FormItem>
        <FormItem
          prop="rdata"
          label="记录值"
        >
          <Input
            v-model="searchParams.rdata"
            class="m-select"
            placeholder="请输入记录值"
          />
        </FormItem>
        <FormItem
          prop="comment"
          label="备注"
        >
          <Input
            v-model="searchParams.comment"
            class="m-select"
            placeholder="请输入备注"
          />
        </FormItem>
        <btn-search @click="$emit('on-search', searchParams)" />

      </Form>
    </div>
    <div class="search-operate">
      <slot />
    </div>
  </div>
</template>

<script>
import { zoneType, role, rrType } from "@/config/dns";

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
    this.rrType = rrType;

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