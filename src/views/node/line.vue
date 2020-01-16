<template>
  <chart :options="options" style="width:100%;height:400px"></chart>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    values: {}
  },
  computed: {
    options() {
      //   const val = this.values;
      return {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
    }
  }
};
</script>
