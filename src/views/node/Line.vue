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
import moment from "moment";
moment.locale("zh-cn");

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
  components: { Chart, NoDataFigure },
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
    },
    multiple: {
      type: Boolean,
      default: false
    },
    seriesName: {
      type: String,
      default: ""
    },
    legend: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    options() {
      const { primaryColor, gradualColor } =
        ThemeConfig[this.lineTheme] || ThemeConfig.blue;
      const self = this;

      let series = [
        {
          name: self.seriesName || (self.isPercent ? "百分比" : "值"),

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
      ];
      let labels;
      if (this.multiple) {
        series = this.values.map(item => {
          labels = item.values.map(value => {
            return moment(value.timestamp).format("YYYY-MM-DD HH:mm:ss");
          });
          return {
            name: self.seriesName || item.packetType || item.rcode || item.type || "值",
            data: (item.values && item.values.map(item => item.value)) || (item.ratios && item.ratios.map(item => item.ratio)),
            type: "line",
            lineStyle: {
              width: 1,
              // type: "dotted"
            },
            smooth: true
          };
        });

      }

      return {
        color: ["#47B3FF", "#A485FD", "#FAA888", "#FECD5D"],
        legend: {
          data: this.legend
        },
        grid: {
          left: "55px",
          right: "50px",
          top: "20px",
          bottom: "40px"
        },
        xAxis: {
          type: "category",
          data: labels || this.labels,
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
                return (Number(params) * 100).toFixed(2) + "%";
              }
              return params;
            }
          }
        },

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          },
          formatter: function (value) {
            let title = value.length && value[0].name;
            return `<p>${title}</p>` + value.map(item => {
              return `<p>${item.marker}${item.seriesName}:${self.isPercent ? (Number(item.value) * 100).toFixed(2) + "%" : item.value}</p>`;
            }).join("");
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

        series
      };
    }
  }
};
</script>

