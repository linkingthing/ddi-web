<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="750"
    title="规划网络"
    :buttons="buttons"
    :close-immediately-when-confirm="true"
    custom-class="create-layout"
    @confirm="handleConfirm"
    @save="handleSave"
    @next-step="handleNextStep"
  >
    <IviewLoading v-if="loading" />

    <div slot="header-right" v-if="step > 1">
      <Button 
        class="prev-step"
        @click="handlePrevStep"
      >
        <img :src="backImg" class="back-img">
        上一页
      </Button>
    </div>
    
    <FirstStep 
      ref="firstStep"
      v-if="step === 1" 
      :layout-id="layoutId"
      :segments="segmentWidths"
      :url="url"
    />
    
    <SecondStep 
      ref="secondStep"
      v-if="step === 2" 
      :segment="segmentWidths"
      :url="url"
    />
    
    <ThirdStep
      ref="thirdStep"
      v-if="step === 3" 
      :layout-id="layoutId"
      :url="url"
    />
  </common-modal>
</template>

<script>
import FirstStep from "./first-step";
import SecondStep from "./second-step";
import ThirdStep from "./third-step";

import backImg from "@/assets/images/back.png";

import { getAddressType } from "@/util/common";

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

    /**
     * 规划所设置的该IP的掩码长度
     */
    maskLen: {
      type: Number,
      default: 0
    },

    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      backImg,
      loading: false,
      dialogVisible: false,
      mask: 0,
      step: 1,
      buttons: [
        {
          label: "取消",
          type: "default",
          class: "button-cancel",
          event: "cancel"
        },
        {
          label: "下一步",
          type: "primary",
          event: "nextStep"
        }
      ],

      segmentWidths: [],

      ipType: "",
      layoutId: null,
      segmentId: null,

      layoutData: {},
      segmentData: {}
    };
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.init();

      this.$emit("update:visible", val);
    },

    prefix: {
      immediate: true,
      handler(val) {
        if (!val) return;

        let temp = val.split("/");
    
        this.mask = parseInt(temp[1]);
        this.ipType = getAddressType(temp[0]);
      }
    }

    // data(val) {      
    //   this.setValue(val);
    // }
  },

  methods: {
    init(val) {
      this.step = 1;
      this.layoutData = {};
      this.segmentData = {};
      this.mask = 0;

      this.setValue(val);
    },

    setValue(val = {}) {
      this.layoutId = val.id || null;
      this.segmentId = val.segmentId || null;
    },

    handlePrevStep() {
      this.step--;
    },

    async handleNextStep() {
      try {
        if (this.step === 1) {
          await this.handleFirstConfirm();
        }
        else if (this.step === 2) {
          await this.handleSecondConfirm();
        }
        else if (this.step === 3) {
          await this.handleThirdConfirm();
        }

        this.step++;
      } catch (error) {
        console.error(error);
        
        this.$$error(error.message);  
      }
    },

    async handleFirstConfirm() {
      let params = await this.$refs.firstStep.getData();

      this.loading = true;

      try {
        let { id, segmentWidths } = await this.$post({ url: this.url, params } );
      
        this.layoutId = id;
        this.segmentWidths = segmentWidths;
      } 
      // eslint-disable-next-line no-empty
      catch (error) {}
      finally {
        this.loading = false;
      }
    },

    async handleSecondConfirm() {
      let params = await this.$refs.secondStep.getData();

      const len = params.length;

      this.loading = true;

      try {
        for (let i = 0; i < len; i++) {
          await this.saveSegment(params[i]);
        }
      } 
      // eslint-disable-next-line no-empty
      catch (error) {}
      finally {
        this.loading = false;
      }
    },

    saveSegment(params) {
      return this.$put({ url: `${this.url}/${this.layoutId}/segments/${params.id}`, params } );
    },

    handleThirdConfirm(res) {},

    handleSave(res) {},

    handleConfirm(res) {}
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>