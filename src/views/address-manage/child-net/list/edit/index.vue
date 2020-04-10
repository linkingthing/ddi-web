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
        <Input maxlength="50" v-model="subnet" placeholder="请输入子网地址" class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">子网名称</div>
        <Input maxlength="255" v-model="name" placeholder="请输入子网名称" class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">网关地址</div>
        <Input maxlength="50" v-model="gateway" placeholder="请输入网关地址" class="info-row-input" />
      </div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";
import service from '@/services';
import { isIPv4, isIPv6, getAddressType, gatewayIsValid } from "@/util/common"

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
        await this.validate();

        const action = this.isEdit ? "editChildNet" : "addChildNet";

        let { status, data, message } = await service[action](this.getParams(), this.id);

        status = +status;
        
        if(status === 200 || status === 201){
          this.$$success("保存成功！")
        }
        else{
          Promise.reject({ message })
        }

        this.init();

        this.$emit("confirmed")
      } 
      catch (err) {
        err = err || {};
        console.error(err);

        this.$$error(err.message || "保存失败！")
      }
    },

    validate(){
      let { subnet, name, gateway } = this;

      subnet = subnet.trim();
      name = name.trim();
      gateway = gateway.trim();

      const addrType = getAddressType(subnet);
      const gateType = getAddressType(gateway);

      if(addrType !== gateType){
        return Promise.reject({ message:"网关地址类型必须与子网地址类型一致！" })
      }

      // 验证子网地址
      if(!subnet){
        return Promise.reject({ message:"请输入子网地址！" });
      }
      else{        
        if(addrType === "ipv4"){
          if(!isIPv4(subnet)){
            return Promise.reject({ message:"请输入正确的子网地址！" });
          }
        }
        else if(addrType === "ipv6"){
          if(!isIPv6(subnet)){
            return Promise.reject({ message:"请输入正确的子网地址！" });
          }
        }
      }

      // 验证子网地址掩码
      if(!gatewayIsValid(subnet)){
          return Promise.reject({ message:"请输入正确的子网地址掩码！" });
      }

      // 验证子网名称
      if(!name){
        return Promise.reject({ message:"请输入子网名称！" })
      }
      else{
        if(name.length > 255){
          return Promise.reject({ message:"请输入正确的子网名称！" })
        }
      }

      // 验证网关名称
      if(!gateway){
        return Promise.reject({ message:"请输入网关地址！" })
      }
      else{        
        if(gateType === "ipv4"){
          if(!isIPv4(gateway)){
            return Promise.reject({ message:"请输入正确的网关地址！" });
          }
        }
        else if(gateType === "ipv6"){
          if(!isIPv6(gateway)){
            return Promise.reject({ message:"请输入正确的网关地址！" });
          }
        }
      }

      // 验证网关地址掩码
      if(!gatewayIsValid(gateway)){
          return Promise.reject({ message:"请输入正确的网关地址掩码！" });
      }

      return Promise.resolve();
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