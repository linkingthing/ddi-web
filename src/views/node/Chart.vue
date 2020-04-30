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
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    options: {
      handler: function () {
        this.initChart();
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>