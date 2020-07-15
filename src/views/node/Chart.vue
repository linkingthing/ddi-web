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
      default: "width:100%;height:280px"
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
  watch: {
    options: {
      handler: function (values) {
        if (this.chart) {
          this.chart.setOption(values, true);
        }

      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.chart.resize);
    this.chart.dispose();
    this.chart = null;
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
  }
};
</script>

<style lang="less" scoped>
</style>