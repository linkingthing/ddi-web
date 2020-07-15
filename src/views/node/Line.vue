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



      // console.log(this.values)

      let series = [
        {
          name: self.seriesName || (self.isPercent ? "百分比" : "值"),

          data: this.values,
          type: "line",

          smooth: true,
          symbol: "none",
          lineStyle: { color: primaryColor, width: 5 },
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

      if (this.multiple) {

        series = this.values.map(item => {

          return {
            name: self.seriesName || item.packetType || item.rcode || item.type || "值",
            data: (item.values && item.values.map(({ timestamp, value }) => [timestamp, value])) || (item.ratios && item.ratios.map(({ timestamp, ratio }) => [timestamp, ratio])),
            type: "line",
            symbol: "none",
            lineStyle: {
              width: 5
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
          right: "0",
          top: "30px",
          bottom: "40px"
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: true,
            axisTick: {
              length: 200
            }
          },
          splitLine: {
            show: false,
            color: "#D3D3D3"
          },

          min: function ({ min, max }) {
            return min - (max - min) * .05;
          },
          max: function ({ min, max }) {
            return max + (max - min) * .05;
          },
          // splitNumber: 10,
          boundaryGap: ["10%", "10%"],

          axisLine: {
            show: false
          },
          axisLabel: {

            interval: function (index) {
              const points = [0, 50, 100, 150, 200, 250, 300];
              return points.includes(index);
            },

            align: "center",
            showMinLabel: true,
            showMaxLabel: true,
            margin: 16,
            formatter: function (params) {
              // console.log(params)
              return moment(params).format("YYYY-MM-DD HH:mm:ss").split(" ").join("\n"); // params.split(" ")[0]; .format("YYYY-MM-DD HH:mm:ss")
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          boundaryGap: false,

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
          // axisPointer: {
          //   type: "cross",
          //   label: {
          //     backgroundColor: "#6a7985"
          //   }
          // },
          formatter: function (value) {
            let title = value.length && value[0].name;
            return `<p>${moment(title).format("YYYY-MM-DD HH:mm:ss")}</p>` + value.map(item => {
              return `<p>${item.marker}${item.seriesName}:${self.isPercent ? (Number(item.value[1]) * 100).toFixed(2) + "%" : item.value[1]}</p>`;
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

