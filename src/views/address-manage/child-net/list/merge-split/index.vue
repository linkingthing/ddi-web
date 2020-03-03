<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    :title="getTitle"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <div class="child-net-info">
      <div class="info-row">
        <div class="info-row-label">IP地址</div>
        <Input v-model="ipAddress" placeholder="请输入IP地址" class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">子网掩码</div>
        <Input v-model="subnetMask" placeholder="请输入子网掩码" class="info-row-input" />
      </div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";

import { operateTypes } from "./../define"

export default {
  components:{
    ModalCustom
  },

  props:{
    visible:{
      type: Boolean,
      default: false
    },

    data:{
      type:Array,
      default: () => []
    },

    type:{
      type:String,
      default:operateTypes.merge
    }
  },

  data(){
    return {
      dialogVisible:false,
      ipAddress:"",
      subnetMask:""
    }
  },

  computed:{
    getTitle(){
      return "子网" + (this.type === operateTypes.merge ? "合并" : "拆分");
    }
  },

  watch:{
    visible(val){
      if(!val) return;
      
      this.dialogVisible = val;
    },

    data(val){      
      if(!val.length) return;

      // this.ipAddress = val.ipAddress;
      // this.subnetMask = val.subnetMask;
    },

    dialogVisible(val){
      this.$emit("update:visible", val)
    }
  },

  methods:{
    handleCancel(){

    },

    handleConfirm(){
      
    }
  }
}
</script>

<style>

</style>