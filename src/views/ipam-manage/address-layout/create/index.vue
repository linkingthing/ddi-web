<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="750"
    title="规划网络"
    :buttons="buttons"
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
      v-if="step === 1" 
      :mask="mask"
      :ip-type="ipType"
      @confirm="handleFirstConfirm"
    />
    
    <SecondStep 
      v-if="step === 2" 
      :mask="mask"
      :ip-type="ipType"
      @confirm="handleSecondConfirm"
    />
    
    <ThirdStep
      v-if="step === 3" 
      @confirm="handleThirdConfirm"
    />
  </common-modal >
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
      this.setValue();

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
    setValue(val = {}) {
      this.layoutId = val.id || null;
      this.segmentId = val.segmentId || null;
    },

    handlePrevStep() {
      this.step--;
    },

    handleNextStep() {
      this.step++;
    },

    handleFirstConfirm(res) {},

    handleSecondConfirm(res) {},

    handleThirdConfirm(res) {},

    handleSave(res) {},

    handleConfirm(res) {}
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>