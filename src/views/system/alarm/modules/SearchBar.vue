<template>
  <div class="search-bar">
    <div class="search-form">
      <Form
        ref="formInline"
        :model="searchParams"
        :label-width="80"
        inline
      >
        <FormItem
          prop="name"
          label="告警项"
        >
          <Select
            v-model="searchParams.name"
            placeholder="请选择告警项"
            class="m-select"
            clearable
          >
            <Option
              :value="item"
              v-for="item in Object.keys(alarmConfig)"
              :key="item"
            >{{alarmConfig[item]}}</Option>
          </Select>

        </FormItem>
        <FormItem
          prop="label"
          label="告警级别"
        >
          <Select
            v-model="searchParams.level"
            class="m-select"
            placeholder="请选择告警类型"
            clearable
          >
            <Option
              :value="item"
              v-for="item in Object.keys(alarmLevel)"
              :key="item"
            >{{alarmLevel[item]}}</Option>
          </Select>

        </FormItem>
        <FormItem
          prop="state"
          label="告警状态"
        >
          <Select
            v-model="searchParams.state"
            class="m-select"
            clearable
          >
            <Option
              :value="item"
              v-for="item in Object.keys(alarmState)"
              :key="item"
            >{{alarmState[item]}}</Option>
          </Select>

        </FormItem>
        <FormItem
          prop="creationTimestamp"
          label="告警时间"
        >
          <DatePicker
            format="yyyy-MM-dd"
            type="daterange"
            placement="bottom-end"
            placeholder="起止时间"
            class="m-date"
            @on-change="handleDateChange"
          />

        </FormItem>
        <Button
          type="default"
          @click="$emit('on-search', searchParams)"
        >搜索</Button>

      </Form>
    </div>
    <div class="search-operate">
      <Button
        type="primary"
        @click="$emit('on-mutiple', {state:'ignored'})"
      >忽略</Button>
      <Button
        type="primary"
        @click="$emit('on-mutiple', {state:'solved'})"
      >已处理</Button>
    </div>
  </div>
</template>

<script>
import { alarmConfig, alarmLevel, alarmState } from "@/dictionary";

export default {
  components: {},
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.alarmConfig = alarmConfig;
    this.alarmLevel = alarmLevel;
    this.alarmState = alarmState;
    return {
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
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleDateChange([from, to]) {
      if (from) {
        this.searchParams.from = from;
        this.searchParams.to = to;
      } else {
        delete this.searchParams.from;
        delete this.searchParams.to;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.search-bar {
  display: flex;
  .search-form {
    flex: 1;
  }
  .search-operate {
  }
  .m-select {
    width: 140px;
  }
  .m-date {
    width: 200px;
  }
}

@media screen and(min-width: 1200px) and(max-width: 1500px) {
  .search-bar {
    .m-select {
      width: 120px;
    }
    .m-date {
      width: 120px;
    }
  }
}
</style>