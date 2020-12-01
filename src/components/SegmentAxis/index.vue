<template>
  <div class="SegmentAxis">
    <!-- 坐标轴 -->
    <section class="segment-axis">
      <div class="segment-axis-detail">
        <div
          v-for="item in sections"
          :key="item"
          class="axis-unit"
          :class="{
            'axis-unit-long': !(item % unit) || !item,
            'axis-unit-inuse': item > enablePrefixLen
          }"
        >
          <a
            class="axis-label"
            v-if="!(item % unit)"
          >{{item}}</a>
        </div>
      </div>
    </section>

    <!-- 分段显示 -->
    <section class="segment-section">
      <div
        class="segment-section-item "
        key="begin-segment"
        :style="{ flex: enablePrefixLen , backgroundColor: startSegment.color }"
      />
      <div
        class="segment-section-item"
        key="end-segment"
        :style="{ flex: maskLen - enablePrefixLen, backgroundColor:endSegment.color }"
      />
      <div
        class="segment-section-item segment-section-item-active"
        :style="{width: ( Number(bitWidth)/maskLen)*100+ '%' ,left: Number(prefixLen)/maskLen*100 +'%' }"
      />
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 总体可划分地址段前缀
    enablePrefixLen: {
      type: Number,
      default: 0
    },
    prefixLen: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | String,
      default: 0
    },
    bitWidth: {
      type: Number,
      default: 0
    }

  },
  data() {
    return {
      maskLen: 64,
      sections: [],
      unit: 8,
      startSegment: {
        color: "#EDEDED",
        value: 32
      },
      endSegment: {
        color: "rgba(69,134,254, .2)",
        value: 0
      }
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let count = -1;
      this.sections = new Array(this.maskLen + 1).fill("").map(() => ++count);
    }
  }
};
</script>

<style lang="less" scoped>
.segment-axis {
  margin-top: 16px;

  &-detail {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .axis-unit {
    height: 6px;
    width: 1px;
    background-color: rgba(155, 155, 155, 0.15);
    display: flex;
    justify-content: center;
  }

  .axis-label {
    font-size: 12px;
    color: #ccc;
    margin-top: -20px;
    display: block;
  }

  .axis-unit-long {
    height: 10px;
  }

  .axis-unit-inuse {
    background-color: rgba(155, 155, 155, 0.4);

    .axis-label {
      color: #333;
    }
  }
}

.segment-section {
  position: relative;
  display: flex;
  margin-top: 2px;
  border-radius: 3px;
  overflow: hidden;

  &-item {
    height: 10px;
    display: flex;
    justify-content: center;
  }
  &-item-active {
    position: absolute;
    background: #4586FE;
  }
}
</style>