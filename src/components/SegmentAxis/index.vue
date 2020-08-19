<template>
  <div class="SegmentAxis">
    <!-- 坐标轴 -->
    <section class="segment-axis">
      <div class="segment-axis-detail">
        <div
          v-for="(item, idx) in sections"
          :key="idx"
          class="axis-unit"
          :class="{
            'axis-unit-long': !(item % 8) || !item,
            'axis-unit-inuse': item > canPlanLength
          }"
        >
          <a
            class="axis-label"
            v-if="!(item % 8)"
          >{{item}}</a>
        </div>
      </div>
    </section>

    <!-- 分段显示 -->
    <section class="segment-section">
      <div
        class="segment-section-item is-begin"
        key="begin-segment"
        :style="{ flex:startSegment.value, backgroundColor:startSegment.color }"
      >
        <!-- <div
          class="segment-section-item-name"
          v-if="showSegmentName"
        >
          前缀
        </div> -->
      </div>
      <template v-if="endSegment.value >= 0">
        <div
          v-for="segment in segmentWidths"
          class="segment-section-item"
          :key="segment.flag"
          :style="{ flex:segment.value, backgroundColor:segment.color }"
        >
          <div
            class="segment-section-item-name"
            v-if="showSegmentName"
          >
            {{segment.value}}位
          </div>
        </div>
      </template>
      <div
        v-if="endSegment.value"
        class="segment-section-item is-end"
        key="end-segment"
        :style="{ flex:endSegment.value, backgroundColor:endSegment.color }"
      >
        <div
          class="segment-section-item-name"
          v-if="showSegmentName"
        >
          {{endSegment.value}}位
        </div>
      </div>

      <div
        class="section-cursor"
        :style="{ left: cursorLeft }"
      />
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      mask: 0,
      maskLen: 64,
      sections: [],
      segmentWidths: [],
      // 总可规划长度
      canPlanLength: 0,
      // 可规划地址的起始长度
      prefixPos: 0,
      cursorLeft: 0,
      unit: 8,
      // 剩余可规划长度
      startSegment: {
        color: "#EDEDED",
        value: 20
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
      // 总可规划长度
      this.canPlanLength = this.maskLen - this.mask;

      // 可规划地址的起始长度
      this.prefixPos = this.mask + 1;

      let count = -1;

      this.sections = new Array(this.maskLen + 1).fill("").map(() => ++count);

      this.endSegment.value = this.canPlanLength;
    }
  }
};
</script>

<style lang="less" scoped>
.segment-axis {
  margin-top: 38px;

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
  display: flex;
  margin-top: 5px;

  &-item {
    height: 10px;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    position: relative;

    &.is-begin {
      border-radius: 3px 0 0 3px;
    }

    &.is-end {
      border-radius: 0 3px 3px 0;
    }
  }

  &-item-name {
    color: #999;
    font-size: 14px;
    line-height: 1;
    margin-top: 16px;
    position: absolute;
    white-space: nowrap;
  }

  .section-cursor {
  }
}
</style>