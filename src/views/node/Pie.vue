<template>
  <Chart
    v-if="values.length"
    :options="options"
  />
  <NoDataFigure v-else />

</template>

<script>
import Chart from "./Chart";
import NoDataFigure from "./NoDataFigure";

export default {
  name: "ChartLine",
  props: {
    values: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: { Chart, NoDataFigure },
  computed: {
    options() {
      const labels = this.values.map(item => item.name);
      return {
        color: ["#19be6b", "#4089FF", "#FECD5D", "#FD8F64"],

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: 10,
          bottom: "center",
          data: labels
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            center: [130, "center"],

            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.values
          }
        ]
      };
    }
  }
};
</script>
