<template>
  <Chart :options="options"></Chart>
</template>

<script>
import Chart from "./Chart";

export default {
  name: "ChartLine",
  props: {
    labels: {
      type: Array,
      default: () => {
        return [];
      }
    },
    values: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: { Chart },
  computed: {
    options() {
      return {
        color: "#f80",
        grid: {
          left: "25px",
          right: "20px",
          top: "20px",
          bottom: "20px"
        },
        xAxis: {
          type: "category",
          data: this.labels,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            color: "#D3D3D3"
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#D3D3D3",
              type: "dotted"
            }
          },
          minorTick: {
            show: false
          }
        },
        tooltip: {
          // show: true,
          trigger: "axis"
        },
        series: [
          {
            data: this.values,
            type: "line",
            smooth: true,
            lineStyle: { color: "#7BB0FF", width: 2 }, // 47B3FF
            itemStyle: {
              borderWidth: 4,
              borderColor: "#7BB0FF"
            },
            areaStyle: {
              color: {
                type: "linear",
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#47B3FF" // 0% 处的颜色
                  },
                  {
                    offset: 0.1,
                    color: "rgba(71, 179, 255, 0.6)" // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#fff"
                  }
                ]
              }
            }
          }
        ]
      };
    }
  }
};
</script>
