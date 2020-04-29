<template>
  <Chart
    v-if="values.length"
    :options="options"
  />
  <figure
    v-else
    style="text-align:center;color: #666"
  >
    <img
      src="../../assets/images/empt.png"
      alt=""
    >
    <figcaption>
      暂无数据！
    </figcaption>
  </figure>

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
    }
  },
  components: { Chart },
  computed: {
    options() {
      const labels = this.values.map(item => item.name);
      return {
        color: ["#19be6b", "#4089FF", "#FECD5D", "#FD8F64"],

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: 10,
          bottom: "center",
          data: labels
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            center: [130, "center"],

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
            data: this.values
          }
        ]
      };
    }
  }
};
</script>
