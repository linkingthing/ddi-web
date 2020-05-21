<template>
  <div class="first-step">
    <section class="info-row-inline" v-if="!isEdit">
      <div class="info-row-label">网络名称：</div>
      <Input
        v-model="name"
        max="50"
        :disabled="disabled"
        placeholder="请填写网络名称"
        style="width:260px" />
    </section>

    <section class="layout-info" v-if="!isEdit">
      <div class="layout-info-item">
        <div class="item-value">{{canPlanLength}}</div>
        <div class="item-label">可规划长度</div>
      </div>
      <div class="layout-info-item">
        <div class="item-value">{{prefixPos}}-{{maskLen}}</div>
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
        class="segment-section-item is-begin" 
        key="begin-segement"
        :style="{ flex:startSegment.value, backgroundColor:startSegment.color }"
      >
        <div class="segment-section-item-name" v-if="showSegmentName">
          前缀
        </div>
      </div>
      <template v-if="endSegment.value >= 0">
        <div
          v-for="(segment,idx) in segmentWidths"
          class="segment-section-item" 
          :key="idx"
          :style="{ flex:segment.value, backgroundColor:segment.color }"
        >
          <div class="segment-section-item-name" v-if="showSegmentName">
            {{segment.value}}位
          </div>
        </div>
      </template>
      <div 
        v-if="endSegment.value"
        class="segment-section-item is-end" 
        key="end-segement"
        :style="{ flex:endSegment.value, backgroundColor:endSegment.color }"
      >
        <div class="segment-section-item-name" v-if="showSegmentName">
          {{endSegment.value}}位
        </div>
      </div>

      <div class="section-cursor" :style="{ left:cursorLeft }" />
    </section>

    <section class="segment-list-top" v-if="!isEdit">
      <div class="detail-top-left">
        剩余可分配前缀长度：<span>{{endSegment.value}}</span>
      </div>

      <Button
        type="default"
        :disabled="disabled"
        @click="handleAddSegment"
      >
        添加标识
      </Button>
    </section>

    <section class="segment-list" v-if="segmentWidths.length && !isEdit">
      <template v-for="(item, idx) in segmentWidths">
        <div
          class="segment-list-item"
          :key="idx"
        >
          <div class="item-label">{{item.name}} <span>长度：</span></div>
          <Input 
            placeholder="请填写长度"
            v-model="item.value"
            :disabled="disabled"
            maxlength="2"
            @on-change="handleSegmentValueChange(item)"
          />

          <img
            v-if="!disabled"
            class="item-delete"
            @click="handleDeleteSegment(idx)"
            :src="deleteImg">
        </div>
      </template>
    </section>

    <div class="segment-no-data" v-else-if="!isEdit">点击添加标识即可进行网络规划</div>
  </div>
</template>

<script>
import deleteImg from "./../images/delete.png";
import { isPosNumber } from "@/util/common";

const colors = ["#8041FF", "#4586FE", "#47D6FF"];

export default {
  props: {
    layoutId: {
      type: String,
      default: ""
    },

    isEdit: {
      type: Boolean,
      default: false
    },

    layoutName: {
      type: String,
      default: ""
    },
    
    url: {
      type: String,
      default: ""
    },

    showSegmentName: {
      type: Boolean,
      default: false
    },

    reset: {
      type: Boolean,
      default: false
    },

    segments: {
      type: Array,
      default: () => []
    }
  },

  data() {
    const { prefix, maskLen } = this.$route.query;

    const mask = parseInt(prefix.split("/")[1]);

    return {
      // 已规划长度
      mask,
      // 最大规划长度
      maskLen: parseInt(maskLen),
      deleteImg,
      name: "",
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
        value: mask
      },
      endSegment: {
        color: "rgba(69,134,254, .2)",
        value: 0
      }
    };
  },

  computed: {
    disabled() {
      return !!this.layoutId;
    }
  },

  watch: {
    async segments(val) {      
      let segments = await this.$get({ url: `${this.url}/${this.layoutId}/segments` } );

      this.segmentWidths = val.map((value, idx) => ({
        name: segments[idx].name || `标识${idx + 1}`,
        value,
        color: colors[idx % colors.length]
      }));      

      this.calcRestLen();
    },

    layoutName: {
      immediate: true,
      handler(val) {
        this.name = val;
      }
    },

    reset(val) {
      if (!val) return;

      this.doReset();

      this.$emit("update:reset", false);
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      // 总可规划长度
      this.canPlanLength = this.maskLen - this.mask;
      
      // 可规划地址的起始长度
      this.prefixPos = this.canPlanLength + 1;

      let count = 0;

      this.sections = new Array(this.maskLen / this.unit).fill([]).map(() => new Array(this.unit).fill(0).map(() => ++count));

      this.endSegment.value = this.canPlanLength;
    },

    doReset() {
      this.name = "";
      this.sections = [];
      this.segmentWidths = [];
      this.canPlanLength = 0;
      this.prefixPos = 0;
      this.cursorLeft = 0;
      // 剩余可规划长度
      this.startSegment = {
        color: "#EDEDED",
        value: this.mask
      };
      this.endSegment = {
        color: "rgba(69,134,254, .2)",
        value: 0
      };
    },

    /**
     * 格式化段的名称与颜色
     */
    formatSegmentNameAndColor() {
      this.segmentWidths.forEach((item, idx) => {
        item.name = `标识${++idx}`;
        item.color = colors[idx % colors.length];
      });
    },

    /**
     * 计算剩余可分配前缀长度
     */
    calcRestLen() {
      let total = 0;
      
      this.segmentWidths.forEach(item => {
        total += parseInt(item.value) || 0;
      });

      this.endSegment.value = this.maskLen - this.mask - total;
    },

    /**
     * 添加一个分段
     */
    handleAddSegment() {
      this.segmentWidths.push({});

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

    getData() {
      let res = this.segmentWidths;

      if (!this.name) {
        this.$$warning("请输入网络名称！");

        return Promise.reject();
      }
      
      if (!res.some(item => this.validateItem(item))) {
        this.$$warning("请输入正确的长度！");

        return Promise.reject();
      }

      if (this.endSegment.value < 0) {
        this.$$warning("长度之和不能大于可规划长度！");

        return Promise.reject();
      }

      return {
        name: this.name,
        segmentWidths: this.segmentWidths.map(item => parseInt(item.value))
      };
    },

    validateItem({ value }) {
      return isPosNumber(value);
    }
  }
};
</script>