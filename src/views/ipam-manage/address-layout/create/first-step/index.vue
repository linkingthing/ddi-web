<template>
  <div class="first-step">
    <section class="info-row">
      <div class="info-row-label">网络名称：</div>
      <Input
        v-model="name"
        placeholder="请填写网络名称"
        style="width:260px" />
    </section>

    <section class="layout-info">
      <div class="layout-info-item">
        <div class="item-value">{{canPlanLength}}</div>
        <div class="item-label">可规划长度</div>
      </div>
      <div class="layout-info-item">
        <div class="item-value">{{prefixPos}}-{{maxMask}}</div>
        <div class="item-label">当前缀位</div>
      </div>
    </section>

    <!-- 坐标轴 -->
    <section class="segment-axis">
      <div class="segment-axis-detail">
        <div
          v-for="(item, idx) in sections"
          :key="idx"
          class="axis-item">
          <div
            v-for="child in item"
            :key="child"
            :class="{
              'axis-unit-long': !(child % 8),
              'axis-unit-inuse': child > canPlanLength
            }"
            class="axis-unit">
            <a class="axis-label" v-if="!(child % 8)">{{child}}</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 分段显示 -->
    <section class="segment-section">
      <div 
        class="segment-section-item" 
        v-for="(segment,idx) in segmentWidths"
        :key="idx"
        :style="{ width:segment.width, backgroundColor:segment.color }"
        :class="{
          'is-begin': segment.tag === 'forbidden',
          'is-end': segment.tag === 'unuse'
        }"
      />

      <div class="section-cursor" :style="{ left:cursorLeft }" />
    </section>

    <section class="segment-list-top">
      <div class="detail-top-left">
        剩余可分配前缀长度：<span>{{restLen}}</span>
      </div>

      <Button
        type="default"
        @click="handleAddSegment"
      >
        添加标识
      </Button>
    </section>

    <section class="segment-list" v-if="segmentWidths.length > 2">
      <template v-for="(item, idx) in segmentWidths">
        <div
          class="segment-list-item"
          :key="idx"
          v-if="idx > 0 && idx < segmentWidths.length - 1"
        >
          <div class="item-label">{{item.name}} <span>长度：</span></div>
          <Input 
            placeholder="请填写长度"
            v-model="item.value"
            @on-change="handleSegmentValueChange(item)"
          />

          <img
            class="item-delete"
            @click="handleDeleteSegment(idx)"
            :src="deleteImg">
        </div>
      </template>
    </section>

    <div class="segment-no-data" v-else>点击添加标识即可进行网络规划</div>
  </div>
</template>

<script>
import deleteImg from "./../images/delete.png";

const colors = ["#8041FF", "#4586FE", "#47D6FF"];

export default {
  props: {
    mask: {
      type: Number,
      default: 0
    },

    maskLen: {
      type: Number,
      default: 0
    },

    ipType: {
      type: String,
      default: ""
    },

    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      deleteImg,
      planId: this.$route.params.plansId,
      name: "",
      maxMask: 0,
      sections: [],
      segmentWidths: [],
      canPlanLength: 0,
      prefixPos: 0,
      cursorLeft: 0,
      unit: 8,
      restLen: 0
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      const ipType = this.ipType;

      this.maxMask = ipType === "ipv4" ? 32 : 64;

      if (ipType === "ipv6") {
        this.canPlanLength = this.maxMask - this.mask;
      }
      else {
        this.canPlanLength = this.maskLen - this.mask;
      }

      this.restLen = this.canPlanLength;
      
      this.prefixPos = this.canPlanLength + 1;

      let count = 0;

      this.sections = new Array(this.maxMask / 8).fill([]).map(() => new Array(this.unit).fill(0).map(() => ++count));
      this.segmentWidths = [
        {
          width: this.calcSegmentItemWidth(this.mask),
          color: "#EDEDED",
          tag: "forbidden",
          value: this.mask
        },
        {
          width: this.calcSegmentItemWidth(this.canPlanLength),
          color: "rgba(69,134,254, .2)",
          tag: "unuse",
          value: this.canPlanLength
        }
      ];
    },

    /**
     * 格式化段的名称与颜色
     */
    formatSegmentNameAndColor() {
      const len = this.segmentWidths.length - 1;

      let count = 0;

      this.segmentWidths.forEach((item, idx) => {
        if (idx !== 0 && idx < len) {
          count++;

          item.name = `标识${count}`;
          item.color = colors[idx % colors.length];
        }
      });
    },

    /**
     * 计算剩余可分配前缀长度与段的宽度
     */
    calcRestLen() {
      const len = this.segmentWidths.length - 1;

      let total = 0;

      this.segmentWidths.forEach((item, idx) => {
        if (idx !== 0 && idx < len) {
          total += item.value || 0;
          item.width = this.calcSegmentItemWidth(item.value);
        }
      });

      this.restLen = this.maxMask - this.mask - total;

      let restItem = this.segmentWidths[len];

      restItem.value = this.restLen;
      restItem.width = this.calcSegmentItemWidth(this.restLen);
    },

    /**
     * 添加一个分段
     */
    handleAddSegment() {
      this.segmentWidths.splice(1, 0, {
        width: this.calcSegmentItemWidth()
      });

      this.formatSegmentNameAndColor();
    },

    /**
     * 当分段长度变化时，计算剩余可分配前缀长度
     */
    handleSegmentValueChange() {
      this.calcRestLen();
    },

    /**
     * 删除分段
     */
    handleDeleteSegment(idx) {
      this.segmentWidths.splice(idx, 1);

      this.formatSegmentNameAndColor();
    },

    /**
     * 计算段的宽度
     */
    calcSegmentItemWidth(value = 0) {
      return isNaN(value) ? 0 : parseFloat(value * 100 / this.maxMask) + "%";
    }
  }
};
</script>