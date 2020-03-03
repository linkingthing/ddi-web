<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    :title="getTitle"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <div class="child-net-info">
      <div class="info-row">
        <div class="info-row-label">子网地址</div>
        <Input v-model="childNetAddress" placeholder="请输入子网地址" class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">子网名称</div>
        <Input v-model="childNetName" placeholder="请输入子网名称" class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">网关地址</div>
        <Input v-model="childGateAddress" placeholder="请输入网关地址" class="info-row-input" />
      </div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom"

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
      type:Object,
      default: ()=> ({})
    }
  },

  data(){
    return {
      dialogVisible:false,
      childNetAddress:"",
      childNetName:"",
      childGateAddress:"",
      isEdit:false
    }
  },

  computed:{
    getTitle(){
      return (this.isEdit ? "编辑" : "添加") + "地址池";
    }
  },

  watch:{
    visible(val){
      if(!val) return;
      
      this.dialogVisible = val;
    },

    data(val){
      this.isEdit = !!val;

      if(!val) return;

      this.childNetAddress = val.childNetAddress;
      this.childNetName = val.childNetName;
      this.childGateAddress = val.childGateAddress;
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