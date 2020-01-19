<template>
  <chart :options="options" style="width:100%;height:400px"></chart>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    labels: {
      type: Array,
      default() {
        return [];
      }
    },
    values: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    options() {
      return {
        xAxis: {
          type: "category",
          data: this.labels
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.values,
            type: "line"
          }
        ]
      };
    }
  }
};
</script>
