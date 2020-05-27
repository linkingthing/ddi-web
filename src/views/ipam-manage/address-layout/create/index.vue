<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="750"
    title="规划网络"
    :buttons="[]"
    custom-class="create-layout"
  >
    <IviewLoading v-if="loading" />

    <div slot="header-right" v-if="step > 1">
      <Button 
        class="prev-step"
        @click="handlePrevStep"
      >
        <img :src="backImg" class="back-img">
        上一步
      </Button>
    </div>
    
    <FirstStep 
      ref="firstStep"
      v-if="step === 1" 
      :reset.sync="resetFirst"
      :layout-id="layoutId"
      :segments="segmentWidths"
      :layout-name="layoutName"
      :url="url"
      :prefix="prefix"
      :mask-len="maskLen"
    />
    
    <SecondStep 
      ref="secondStep"
      v-if="step === 2" 
      :reset.sync="resetSecond"
      :layout-id="layoutId"
      :segments="segmentWidths"
      :url="url"
    />
    
    <ThirdStep
      ref="thirdStep"
      v-if="step === 3" 
      :reset.sync="resetThird"
      :layout-id="layoutId"
      :url="url"
    />

    <!-- 第一步 -->
    <template
      v-if="step === 1"
      slot="footer-left">
      <Button 
        type="default"
        class="button-cancel"
        @click="handleCancel"
      >
        取消
      </Button>

      <Button 
        type="primary"
        class="button-next"
        @click="handleNextStep"
      >
        下一步
      </Button>
    </template>

    <!-- 第二步 -->
    <div
      class="footer-buttons"
      v-if="step === 2"
      slot="footer">
      <Button 
        type="default"
        class="button-cancel"
        @click="handleCancel"
      >
        取消
      </Button>

      <div>
        <Button 
          type="warning"
          @click="handleSave"
        >
          保存
        </Button>

        <Button 
          type="primary"
          class="button-next"
          @click="handleNextStep"
        >
          继续规划
        </Button>
      </div>
    </div>

    <!-- 第三步 -->
    <template slot="footer-left" v-if="step === 3">
      <Button 
        type="default"
        class="button-cancel"
        @click="handleCancel"
      >
        取消
      </Button>

      <Button 
        type="primary"
        class="button-next"
        @click="handleComplete"
      >
        完成
      </Button>
    </template>
  </common-modal>
</template>

<script>
import FirstStep from "./first-step";
import SecondStep from "./second-step";
import ThirdStep from "./third-step";

import backImg from "@/assets/images/back.png";

export default {
  components: {
    FirstStep,
    SecondStep,
    ThirdStep
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    prefix: {
      type: String,
      default: ""
    },

    maskLen: {
      type: [Number, String],
      default: ""
    }
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      backImg,
      loading: false,
      dialogVisible: false,
      step: 1,
      resetFirst: false,
      resetSecond: false,
      resetThird: false,

      segmentWidths: [],
      layoutId: null,
      layoutName: ""
    };
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.init(val);

      this.$emit("update:visible", val);
    }
  },

  methods: {
    init(val) {
      this.step = Number(val);
      this.layoutId = null;
      this.layoutName = "";
      this.segmentWidths = [];
    },

    async handlePrevStep() {
      if (this.step === 2) {
        this.resetSecond = true;
      }
      else if (this.step === 3) {
        this.resetThird = true;
      }

      await this.$nextTick();

      this.step--;

      if (this.step === 1) {
        this.getLayout();
      }
    },

    async handleNextStep() {
      try {
        if (this.step === 1) {
          await this.saveLayout();
        }
        else if (this.step === 2) {
          await this.saveSegments();
        }

        this.step++;
      } 
      // eslint-disable-next-line no-empty
      catch (error) {}
    },

    async getLayout() {
      this.loading = true;

      try {
        let { segmentWidths } = await this.$get({ url: this.url + "/" + this.layoutId } );
      
        this.segmentWidths = segmentWidths;
      } 
      // eslint-disable-next-line no-empty
      catch (error) {}
      finally {
        this.loading = false;
      }
    },

    /**
     * 第一步 - 保存规划
     */
    async saveLayout() {
      if (this.layoutId) return; 

      let params = await this.$refs.firstStep.getData();

      this.loading = true;

      try {
        let { id, name, segmentWidths } = await this.$post({ url: this.url, params } );
      
        this.layoutId = id;
        this.segmentWidths = segmentWidths;
        this.layoutName = name;

        this.$emit("saved");
      } 
      // eslint-disable-next-line no-empty
      catch (error) {
        return Promise.reject();
      }
      finally {
        this.loading = false;
      }
    },

    /**
     * 第二步 - 继续规划
     */
    async saveSegments() {
      let params = await this.$refs.secondStep.getData();

      const len = params.length;

      this.loading = true;

      try {
        for (let i = 0; i < len; i++) {
          await this.saveSegmentItem(params[i]);
        }
      } 
      // eslint-disable-next-line no-empty
      catch (error) {
        return Promise.reject();
      }
      finally {
        this.loading = false;
      }
    },

    /**
     * 保存每一个网段
     */
    saveSegmentItem(params) {
      return this.$put({ url: `${this.url}/${this.layoutId}/segments/${params.id}`, params } );
    },

    /**
     * 第二步 - 保存
     */
    async handleSave() {
      try {
        await this.saveSegments();

        this.$emit("saved");

        this.handleCancel();
      } 
      // eslint-disable-next-line no-empty
      catch (error) {}
    },

    /**
     * 完成
     */
    handleComplete() {
      this.dialogVisible = false;

      this.$emit("saved");
    },
    
    /**
     * 取消
     */
    handleCancel() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>