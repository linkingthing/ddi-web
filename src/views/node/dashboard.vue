<template>
  <chart :options="options" @click="handleClick" style="width:100%;height:400px"></chart>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    values: {
      centerName: String,
      value: String,
      name: String
    }
  },
  computed: {
    options() {
      const dashboardBaseConfig = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
          // 右上角工具
          // feature: {
          //   restore: {},
          //   saveAsImage: {}
          // }
        }
      };
      const val = this.values;
      return {
        ...dashboardBaseConfig,
        series: [
          {
            name: val.name,
            type: "gauge",
            detail: { formatter: "{value}%" },
            data: [{ value: val.value, name: val.centerName }]
          }
        ]
      };
    }
  },
  methods: {
    handleClick(e) {
      console.log(e);
    }
  }
};
</script>
