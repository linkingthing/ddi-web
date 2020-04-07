<template>
  <div class="calipers">
    <div class="top-show" :style="`position: absolute;top:-20px; left: ${left};` ">010</div>
    <Slider v-model="innerValue" :step="1" :max="64" range :marks="marks" @on-change="handleChange"></Slider>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Array,
      default: () => [0, 0]
    }
  },
  data() {
    return {
      innerValue: [0, 0]
    };
  },
  computed: {
    left() {
      const [, max] = this.innerValue;
      return (max / 64) * 100 + "%";
    },
    marks() {
      const [start, end] = this.value;
      const map = {
        0: "0",
        64: "64"
      };
      map[start] = {
        style: {
          color: "#57a3f3"
        },
        label: this.$createElement("strong", `${start}`)
      };
      map[end] = {
        style: {
          color: "#57a3f3"
        },
        label: this.$createElement("strong", `${end}`)
      };
      return map;
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleChange(v) {
      let [, max] = v;
      const [initMin] = this.value;
      if (max < initMin) {
        max = initMin + 1;
      }
      this.innerValue = [initMin, max];
      this.$emit("onChange", [initMin, max]);
    }
  },
  watch: {
    value(v) {
      this.innerValue = v;
    }
  }
};
</script>

<style lang="less" >
.calipers {
  position: relative;
  height: 60px;
  .top-show {
  }
  .ivu-slider-wrap {
    margin: 0;
    height: 20px;
    background: linear-gradient(
      to right,
      #ddd,
      #ddd 1px,
      transparent 1px,
      transparent
    );
    background-size: 1.5625% 100%;
    border-bottom: 1px solid #ddd;
  }
  .ivu-slider-marks-item {
    margin-top: 25px;
  }
  .ivu-slider-bar {
    height: 100%;
  }
  .ivu-slider-button {
    height: 20px;
    width: 20px;
    margin-top: 5px;
  }
}
</style>