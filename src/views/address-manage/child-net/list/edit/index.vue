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
        <Input v-model="subnet" placeholder="请输入子网地址" class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">子网名称</div>
        <Input v-model="name" placeholder="请输入子网名称" class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">网关地址</div>
        <Input v-model="gateway" placeholder="请输入网关地址" class="info-row-input" />
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
      id:"",
      subnet:"",
      name:"",
      gateway:"",
      isEdit:false
    }
  },

  computed:{
    getTitle(){
      return (this.isEdit ? "编辑" : "添加") + "子网";
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

      this.id = val.subnet_id;
      this.subnet = val.subnet;
      this.name = val.name;
      this.gateway = val.gateway;
    },

    dialogVisible(val){
      this.$emit("update:visible", val)
    }
  },

  methods:{
    init(){
      this.id = "";
      this.subnet = "";
      this.name = "";
      this.gateway = "";
    },

    handleCancel(){

    },

    async handleConfirm(){
      try {
        const action = this.isEdit ? "editChildNet" : "addChildNet";

        let res = await service[action](this.getParams(), this.id);
        
        console.log(res);
        

        this.init();

        this.$emit("confirmed")
      } catch (err) {
        console.error(err);
      }
    },

    getParams(){
      return {
        subnet:this.subnet,
        name:this.name,
        gateway:this.gateway
      }
    }
  }
}
</script>

<style>

</style>