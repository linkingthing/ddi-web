<template>
  <common-modal 
    :visible.sync="dialogVisible"
    :width="560"
    title="网络探测"
    custom-class="net-search"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" text="正在检测，这个过程可能需要几分钟，请耐心等待" />
    <div class="child-net-info">
      <div class="info-row">
        <div class="info-row-label">网络地址：</div>
        <div>{{data[0] ? data[0].ip : ""}}</div>
      </div>
      <div class="info-row">
        <div class="info-row-label">探测协议：</div>
        <Select
          v-model="protocal"
          multiple
          @on-change="handleSelect">
          <Option 
            v-for="item in protocals" 
            :value="item.value" 
            :key="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </div>
      <!-- <div class="info-row row-selected">
        <Tag 
          v-for="(item, idx) in selectedProtocals" 
          :key="item" 
          :name="item" 
          closable 
          @on-close="handleDeleteItem(idx)"
        >
          {{item}}
        </Tag>
      </div> -->
    </div>
  </common-modal>
</template>

<script>
import service from "@/services";
import { protocals } from "./../define";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    subnetId: {
      type: String,
      default: ""
    },

    data: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      dialogVisible: false,
      protocals: protocals(),
      protocal: [],
      selectedProtocals: [],
      loading: false
    };
  },

  watch: {
    visible(val) {
      if (!val) {
        this.protocal = [];
        this.selectedProtocals = [];

        return;
      }
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    }
  },

  methods: {
    handleSelect(val) {
      this.selectedProtocals = [...val];
    },

    handleDeleteItem(idx) {
      this.protocal.splice(idx, 1);
      this.selectedProtocals.splice(idx, 1);
    },

    async handleConfirm() {
      try {
        this.loading = true;

        let { status, message } = await service.addressScanning(this.data[0].id);

        if (status === 200) {
          this.$$message("操作成功！");
          
          this.$emit("confirmed");
        }
        else {
          Promise.reject({ message });
        }

        this.loading = false;
      } catch (err) {
        console.error(err);

        this.$$error(err.message || "操作失败！");

        this.loading = false;

        return Promise.reject();
      }
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>