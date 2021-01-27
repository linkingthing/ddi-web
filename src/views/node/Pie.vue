<template>
  <Timeout
    v-if="isTimeOut"
    style="height: 312px;"
  />

  <Chart
    v-else-if="values.length"
    :options="options"
  />
  <NoDataFigure v-else />

</template>

<script>
import Chart from "./Chart";
import NoDataFigure from "./NoDataFigure";
import Timeout from "@/components/Timeout";

export default {
  name: "ChartLine",
  props: {
    isTimeOut: {
      type: Boolean,
      default: false
    },
    values: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: { Chart, NoDataFigure, Timeout },
  computed: {
    options() {
      const innerValue = this.values; // [...this.values, { name: "rrr", value: 1.1 }, { name: "www", value: 22 }];
      const labels = innerValue.map(item => `${item.name}`);

      // 图例换行，2个一排
      const formarLabel = [];
      labels.forEach((item, index) => {
        formarLabel.push(item)
        if ((index % 2)) {
          formarLabel.push("\n");
        }
      })


      const count = innerValue.reduce((prev, result) => Number(result.value) + Number(prev), 0);

      return {
        color: ["#1171E7", "#0DDE79", "#F21B62", "#F1D90B", "#F79F14", "#6F20FF", "#20CDFF", "#B8E115", "#A24C22", "#D323FF", "#317EAA", "#C8A025", "#2994AB", "#B3B3B3"],

        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b}: {d}%"  // {c} ({d}%) // 这种方式是以当前高亮集合的占比
          formatter: function (a) {
            return `${a.seriesName}<br/> ${a.name}: ${((a.value / count * 100) || 0).toFixed(2)}%`;
          }
        },
        legend: {
          orient: "horizontal",
          left: 320,
          bottom: "center",
          data: formarLabel,
          itemGap: 20,
          formatter: function (item) {
            return `{block|${item}}`
          },
          textStyle: {
            rich: {
              block: {
                width: 80
              }
            }
          }
        },
        series: [
          {
            name: "解析类型",
            type: "pie",
            center: [200, "center"],

            radius: [72, 86],
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
            data: innerValue
          }
        ]
      };
    }
  }
};
</script>
