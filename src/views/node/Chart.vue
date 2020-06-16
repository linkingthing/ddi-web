<template>
  <div
    class="charts"
    ref="chart"
    :style="theme"
  />
</template>

<script>
import echarts from "echarts";

export default {
  components: {},
  props: {
    theme: {
      type: String,
      default: "width:100%;height:240px"
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chart: null
    };
  },
  computed: {},
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chartRef = this.$refs.chart;
      if (chartRef) {
        const myChart = echarts.init(chartRef);
        this.chart = myChart;
        // const defaultOption = {};
        // const option = Object.assign(null, defaultOption, this.options);
        myChart.setOption(this.options);
        window.addEventListener("resize", this.chart.resize);
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.chart.resize);
    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    options: {
      handler: function (values) {
        console.log("ren", values, this.chart)
        if (this.chart) {
          this.chart.clear();
          this.chart.setOption(values);

          // this.chart.showLoading();
        }

      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>