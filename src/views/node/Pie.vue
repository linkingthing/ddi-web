<template>
  <Chart :options="options"></Chart>
</template>

<script>
import Chart from "./Chart";

export default {
  name: "ChartLine",
  props: {
    values: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  components: { Chart },
  computed: {
    options() {
      console.log(this.values.map(item => item.key))
      const labels = this.values.map(item => item.key)
      const data = this.values.map(item =>({
        name: item.key,
        value: item.doc_count
      }))
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
          data: labels//["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
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
            data: data
          }
        ]
      };
    }
  }
};
</script>
