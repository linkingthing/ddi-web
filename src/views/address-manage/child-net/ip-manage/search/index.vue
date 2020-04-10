<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    title="网络探测"
    custom-class="net-search"
    @confirm="handleConfirm"
  >
    <div class="child-net-info">
      <div class="info-row">
        <div class="info-row-label">网络地址</div>
        <div>{{data[0] ? data[0].ipAddress : ""}}</div>
      </div>
      <div class="info-row">
        <div class="info-row-label">探测协议</div>
        <Select v-model="protocal" multiple @on-change="handleSelect">
          <Option v-for="item in protocals" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="info-row">
        <Tag 
          v-for="(item, idx) in protocal" 
          :key="idx" 
          :name="item.label" 
          closable 
          @on-close="handleDeleteItem(idx)"
        >
          标签
        </Tag>
      </div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";
import service from "@/services";

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
      default: []
    }
  },

  data(){
    return {
      dialogVisible:false,
      protocals:[],
      protocal:[]
    }
  },

  watch:{
    visible(val){
      if(!val) {
        this.protocal = [];

        return;
      }
      
      this.dialogVisible = val;
    },

    dialogVisible(val){
      this.$emit("update:visible", val)
    }
  },

  methods:{
    handleSelect(){

    },

    handleDeleteItem(){
      
    },

    async handleConfirm(){
      try {
        let {status, data} = await service.addressScanning(this.data[0].id);

        if(status === 200){
          console.log(data);
          
          this.$emit("confirmed")
        }
        else{
          Promise.reject({ message:data.message })
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
}
</script>

<style>
@import "./index.less";
</style>