<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="750"
    title="查看规划"
    :buttons="buttons"
    :close-async-when-confirm="true"
    custom-class="edit-layout"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />
    
    <FirstStep 
      ref="firstStep"
      :is-edit="true"
      :segments="segmentWidths"
      :show-segment-name="true"
    />
    
    <SecondStep 
      ref="secondStep"
      :layout-id="layoutId"
      :segment="segmentWidths"
      :url="url"
    />
  </common-modal>
</template>

<script>
import FirstStep from "./../create/first-step";
import SecondStep from "./../create/second-step";

export default {
  components: {
    FirstStep,
    SecondStep
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

    layoutId: {
      type: String,
      default: ""
    },

    segments: {
      type: Array,
      default: () => []
    },

    /**
     * 规划所设置的该IP的掩码长度
     */
    maskLen: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: false,
      dialogVisible: false,
      mask: 0,
      segmentWidths: [],
      buttons: [
        {
          label: "取消",
          type: "default",
          class: "button-cancel",
          event: "cancel"
        },
        {
          label: "保存",
          type: "primary",
          event: "confirm"
        }
      ]
    };
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },

    async segments(val) {
      if (!val || (val && !val.length)) return;

      await this.$nextTick();

      this.segmentWidths = [...val];
    },

    prefix: {
      immediate: true,
      handler(val) {
        if (!val) return;

        let temp = val.split("/");
    
        this.mask = parseInt(temp[1]);
      }
    }
  },

  methods: {
    async handleConfirm() {
      let params = await this.$refs.secondStep.getData();

      const len = params.length;

      this.loading = true;

      try {
        for (let i = 0; i < len; i++) {
          await this.saveSegment(params[i]);
        }

        this.$emit("confirmed");
      } 
      // eslint-disable-next-line no-empty
      catch (error) {}
      finally {
        this.loading = false;
      }
    },

    saveSegment(params) {
      return this.$put({ url: `${this.url}/${this.layoutId}/segments/${params.id}`, params } );
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>