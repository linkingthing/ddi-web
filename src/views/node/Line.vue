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
    isPercent: {
      type: Boolean,
      default: false
    },
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
  components: { Chart, NoDataFigure },
  computed: {
    options() {
      const { primaryColor, gradualColor } =
        ThemeConfig[this.lineTheme] || ThemeConfig.blue;
      const self = this;
      return {
        color: "#f80",
        grid: {
          left: "50px",
          right: "50px",
          top: "20px",
          bottom: "40px"
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
          },
          axisLabel: {
            // interval: 0,
            // rotate: "45"
            formatter: function (params) {
              return params.split(" ").join("\n");
            }
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
          },
          axisLabel: {
            formatter: function (params) {
              if (self.isPercent) {
                return Number(params) * 100 + "%";
              }
              return params;
            }
          }
        },
        tooltip: {
          // show: true,
          trigger: "axis",
          formatter: function ([data]) {
            if (self.isPercent) {
              return (Number(data.data) * 100).toFixed(2) + "%";
            }
            return Number(data.data);
          }
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

