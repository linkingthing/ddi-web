<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    :title="getTitle"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <div class="option-config-info">
      <div class="info-row">
        <div class="info-row-label">名称</div>
        <Input v-model="optionName" placeholder="请输入OPTION名称" class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">类型</div>
        <Input v-model="optionType" placeholder="请输入类型" class="info-row-input" />
      </div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";
import service from '@/services'

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
      optionId:"",
      optionName:"",
      optionType:"",
      isEdit:false
    }
  },

  computed:{
    getTitle(){
      return (this.isEdit ? "编辑" : "添加") + "OPTION";
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

      this.optionId = val.optionId;
      this.optionName = val.optionName;
      this.optionType = val.optionType;
    },

    dialogVisible(val){
      this.$emit("update:visible", val)
    }
  },

  methods:{
    init(){
      this.optionId = "";
      this.optionName = "";
      this.optionType = "";
    },

    handleCancel(){
      this.init();
    },

    async handleConfirm(){
      try {
        const action = this.isEdit ? "editOption" : "addOption";

        let res = await service[action](this.getParams(), this.optionId);
        
        console.log(res);
        

        this.init();

        this.$emit("confirmed")
      } catch (err) {
        console.error(err);
      }
    },

    getParams(){
      return {
        optionId:this.optionId,
        optionName:this.optionName,
        optionType:this.optionType,
        optionVer:this.data ? this.data.optionVer : ""
      }
    }
  }
}
</script>

<style>

</style>