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
            style="width: 140px"
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
            style="width: 140px"
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
            style="width: 140px"
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
            style="width: 200px"
          />

        </FormItem>
        <Button type="default">搜索</Button>

      </Form>
    </div>
    <div class="search-operate">
      <Button type="primary">忽略</Button>
      <Button type="primary">已处理</Button>
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
}
</style>