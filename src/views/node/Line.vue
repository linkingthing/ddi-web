<template>
  <Timeout v-if="isTimeOut"  style="height: 312px;"/>
  <Chart
    v-else-if="values && values.length"
    :options="options"
  />
  <NoDataFigure v-else />

</template>

<script>
import Timeout from "@/components/Timeout";
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
  },

  color1: {
    primaryColor: "#7283ff",
    gradualColor: "#95a6ff"
  },

  color2: {
    primaryColor: "#6396ff",
    gradualColor: "#94b5ff"
  },
  color3: {
    primaryColor: "#63b7ff",
    gradualColor: "#9fd3ff"
  },
  color4: {
    primaryColor: "#6ec9e7",
    gradualColor: "#9fe5ff"
  },
};


export default {
  name: "ChartLine",
  components: { Chart, NoDataFigure, Timeout },
  props: {
    isTimeOut: {
      type: Boolean,
      default: false
    },
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
    },
    showField: {
      type: String,
      default: ""
    },
    showLines: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    options() {
      const { primaryColor, gradualColor } =
        ThemeConfig[this.lineTheme] || ThemeConfig.blue;
      const self = this;


      let startTime = 0;
      let endTime = 0;
      const dateFormatMap = {
        general: "YYYY-MM-DD",
        minute: "YYYY-MM-DD HH:mm:ss"
      };
      let dateFormat = dateFormatMap["minute"];
      if (Array.isArray(this.values) && this.values.length) {
        const [start] = this.values;
        const end = this.values[this.values.length - 1];
        if (Array.isArray(start) && Array.isArray(end)) {
          startTime = start[0];
          endTime = end[0];
        }
        if (endTime - startTime >= 604800000) {
          dateFormat = dateFormatMap["general"];
        }
      }

      let series = [
        {
          animation: false,
          name: self.seriesName || (self.isPercent ? "百分比" : "值"),

          data: this.values,
          type: "line",

          smooth: true,
          symbol: "none",
          lineStyle: { color: primaryColor, width: 3 },
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

        const showLines = this.showLines;
        let color = void 0;

        series = this.values.map(item => {
          const name = this.seriesName || item.packetType || item.rcode || item.type || "值";
          const data = (Array.isArray(item.values) && item.values.map(({ timestamp, value }) => [timestamp, value])) || (Array.isArray(item.ratios) && item.ratios.map(({ timestamp, ratio }) => [timestamp, ratio]));

          if (showLines.length) {
            if (showLines.includes(item[this.showField])) {
              color = null;
            } else {
              color = "rgba(0, 0, 0, 0)";
            }
          }

          return {
            animation: false,
            name,
            data,
            type: "line",
            symbol: "none",
            lineStyle: {
              width: 3,
              color
            },
            smooth: true
          };
        });

      }

      return {
        color: ["#47B3FF", "#A485FD", "#FAA888", "#FECD5D"], // ["#7283ff", "#6396ff","#63b7ff","#6ec9e7"], //
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

            // interval: function (index,d,c) {
            //   const points = [0, 50, 100, 150, 200, 250, 300];
            //   return points.includes(parseInt(index));
            // },

            // showMinLabel: true,
            // showMaxLabel: true,
            margin: 16,
            formatter: function (params) {
              return moment(params).format(dateFormat).split(" ").join("\n");
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
          formatter: function (value) {
            let title = value.length && value[0].name;
            return `<p>${moment(title).format(dateFormat)}</p>` + value.map(item => {
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

