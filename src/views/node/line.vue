<template>
  <Chart :options="options"></Chart>
</template>

<script>
import Chart from "./Chart";

const ThemeConfig = {
  blue: {
    primaryColor: "#47B3FF",
    gradualColor: "rgba(71, 179, 255, 0.6)"
  },
  purple: {
    primaryColor: "#A485FD",
    gradualColor: "rgba(164, 133, 253, 0.6)"
  },
  brown: {
    primaryColor: "#FAA888",
    gradualColor: "rgba(250, 168, 136, 0.6)"
  },
  golden: {
    primaryColor: "#FECD5D",
    gradualColor: "rgba(254, 205, 93, 0.6)"
  }
};
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
    },
    lineTheme: {
      type: String,
      default: "blue"
    }
  },
  components: { Chart },
  computed: {
    options() {
      const { primaryColor, gradualColor } =
        ThemeConfig[this.lineTheme] || ThemeConfig.blue;
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
        dataZoom: [
          //   {
          //     show: true,
          //     realtime: true,
          //     start: 0,
          //     end: 100
          // },
          // {
          //     type: 'inside',
          //     realtime: true,
          //     start: 65,
          //     end: 85
          // }
        ],

        series: [
          {
            data: this.values,
            type: "line",
            smooth: true,
            lineStyle: { color: primaryColor, width: 2 },
            itemStyle: {
              // borderWidth: 4,
              borderColor: primaryColor
            },
            areaStyle: {
              color: {
                type: "linear",
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: primaryColor // 0% 处的颜色
                  },
                  {
                    offset: 0.1,
                    color: gradualColor // 100% 处的颜色
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
