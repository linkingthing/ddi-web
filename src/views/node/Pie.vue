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
        color: ["#4089FF", "#FECD5D", "#FD8F64", "#D5E4A6"],

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: 10,
          bottom: "center",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            center: [130, "center"],

            radius: ["60%", "90%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      };
    }
  }
};
</script>
