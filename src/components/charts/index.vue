<template>
  <div class="i-charts" ref="chart" id="chart" style="width:100%;height:376px"></div>
</template>

<script>
import echarts from "echarts";
export default {
  components: {},
  props: {
    options: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      myChart: null
    };
  },
  created() {},
  mounted() {
    this.getEchartData();
  },
  methods: {
    listenResize() {
      this.myChart.resize();
    },
    getEchartData() {
      const chart = this.$refs.chart;
      if (chart) {
        const myChart = echarts.init(document.getElementById("chart"));
        this.myChart = myChart;

        const option = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: 10,
            data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
          },
          series: [
            {
              name: "访问来源",
              type: "pie",
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
        
        myChart.setOption(option);
        window.addEventListener("resize", this.listenResize);
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.listenResize);
  }
};
</script>
<style lang="less" scoped>

</style>