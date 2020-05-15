<template>
  <common-modal  
    :visible.sync="dialogVisible"
    title="规划网络"
    :buttons="buttons"
    @confirm="handleConfirm"
    @next-step="handleNextStep"
  >
    <IviewLoading v-if="loading" />

    <div slot="header-right">
      <Button 
        icon="ios-undo"
        class="prev-step"
        @click="handlePrevStep"
      >
        上一页
      </Button>
    </div>
    
    <FirstStep 
      v-show="step === 1" 
      @confirm="handleFirstConfirm"
    />
    
    <SecondStep 
      v-show="step === 2" 
      @confirm="handleSecondConfirm"
    />
    
    <ThirdStep
      v-show="step === 3" 
      @confirm="handleThirdConfirm"
    />
  </common-modal >
</template>

<script>
import FirstStep from "./first-step";
import SecondStep from "./second-step";
import ThirdStep from "./third-step";

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

    url: {
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
      loading: false,
      dialogVisible: false,
      prefix: "",
      step: 1,
      buttons: [
        {
          label: "取消",
          type: "cancel",
          class: "button-cancel",
          event: "cancel"
        },
        {
          label: "下一步",
          type: "primary",
          event: "nextStep"
        }
      ],

      layoutId: null,
      segmentId: null
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

    data(val) {      
      this.setValue(val);
    }
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

    handleThirdConfirm(res) {}
  }
};
</script>