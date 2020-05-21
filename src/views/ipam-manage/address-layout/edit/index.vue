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
      :layout-id="layoutId"
      :segments="segments"
      :url="url"
      :show-segment-name="true"
    />
    
    <SecondStep 
      ref="secondStep"
      :layout-id="layoutId"
      :segments="segments"
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

    layoutId: {
      type: String,
      default: ""
    },

    segments: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: false,
      dialogVisible: false,
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
      if (!val) {
        this.$emit("update:layoutId", null);
      }

      this.$emit("update:visible", val);
    }
  },

  methods: {
    async handleConfirm() {
      let params = await this.$refs.secondStep.getData();

      const len = params.length;

      this.loading = true;

      try {
        for (let i = 0; i < len; i++) {
          await this.saveSegmentItem(params[i]);
        }

        this.$emit("confirmed");

        this.dialogVisible = false;
      } 
      // eslint-disable-next-line no-empty
      catch (error) {}
      finally {
        this.loading = false;
      }
    },

    saveSegmentItem(params) {
      return this.$put({ url: `${this.url}/${this.layoutId}/segments/${params.id}`, params } );
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>