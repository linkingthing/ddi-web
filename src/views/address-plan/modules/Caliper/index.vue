<template>
  <div class="calipers" ref="calipers">
    <div class="top-show" :style="`right: ${right}; letter-spacing:${letterSpace}` ">{{netcodeBit}}</div>
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
    },
    netcode: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      letterSpace: "1px",
      innerValue: [0, 0]
    };
  },
  computed: {
    netcodeBit() {
      const [min, max] = this.innerValue;
      const len = max - min;
      const bit = this.netcode.toString(2);
      console.log(typeof bit);
      return (Array(len).join("0") + bit).slice(-len);
    },
    right() {
      const [, max] = this.innerValue;
      return ((64 - max) / 64) * 100 + "%";
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
  mounted() {
    const calipers = this.$refs.calipers;
    const width = getComputedStyle(calipers).width;
    const letterWidth = parseFloat(width)/64;
    this.letterSpace = letterWidth - 9.3 + "px";
  },
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
    position: absolute;
    top: -2px;
    letter-spacing: 2px;
    color: #555;
    font-family: "Helvetica Neue";
  }
  .ivu-slider-bar {
    opacity: 0.4;
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

    .ivu-slider-button-wrap {
      .ivu-slider-button {
        border-radius: 0;
        width: 0;
        background: inherit;
      }
    }
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