<template>
  <chart :options="options" style="width:100%;height:400px"></chart>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    values: {
      type: Object,
      default() {
        return {
          name: String,
          value: String,
          type: String
        };
      }
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
            name: val.type,
            type: "gauge",
            detail: { formatter: "{value}%" },
            data: [{ value: val.value, name: val.name }]
          }
        ]
      };
    }
  },
  methods: {}
};
</script>
