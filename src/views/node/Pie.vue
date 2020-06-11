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
      const count = this.values.reduce((prev, result) => Number(result.value) + Number(prev), 0);

      return {
        color: ["#1171E7", "#0DDE79", "#F21B62", "#F1D90B", "#F79F14", "#6F20FF", "#20CDFF", "#B8E115", "#A24C22", "#D323FF", "#317EAA", "#C8A025", "#2994AB", "#B3B3B3"],

        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b}: {d}%"  // {c} ({d}%) // 这种方式是以当前高亮集合的占比
          formatter: function (a) {
            return `${a.seriesName}<br/> ${a.name}: ${(a.value / count * 100).toFixed(2)}%`;
          }
        },
        legend: {
          orient: "vertical",
          right: 10,
          bottom: "center",
          data: labels
        },
        series: [
          {
            name: "解析类型",
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
