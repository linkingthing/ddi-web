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
            <Option value="cpuUsedRatio">CPU使用率</Option>
            <Option value="memoryUsedRatio">内存使用率</Option>
            <Option value="haTrigger">Ha主备份切换</Option>
            <Option value="nodeOffline">节点离线</Option>
            <Option value="dnsoffline">DNS服务离线</Option>
            <Option value="dhcpoffline">DHCP服务离线</Option>
            <Option value="qps">QPS</Option>
            <Option value="lps">LPS</Option>
            <Option value="subnetUsedRatio">地址池使用率</Option>
            <Option value="storageUsedRatio">硬盘使用率</Option>
          </Select>

        </FormItem>
        <FormItem
          prop="label"
          label="告警类型"
        >
          <Select
            v-model="searchParams.label"
            class="m-select"
            placeholder="请选择告警类型"
            clearable
          >
            <Option value="critical">严重告警</Option>
            <Option value="major">一般告警</Option>
            <Option value="minor">次要告警</Option>
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
            <Option value="cpuUsedRatio">已处理</Option>
            <Option value="memoryUsedRatio">已处理</Option>
            <Option value="haTrigger">已忽略</Option>
          </Select>

        </FormItem>
        <FormItem
          prop="creationTimestamp"
          label="告警时间"
        >
          <DatePicker
            :value="searchParams.creationTimestamp"
            format="yyyy/MM/dd"
            type="daterange"
            placement="bottom-end"
            placeholder="Select date"
            class="m-date"
          />

        </FormItem>
        <Button type="default">搜索</Button>

      </Form>
    </div>
    <div class="search-operate">
      <Button type="primary" @click="$emit('on-mutiple', {state:'ignored'})">忽略</Button>
      <Button type="primary" @click="$emit('on-mutiple', {state:'solved'})">已处理</Button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      searchParams: {

      }
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
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